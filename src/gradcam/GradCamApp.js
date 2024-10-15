import React, { useState } from 'react';
import axios from 'axios';

const GradCamApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradCamImage, setGradCamImage] = useState(null);
  const [loading, setLoading] = useState(false);

  let api='https://dog-suitable-visually.ngrok-free.app'

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(`${api}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "ngrok-skip-browser-warning": "true"
        },
        responseType: 'blob' // To handle the binary image data
      });

      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setGradCamImage(imageUrl); // Set the image to display

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
      <button className='btn btn-primary' onClick={handleUpload} disabled={loading}>
        {loading ? 'Generating Grad-CAM...' : 'Upload and Generate Grad-CAM'}
      </button>

      {gradCamImage && (
        <div >
          <h2>Generated Grad-CAM:</h2>
          <img src={gradCamImage} alt="Grad-CAM" style={{ width: '400px', height: '400px' }} />
        </div>
      )}
    </div>
  );
};

export default GradCamApp;