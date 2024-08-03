// app/scanner/page.js
"use client";

import React from "react";
import BarcodeScanner from "@/app/components/BarcodeScanner";
import { Box } from "@mui/material";
import Footer from "../components/Footer";

const ScannerPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <BarcodeScanner />
      <Footer />
    </Box>
  );
};

export default ScannerPage;
