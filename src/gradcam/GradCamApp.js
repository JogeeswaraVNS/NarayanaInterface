import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradCamApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradCamImages, setGradCamImages] = useState([]);
  const [originalImage, setOriginalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  const api = 'https://dog-suitable-visually.ngrok-free.app'; // Remember to update this for production

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Validate file type
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
    } else {
      alert("Please select a valid image file.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image file first.");
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
          "ngrok-skip-browser-warning": "true",
        },
      });

      // Expecting original_image and gradcams to be Base64 encoded strings
      const { original_image, gradcams } = response.data;

      setOriginalImage(original_image);
      setGradCamImages(gradcams); // Ensure this is an array of Base64 strings

      // Reset file input
      setSelectedFile(null);
      document.getElementById("file-input").value = ""; // Reset the file input UI
    } catch (error) {
      console.error("Error uploading the file: ", error);
      setError("Failed to generate Grad-CAM. Please try again."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  // Clean up blob URLs to avoid memory leaks
  useEffect(() => {
    // Clean up function to revoke URLs
    return () => {
      gradCamImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [gradCamImages]);

  return (
    <div className="container">
      <h1>Grad-CAM Viewer</h1>

      {/* File input */}
      <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} />
      <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
        {loading ? 'Generating Grad-CAM...' : 'Upload and Generate Grad-CAM'}
      </button>

      {/* Error display */}
      {error && <p className="text-danger">{error}</p>}

      {/* Original uploaded image */}
      {originalImage && (
        <div>
          <h2>Original Uploaded Image:</h2>
          <img src={`data:image/png;base64,${originalImage}`} alt="Original" style={{ width: '400px', height: '400px' }} />
        </div>
      )}

      {/* Grad-CAM images */}
      {gradCamImages.length > 0 && (
        <div>
          <h2>Generated Grad-CAMs:</h2>
          {gradCamImages.map((imgSrc, index) => (
            <img key={index} src={`data:image/png;base64,${imgSrc}`} alt={`Grad-CAM Layer ${index + 1}`} style={{ width: '400px', height: '400px', margin: '10px' }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GradCamApp;
