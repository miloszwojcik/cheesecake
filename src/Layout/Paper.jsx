import React from "react";
import "./Paper.scss";

const Paper = ({ children, gridArea }) => {
  return (
    <div className="paper-wrapper" style={{ gridArea }}>
      {children}
    </div>
  );
};

export default Paper;
