import React from "react";
import "./Button.scss";

const Button = ({ doClick, label }) => {
  return (
    <button className="button btn-primary" onClick={(e) => doClick(e)}>
      {label}
    </button>
  );
};

export default Button;
