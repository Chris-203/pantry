// components/Footer.js
import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        // bgcolor: "background.paper",
        py: 2,
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2024 Christopher Cortazo
      </Typography>
    </Box>
  );
};

export default Footer;
