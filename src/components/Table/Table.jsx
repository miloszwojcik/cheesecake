import React from "react";
import Select from "../Select";
import "./Table.scss";

export default function Table({ columns, rows, selectChange }) {
  return (
    <div className="table" role="table" aria-label="location table">
      <div className="rowgroup" role="rowgroup">
        <div className="row" role="row">
          {columns.map((column, i) => (
            <span className="columnheader" role="columnheader" key={i}>
              <Select column={column} selectChange={selectChange} />
            </span>
          ))}
        </div>
      </div>
      <div className="rowgroup" role="rowgroup">
        {rows.map((row, i) => (
          <div className="row" role="row" aria-rowindex={i} key={i}>
            {row.map((rowData) => (
              <span className="cell" role="cell" key={rowData.id}>
                {rowData.label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
