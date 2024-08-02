// app/barcode/[barcode]/page.js
"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const BarcodeInfoPage = ({ params }) => {
  const { barcode } = params;
  const [barcodeInfo, setBarcodeInfo] = useState(null);

  useEffect(() => {
    // Fetch barcode info from your database or API
    const fetchBarcodeInfo = async () => {
      // Replace this with your actual data fetching logic
      const info = await fetchBarcodeData(barcode);
      setBarcodeInfo(info);
    };

    fetchBarcodeInfo();
  }, [barcode]);

  const fetchBarcodeData = async (barcode) => {
    // Mock data fetching function
    return {
      name: "Sample Product",
      description: "This is a sample product description.",
      barcode: barcode,
    };
  };

  return (
    <Box sx={{ p: 3 }}>
      {barcodeInfo ? (
        <>
          <Typography variant="h5">Product Name: {barcodeInfo.name}</Typography>
          <Typography>Description: {barcodeInfo.description}</Typography>
          <Typography>Barcode: {barcodeInfo.barcode}</Typography>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
};

BarcodeInfoPage.propTypes = {
  params: PropTypes.shape({
    barcode: PropTypes.string.isRequired,
  }).isRequired,
};

export default BarcodeInfoPage;
