import React, { useState } from "react";
import axios from "axios";

const GradCamApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradCamImage1, setGradCamImage1] = useState(null);
  const [gradCamImage2, setGradCamImage2] = useState(null);
  const [FilterResult, setFilterResult] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = "https://dog-suitable-visually.ngrok-free.app";

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const result = await axios.post(`${api}/Prediction`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
        },
      });
      setFilterResult(result.data);

      const response1 = await axios.post(`${api}/GradCamLayer1`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
        },
        responseType: "blob", // To handle the binary image data
      });

      const imageBlob1 = response1.data;
      const imageUrl1 = URL.createObjectURL(imageBlob1);
      setGradCamImage1(imageUrl1); // Set the image to display

      const response2 = await axios.post(`${api}/GradCamLayer2`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
        },
        responseType: "blob", // To handle the binary image data
      });

      const imageBlob2 = response2.data;
      const imageUrl2 = URL.createObjectURL(imageBlob2);
      setGradCamImage2(imageUrl2); // Set the image to display
    } catch (error) {
      console.error("Error uploading the file: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Grad-CAM Viewer</h1>
      <input type="file" onChange={handleFileChange} />
      <button
        className="btn btn-primary"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Generating Grad-CAM..." : "Upload and Generate Grad-CAM"}
      </button>

      {FilterResult && <h2>{FilterResult}</h2>}

      {gradCamImage1 && (
        <div>
          <h2>Generated Grad-CAM1:</h2>
          <img
            src={gradCamImage1}
            alt="Grad-CAM"
            style={{ width: "400px", height: "400px" }}
          />
        </div>
      )}

      {gradCamImage2 && (
        <div>
          <h2>Generated Grad-CAM2:</h2>
          <img
            src={gradCamImage2}
            alt="Grad-CAM"
            style={{ width: "400px", height: "400px" }}
          />
        </div>
      )}
    </div>
  );
};

export default GradCamApp;
