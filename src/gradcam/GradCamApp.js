import React, { useState } from 'react';
import axios from 'axios';

const GradCamApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradCamImages, setGradCamImages] = useState([]);
  const [originalImage, setOriginalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Error state

  const api = 'https://dog-suitable-visually.ngrok-free.app'; // Update this in production

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    setError(null); // Reset error before each request

    try {
      const response = await axios.post(`${api}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const { original_image, gradcams } = response.data;

      // For original image, assuming it's a file path, prepend the API url
      setOriginalImage(`${api}/${original_image}`);

      // For Grad-CAM images, they are base64 encoded
      setGradCamImages(gradcams.map((imgData) => `data:image/png;base64,${imgData}`));

      // Reset file input
      setSelectedFile(null);
      document.getElementById('file-input').value = ''; // Reset the file input UI
    } catch (error) {
      console.error('Error uploading the file: ', error);
      setError('Failed to generate Grad-CAM. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Grad-CAM Viewer</h1>

      {/* File input */}
      <input id="file-input" type="file" onChange={handleFileChange} />
      <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
        {loading ? 'Generating Grad-CAM...' : 'Upload and Generate Grad-CAM'}
      </button>

      {/* Error display */}
      {error && <p className="text-danger">{error}</p>}

      {/* Original uploaded image */}
      {originalImage && (
        <div>
          <h2>Original Uploaded Image:</h2>
          <img src={originalImage} alt="Original" style={{ width: '400px', height: '400px' }} />
        </div>
      )}

      {/* Grad-CAM images */}
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
