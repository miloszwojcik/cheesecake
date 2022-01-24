import React from "react";
import options from "../utils/options.json";

const limitText = "Data exceeded";

const Select = ({ column, selectChange }) => {
  const { id, value } = { ...column };
  const { select } = options;

  return (
    <select
      key={id}
      onChange={(e) => selectChange({ id, value: e.target.value })}
      value={value}
    >
      <option value="none" disabled hidden>
        {limitText}
      </option>
      {select.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default Select;
