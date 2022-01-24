import { useState, useEffect } from "react";
import Table from "./components/Table/Table";
import UploadButton from "./components/UploadButton";
import WorldMap from "./components/WorldMap";
import options from "./utils/options.json";
import Paper from "./Layout/Paper";
import Button from "./components/Button/Button";
import "./App.scss";

const getId = () => Math.random();

function App() {
  const [csvFile, setCsvFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [places, setPlaces] = useState([]);
  const { select } = options;

  useEffect(() => csvFile && submit(), [csvFile]);

  const processCSV = (str, delim = ",") => {
    const rawRows = str.split("\n");
    const maxCols = Math.max(...rawRows.map((row) => row.split(delim).length));
    let idArray = [];
    const maxRows = 20;

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

    const sliceRows = rows.slice(0, maxRows);

    if (rows.length > maxRows) {
      alert(`Max number of rows ${maxRows}.`);
    }

    setRows(sliceRows);
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

      setRows([]);
      setColumns([]);
      setPlaces([]);

      processCSV(text);
    };

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
      <Paper gridArea="upload">
        <UploadButton
          onFileSelectSuccess={(file) => setCsvFile(file)}
          onFileSelectError={({ error }) => alert(error)}
        />
      </Paper>
      {rows.length > 0 && (
        <>
          <Paper gridArea="table">
            <Table rows={rows} columns={columns} selectChange={selectChange} />
          </Paper>
          <Paper gridArea="transform">
            <Button doClick={transformData} label="Transform" />
          </Paper>
        </>
      )}

      {places.length > 0 && (
        <Paper gridArea="map">
          <WorldMap places={places} />{" "}
        </Paper>
      )}
    </div>
  );
}

export default App;
