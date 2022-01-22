import { useState, useEffect } from "react";
import Table from "./Table";

const getId = () => Math.random();

const options = [
  { label: "City", value: "city" },
  { label: "State", value: "state" },
  { label: "Zip", value: "zip" },
  { label: "Address", value: "address" },
  { label: "Category", value: "category" },
];

const limitText = "Max number of columns exceeded";

export default function CsvReader() {
  const [csvFile, setCsvFile] = useState();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

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
          value: options[i]?.value || "none",
          label: options[i]?.label || "none",
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
            label: options.find((opt) => opt.value === value)?.label || null,
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

  const getSelect = ({ id, value }) => (
    <select
      key={id}
      onChange={(e) => selectChange({ id, value: e.target.value })}
      value={value}
    >
      <option value="none" disabled hidden>
        {limitText}
      </option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );

  const submit = () => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      console.log(text);
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

    console.log("applyCategory", applyCategory);
  };

  return (
    <>
      <form id="csv-form">
        <input
          type="file"
          accept=".csv"
          id="csvFile"
          onChange={(e) => {
            setCsvFile(e.target.files[0]);
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();

            csvFile && submit();
          }}
        >
          Submit
        </button>
      </form>
      {rows.length > 0 && (
        <Table rows={rows} columns={columns} getSelect={getSelect} />
      )}
      <button onClick={transformData}>Transform</button>
    </>
  );
}
