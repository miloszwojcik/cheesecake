import Table from "./Table";
// import WorldMap from "./WorldMap";

export default function CsvReader({ rows, columns, getSelect }) {
  return (
    <>
      {/* <form id="csv-form">
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
      </form> */}
      {rows.length > 0 && (
        <Table rows={rows} columns={columns} getSelect={getSelect} />
      )}
      {/* <button onClick={transformData}>Transform</button>
      {places.length > 0 && <WorldMap places={places} />} */}
    </>
  );
}
