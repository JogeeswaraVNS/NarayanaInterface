import React, { useState } from 'react';
import axios from 'axios';

const GradCamApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradCamImages, setGradCamImages] = useState([]);
  const [originalImage, setOriginalImage] = useState(null);
  const [loading, setLoading] = useState(false);

  let api = 'https://dog-suitable-visually.ngrok-free.app';

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
      });

      const { original_image, gradcams } = response.data;

      setOriginalImage(original_image);
      setGradCamImages(gradcams.map((imgData, index) => URL.createObjectURL(new Blob([imgData]))));
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

      {originalImage && (
        <div>
          <h2>Original Uploaded Image:</h2>
          <img src={originalImage} alt="Original" style={{ width: '400px', height: '400px' }} />
        </div>
      )}

      {gradCamImages.length > 0 && (
        <div>
          <h2>Generated Grad-CAMs:</h2>
          {gradCamImages.map((imgSrc, index) => (
            <img key={index} src={imgSrc} alt={`Grad-CAM Layer ${index + 1}`} style={{ width: '400px', height: '400px', margin: '10px' }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GradCamApp;
