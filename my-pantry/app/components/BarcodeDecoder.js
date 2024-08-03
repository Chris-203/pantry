import { useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import PropTypes from 'prop-types';

const BarcodeDecoder = ({ imageSrc, onDecode }) => {
  useEffect(() => {
    const decodeBarcode = async () => {
      if (imageSrc) {
        console.log('Decoding Image Source:', imageSrc); // Log image source being decoded
        const reader = new BrowserMultiFormatReader();
        const image = new Image();
        image.src = imageSrc;

        image.onload = async () => {
          try {
            console.log('Image loaded, starting decoding'); // Log when image is loaded
            const result = await reader.decodeFromImage(image);
            console.log('Decode Result:', result.text); // Log the result of decoding
            onDecode(result.text);
          } catch (error) {
            console.error('Error decoding barcode:', error);
            onDecode(null);
          }
        };

        image.onerror = () => {
          console.error('Error loading image for decoding');
          onDecode(null);
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
