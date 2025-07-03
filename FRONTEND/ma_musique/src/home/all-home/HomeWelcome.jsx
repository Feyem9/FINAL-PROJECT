import React from "react";
import Box from "@mui/material/Box";
import { HomeDetails } from "./HomeDetails";
import { HomeContent } from "./HomeContent";

export const HomeWelcome = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" }, // Stack sur mobile
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 4, md: 10 },
        py: { xs: 8, md: 16 },
        position: "relative",
        overflow: "hidden",
        width: "100%",
        minHeight: "100vh",
        // background: "linear-gradient(135deg, #43A047 0%, #FF9800 100%)",
      }}
      className="relative"
    >
      {/* Éléments flottants 🎵 */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: "100%",
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 20}px`,
              color: "rgba(255, 255, 255, 0.3)",
              animation: `floatingNotes ${8 + Math.random() * 4}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            🎵
          </Box>
        ))}
      </Box>

      {/* Contenu principal */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <HomeDetails />
      </Box>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "800px",
          mb: { xs: 8, md: 0 },
        }}
      >
        <HomeContent />
      </Box>

      {/* Keyframes animés pour 🎵 */}
      <style>
        {`
          @keyframes floatingNotes {
            0% { transform: translateY(0) scale(0.8); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-120vh) scale(1.2); opacity: 0; }
          }
        `}
      </style>
    </Box>
  );
};
