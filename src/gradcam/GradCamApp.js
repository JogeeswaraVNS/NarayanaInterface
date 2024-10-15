import React, { useState } from "react";
import axios from "axios";

const GradCamApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradCamImage1, setGradCamImage1] = useState(null);
  const [gradCamImage2, setGradCamImage2] = useState(null);
  const [gradCamImage3, setGradCamImage3] = useState(null);
  const [gradCamImage4, setGradCamImage4] = useState(null);
  const [FilterResult, setFilterResult] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = "https://dog-suitable-visually.ngrok-free.app";

  const handleFileChange = (event) => {
    try {
      setFilterResult(false);
      setGradCamImage1(false);
      setGradCamImage2(false);
      setGradCamImage3(false);
      setGradCamImage4(false);
      setSelectedFile(event.target.files[0]);
      setUploadedImage(URL.createObjectURL(event.target.files[0]));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    setFilterResult(false);
    setGradCamImage1(false);
    setGradCamImage2(false);
    setGradCamImage3(false);
    setGradCamImage4(false);

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

      const response3 = await axios.post(`${api}/GradCamLayer3`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
        },
        responseType: "blob", // To handle the binary image data
      });

      const imageBlob3 = response3.data;
      const imageUrl3 = URL.createObjectURL(imageBlob3);
      setGradCamImage3(imageUrl3); // Set the image to display

      const response4 = await axios.post(`${api}/GradCamLayer4`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "ngrok-skip-browser-warning": "true",
        },
        responseType: "blob", // To handle the binary image data
      });

      const imageBlob4 = response4.data;
      const imageUrl4 = URL.createObjectURL(imageBlob4);
      setGradCamImage4(imageUrl4); // Set the image to display
    } catch (error) {
      console.error("Error uploading the file: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 text-white pt-3">
      <h3>
        The system is integrated with Explainable AI through Grad-CAM Viewer
      </h3>

      <div className="row text-center pt-3">
        <div className="col-2">
          {uploadedImage && (
            <div className="mb-3">
              <img
              className="p-0"
                src={uploadedImage}
                alt="Uploaded"
                style={{ width: "100%" }}
              />
              {FilterResult ? (
                <h5 className="pt-2">{FilterResult}</h5>
              ) : (
                <h5 className="pt-2">Input image</h5>
              )}
            </div>
          )}
        </div>

        {gradCamImage1 && (
          <div className="col-2">
            <img src={gradCamImage1} alt="Grad-CAM" style={{ width: "100%" }} />
            <h5 className="pt-2">CNN Layer 1 Grad-CAM</h5>
          </div>
        )}

        {gradCamImage2 && (
          <div className="col-2">
            <img src={gradCamImage2} alt="Grad-CAM" style={{ width: "100%" }} />
            <h5 className="pt-2">CNN Layer 2 Grad-CAM</h5>
          </div>
        )}

        {gradCamImage3 && (
          <div className="col-2">
            <img src={gradCamImage3} alt="Grad-CAM" style={{ width: "100%" }} />
            <h5 className="pt-2">CNN Layer 3 Grad-CAM</h5>
          </div>
        )}

        {gradCamImage4 && (
          <div className="col-2">
            <img src={gradCamImage4} alt="Grad-CAM" style={{ width: "100%" }} />
            <h5 className="pt-2">CNN Layer 4 Grad-CAM</h5>
          </div>
        )}
      </div>
      {FilterResult && (
        <h5 className="mb-3">
          The proposed model classified the input image as {FilterResult}
        </h5>
      )}
      <input
        className="form-control btn btn-primary"
        style={{ fontSize: "1.2rem", width: "25%" }}
        type="file"
        onChange={handleFileChange}
      />
      <br></br>
      <button
        className="btn btn-primary mt-3"
        onClick={handleUpload}
        style={{ fontSize: "1.2rem", width: "25%" }}
        disabled={loading}
      >
        {loading ? "Generating Grad-CAM..." : "Upload and Generate Grad-CAM"}
      </button>
    </div>
  );
};

export default GradCamApp;
