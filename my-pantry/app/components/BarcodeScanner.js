import React, { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro'; // Ensure this component supports camera switching
import PropTypes from 'prop-types';

const CameraCapture = ({ onCapture }) => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true); // State to toggle camera

  const captureImage = async () => {
    if (cameraRef.current) {
      const imageSrc = await cameraRef.current.takePhoto();
      setCapturedImage(imageSrc);
      onCapture(imageSrc);
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(prevState => !prevState);
    if (cameraRef.current) {
      cameraRef.current.switchCamera(); // Check if the method exists for switching cameras
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '50vh', margin: 'auto' }}>
      <Camera
        ref={cameraRef}
        style={{ width: '100%', height: '100%' }}
        facingMode={isFrontCamera ? 'user' : 'environment'} // Make sure this prop is supported
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
          </div>
        )}
      </div>
    </div>
  );
};

CameraCapture.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

export default CameraCapture;
