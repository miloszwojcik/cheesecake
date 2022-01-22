import { useState } from "react";
import Table from "./Table";

const getId = () => Math.random();

const options = [
  { label: "City", value: "city" },
  { label: "State", value: "state" },
  { label: "Zip", value: "zip" },
  { label: "Address", value: "address" },
  { label: "Category", value: "category" },
];

export default function CsvReader() {
  const [csvFile, setCsvFile] = useState();
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

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
        { id: idArray[i], value: options[i].value, label: options[i].label },
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
    setColumns((prevCols) =>
      prevCols.map((col) => {
        if (col.id === id) {
          return {
            ...col,
            value,
            label: options.find((opt) => opt.value === value).label,
          };
        }

        return col;
      })
    );
  };

  const getSelect = ({ id, value }) => (
    <select
      key={id}
      onChange={(e) => selectChange({ id, value: e.target.value })}
      value={value}
    >
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
            if (csvFile) submit();
          }}
        >
          Submit
        </button>
      </form>
      {rows.length > 0 && (
        <Table rows={rows} columns={columns} getSelect={getSelect} />
      )}
    </>
  );
}
