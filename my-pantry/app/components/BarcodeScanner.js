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
    // Assuming the Camera component has a method to switch cameras
    if (cameraRef.current) {
      cameraRef.current.setCameraPosition(isFrontCamera ? 'back' : 'front');
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 'auto' }}>
      <Camera
        ref={cameraRef}
        style={{ width: '100%', height: 'auto', position: 'absolute', top: 0, left: 0 }}
        facingMode={isFrontCamera ? 'user' : 'environment'}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <button onClick={captureImage}>Capture Image</button>
        <button onClick={toggleCamera} style={{ marginLeft: '10px' }}>
          Switch Camera
        </button>
        {capturedImage && <img src={capturedImage} alt="Captured" style={{ marginTop: '10px', maxWidth: '100%' }} />}
      </div>
    </div>
  );
};

CameraCapture.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

export default CameraCapture;
