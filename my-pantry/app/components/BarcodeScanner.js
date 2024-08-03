import React, { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';
// import PropTypes from 'prop-types';
import BarcodeDecoder from './BarcodeDecoder'; // Import the BarcodeDecoder component

const CameraCapture = () => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [decodedText, setDecodedText] = useState(null);

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

  const handleDecode = (text) => {
    console.log('Decoded Text:', text); // Log decoded text
    setDecodedText(text);
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
      </div>
    </div>
  );
};

export default CameraCapture;
