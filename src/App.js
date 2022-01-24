import { useState, useEffect } from "react";
import "./App.scss";
import Table from "./components/Table";
import UploadButton from "./components/UploadButton";
import WorldMap from "./components/WorldMap";
import options from "./utils/options.json";

const getId = () => Math.random();

function App() {
  const [csvFile, setCsvFile] = useState();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [places, setPlaces] = useState([]);
  const { select } = options;

  useEffect(() => {}, [columns]);

  const processCSV = (str, delim = ",") => {
    const rawRows = str.split("\n");
    const maxCols = Math.max(...rawRows.map((row) => row.split(delim).length));
    let idArray = [];

    for (let i = 0; i < maxCols; i++) {
      idArray = [...idArray, getId()];
    }

    let columns = [];

    for (let i = 0; i < maxCols; i++) {
      columns = [
        ...columns,
        {
          id: idArray[i],
          value: select[i]?.value || "none",
          label: select[i]?.label || "none",
        },
      ];
    }

    const rows = rawRows.map((row) => {
      const values = row.split(delim).map((cell, i) => ({
        label: cell,
        id: idArray[i],
      }));

      return values;
    });

    setRows(rows);
    setColumns(columns);
  };

  const selectChange = ({ id, value }) => {
    setColumns((prevCols) => {
      let prevColumn = {};

      const updatedColumns = prevCols.map((col) => {
        if (col.id === id) {
          prevColumn = col;

          return {
            ...col,
            value,
            label: select.find((opt) => opt.value === value)?.label || null,
          };
        }

        return col;
      });

      const removeRepeatedValue = updatedColumns.map((newCol) => {
        if (id !== newCol.id && value === newCol.value) {
          return {
            ...newCol,
            value: prevColumn?.value,
            label: prevColumn?.label,
          };
        }

        return newCol;
      });

      return removeRepeatedValue;
    });
  };

  const submit = () => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      console.log(text);
      processCSV(text);
    };

    console.log("reader", reader);

    reader.readAsText(csvFile);
  };

  const transformData = () => {
    const applyCategory = rows.map((row) =>
      row.map((cell, i) => ({
        ...cell,
        type: columns.find((col) => col.id === cell.id).value,
      }))
    );

    setPlaces(applyCategory);
  };

  return (
    <div className="App">
      <div>
        <UploadButton
          onFileSelectSuccess={(file) => {
            console.log("file", file);
            setCsvFile(file);
          }}
          onFileSelectError={({ error }) => alert(error)}
        />
        <button
          onClick={(e) => {
            e.preventDefault();

            submit();
          }}
        >
          Apply
        </button>
      </div>
      {rows.length > 0 && (
        <Table rows={rows} columns={columns} selectChange={selectChange} />
      )}
      <button onClick={transformData}>Transform</button>
      {places.length > 0 && <WorldMap places={places} />}
    </div>
  );
}

export default App;
