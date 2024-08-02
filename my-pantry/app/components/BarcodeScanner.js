// app/components/BarcodeScanner.js
"use client";

import React, { useCallback, useRef } from 'react';
import {Camera} from 'react-camera-pro';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button } from '@mui/material';
import Quagga from 'quagga';

const BarcodeScanner = () => {
  const router = useRouter();
  const cameraRef = useRef(null);

  const handleTakePhoto = useCallback(() => {
    const photo = cameraRef.current.takePhoto();
    extractBarcodeFromPhoto(photo, (barcode) => {
      if (barcode) {
        router.push(`/barcode/${barcode}`);
      } else {
        alert("No barcode detected. Please try again.");
      }
    });
  }, [router]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Scan a Barcode
      </Typography>
      <Camera ref={cameraRef} facingMode="environment" />
      <Button variant="contained" color="primary" onClick={handleTakePhoto} sx={{ mt: 2 }}>
        Scan Barcode
      </Button>
    </Box>
  );
};

const extractBarcodeFromPhoto = (photo, callback) => {
  Quagga.decodeSingle(
    {
      src: photo,
      numOfWorkers: 0,
      inputStream: {
        size: 800, // adjust the size as needed
      },
      decoder: {
        readers: ["code_128_reader", "ean_reader", "ean_8_reader"],
      },
    },
    (result) => {
      if (result && result.codeResult) {
        callback(result.codeResult.code);
      } else {
        callback(null);
      }
    }
  );
};

export default BarcodeScanner;
