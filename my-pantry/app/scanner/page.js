// app/scanner/page.js
"use client";

import React from 'react'; // Import React library
import BarcodeScanner from '@/app/components/BarcodeScanner';
import { Box } from '@mui/material';

const ScannerPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <BarcodeScanner />
    </Box>
  );
};

export default ScannerPage;
