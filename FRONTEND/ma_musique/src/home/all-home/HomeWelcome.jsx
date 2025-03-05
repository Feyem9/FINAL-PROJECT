import React from "react";
import Box from '@mui/material/Box';
import { HomeDetails } from "./HomeDetails";
import { HomeContent } from "./HomeContent";

export const HomeWelcome = () => {
  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: { xs: "column", md: "row" }, // Responsive
      alignItems: "center", 
      justifyContent: "center",
      px: { xs: 2, md: 10 },
      overflow: "hidden",
      // background: "linear-gradient(120deg, #43A047, #FF9800)", // Dégradé fluide
      "::before, ::after": {
        content: '""',
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Empêche l'interaction
        zIndex: 0, // Derrière le contenu principal
      },
      "::before": {
        // backgroundImage: "url(/wave.svg)", // Forme ondulée en bas
        // backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        height: "150px",
        bottom: 0,
        opacity: 0.8,
      },
      "::after": {
        animation: "floatingNotes 10s infinite linear",
      },
      "@keyframes floatingNotes": {
        "0%": { transform: "translateY(100vh) scale(0.8)", opacity: 0 },
        "50%": { opacity: 1 },
        "100%": { transform: "translateY(-10vh) scale(1.2)", opacity: 0 },
      },      
    }}>
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: "0%",
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 20}px`,
              // color: "rgba(255, 255, 255, 0.6)",
              color:"linear-gradient(120deg, #43A047, #FF9800)",
              animation: "floatingNotes 10s infinite linear",
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            🎵
          </Box>
        ))}
      </Box>
      <HomeDetails />
      <HomeContent />
    </Box>
  );
};
