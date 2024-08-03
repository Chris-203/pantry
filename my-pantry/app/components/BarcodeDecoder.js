// app/components/BarcodeDecoder.js
import { useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import PropTypes from 'prop-types';

const BarcodeDecoder = ({ imageSrc, onDecode }) => {
  useEffect(() => {
    const decodeBarcode = async () => {
      if (imageSrc) {
        const reader = new BrowserMultiFormatReader();
        const image = document.createElement('img');
        image.src = imageSrc;

        image.onload = async () => {
          try {
            const result = await reader.decodeFromImage(image);
            onDecode(result.text);
          } catch (error) {
            console.error('Error decoding barcode:', error);
          }
        };
      }
    };

    decodeBarcode();
  }, [imageSrc, onDecode]);

  return null;
};
BarcodeDecoder.propTypes = {
    imageSrc: PropTypes.string.isRequired,
    onDecode: PropTypes.func.isRequired
  };
  

export default BarcodeDecoder;
