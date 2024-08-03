import React, { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';
// import PropTypes from 'prop-types';
import BarcodeDecoder from './BarcodeDecoder'; // Import the BarcodeDecoder component

const CameraCapture = () => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [decodedText, setDecodedText] = useState(null);
  const [productInfo, setProductInfo] = useState(null);

  const captureImage = async () => {
    if (cameraRef.current) {
      const imageSrc = await cameraRef.current.takePhoto();
      console.log('Captured Image Source:', imageSrc); // Log captured image source
      setCapturedImage(imageSrc);
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(prevState => !prevState);
  };

  const handleDecode = async (text) => {
    console.log('Decoded Text:', text); // Log decoded text
    setDecodedText(text);
    
    if (text) {
      // Fetch product information
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${text}.json`);
        const data = await response.json();
        if (data.product) {
          console.log('Product Data:', data.product); // Log product data
          setProductInfo(data.product);
        } else {
          console.error('Product not found');
          setProductInfo(null);
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        setProductInfo(null);
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '50vh', margin: 'auto' }}>
      <Camera
        ref={cameraRef}
        style={{ width: '100%', height: '100%' }}
        facingMode={isFrontCamera ? 'user' : 'environment'}
      />
      <div style={{ position: 'absolute', bottom: 0, width: '100%', padding: '10px', boxSizing: 'border-box' }}>
        <button onClick={captureImage}>Capture Image</button>
        <button onClick={toggleCamera} style={{ marginLeft: '10px' }}>
          Switch Camera
        </button>
        {capturedImage && (
          <div>
            <h3>Captured Image:</h3>
            <img src={capturedImage} alt="Captured" style={{ width: '100%', height: 'auto' }} />
            <BarcodeDecoder imageSrc={capturedImage} onDecode={handleDecode} />
          </div>
        )}
        {decodedText && <p>Decoded Text: {decodedText}</p>}
        {productInfo && (
          <div>
            <h3>Product Information:</h3>
            <p>Name: {productInfo.product_name || 'N/A'}</p>
            <p>Brand: {productInfo.brands || 'N/A'}</p>
            <p>Ingredients: {productInfo.ingredients_text || 'N/A'}</p>
            {/* Add more fields as needed */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
