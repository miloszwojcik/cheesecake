import React from "react";

export default function Table({ columns, rows, getSelect }) {
  return (
    <div className="table" role="table" aria-label="location table">
      <div className="rowgroup" role="rowgroup">
        <div className="row" role="row">
          {columns.map((column, i) => (
            <span className="columnheader" role="columnheader" key={i}>
              {getSelect(column)}
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
