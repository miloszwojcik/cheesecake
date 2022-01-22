import React from "react";

export default function Table({ columns, rows, getSelect }) {
  return (
    <div role="table" aria-label="location table">
      <div role="rowgroup">
        <div role="row">
          {columns.map((column) => (
            <span role="columnheader">{getSelect(column)}</span>
          ))}
        </div>
      </div>
      <div role="rowgroup">
        {rows.map((row, i) => (
          <div role="row" aria-rowindex={i} key={i}>
            {row.map((rowData) => (
              <span role="cell" key={rowData.id}>
                {rowData.label}
                {rowData.id}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
