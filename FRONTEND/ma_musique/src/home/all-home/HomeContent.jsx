import React from "react";
import Box from '@mui/material/Box';

export const HomeContent = () => {
  return (
    <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", p: 2 }}>
      <video 
        src="/991400-hd_1920_1080_25fps.mp4" 
        controls 
        autoPlay 
        loop 
        muted 
        style={{ 
          width: "100%", 
          maxWidth: "1000px", 
          borderRadius: "10px", 
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)" 
        }} 
      />
    </Box>
  );
};
