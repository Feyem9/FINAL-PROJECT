import React from "react";
import Box from "@mui/material/Box";

export const HomeContent = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        // p: { xs: 2, md: 2 },
        // height: "100vh", // plein écran vertical
      }}
      className="bg-gray-50"
    >
      <video
        src="/991400-hd_1920_1080_25fps.mp4"
        controls
        autoPlay
        loop
        muted
        className="w-full h-auto max-w-full md:max-w-5xl rounded-lg shadow-lg"
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
};
