// app/components/CameraCapture.js
import React, { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';
import PropTypes from 'prop-types';

const CameraCapture = ({ onCapture }) => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const captureImage = async () => {
    if (cameraRef.current) {
      const imageSrc = await cameraRef.current.takePhoto();
      setCapturedImage(imageSrc);
      onCapture(imageSrc);
    }
  };

  return (
    <div>
      <Camera ref={cameraRef} />
      <button onClick={captureImage}>Capture Image</button>
      {capturedImage && <img src={capturedImage} alt="Captured" />}
    </div>
  );
};
CameraCapture.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

export default CameraCapture;
