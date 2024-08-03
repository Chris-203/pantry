import { useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import PropTypes from 'prop-types';

const BarcodeDecoder = ({ imageSrc, onDecode }) => {
  useEffect(() => {
    const decodeBarcode = async () => {
      if (imageSrc) {
        const reader = new BrowserMultiFormatReader();
        const image = new Image(); // Create an image element
        image.src = imageSrc;

        // Ensure the image is loaded before decoding
        image.onload = async () => {
          try {
            const result = await reader.decodeFromImage(image);
            onDecode(result.text);
          } catch (error) {
            console.error('Error decoding barcode:', error);
            onDecode(null); // Notify that decoding failed
          }
        };

        image.onerror = () => {
          console.error('Error loading image for decoding');
          onDecode(null); // Notify that decoding failed
        };
      }
    };

    decodeBarcode();
  }, [imageSrc, onDecode]);

  return null;
};

BarcodeDecoder.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  onDecode: PropTypes.func.isRequired,
};

export default BarcodeDecoder;
