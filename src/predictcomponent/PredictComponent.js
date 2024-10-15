import React, { useState } from "react";
import axios from "axios";

function PredictComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [ImageResult, setImageResult] = useState(null);

  let api='https://dog-suitable-visually.ngrok-free.app'

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadedImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${api}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "ngrok-skip-browser-warning": "true"
          },
        }
      );

      setImageResult(response.data.result);
    } catch (error) {
      console.error("Error uploading the file", error);
    }
  };

  return (
    <div className="container pt-4">
      <div
        className="pb-3"
        style={{ display: "flex", justifyContent: "center" }}
      >
        {uploadedImage && (
          <div>
            <img
              src={uploadedImage}
              alt="Uploaded"
              style={{ width: "20rem", height: "auto" }}
            />
        {ImageResult && <h4 className="text-center py-2 bg-danger">{ImageResult}</h4>}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="pt-2 pb-2">
          <input
            className="form-control btn btn-primary"
            style={{ fontSize: "1.2rem", width: "100%" }}
            type="file"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'center'}}>
      <div
        className="btn btn-outline-primary px-4 py-2 mt-4"
        style={{ fontSize: "1.2rem" }}
        onClick={handleUpload}
      >
        Upload and Process
      </div>
      </div>
      
    </div>
  );
}

export default PredictComponent;
