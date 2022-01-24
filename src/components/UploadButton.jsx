import React, { useRef } from "react";
import Button from "./Button/Button";

const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
  const fileInput = useRef(null);

  const handleFileInput = (e) => {
    const file = e.target.files[0];

    if (file.size > 1024)
      onFileSelectError({ error: "File size cannot exceed more than 1MB" });
    else onFileSelectSuccess(file);
  };

  const onClick = (e) => fileInput.current && fileInput.current.click();

  return (
    <div className="file-uploader">
      <input
        type="file"
        accept=".csv"
        id="csvFile"
        onChange={handleFileInput}
        ref={fileInput}
        style={{ display: "none" }}
      />
      <Button doClick={onClick} label="Upload" />
    </div>
  );
};

export default FileUploader;
