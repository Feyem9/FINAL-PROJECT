import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";


export const HomeDetails = () => {
  return (
    <Box sx={{ flex: 1, textAlign: "left", px: { xs: 2, md: 6 }, py: { xs: 4, md: 10 } }}>
      {/* <Typography variant="h3" sx={{ fontWeight: "bold", color: "#43A047", mb: 2 }}>
        Welcome to Museschool!
      </Typography> */}
      <Typography variant="h5" sx={{ color: "#333", fontWeight: "medium", mb: 2 }}>
        Discover the World of Music 🎵
        Take your playing to the next level
        Interactive music lessons led by the world’s top professional musicians.
      </Typography>
      <Typography variant="body1" sx={{ color: "#555" }}>
        Learn from expert teachers and explore curated courses designed for all levels.
      </Typography>
      <Button
        component={NavLink}
        to="/courses"
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: "#FF9800",
          color: "white",
          fontSize: "1.2rem",
          fontWeight: "bold",
          px: 4,
          py: 1,
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          transition: "0.3s",
          "&:hover": { bgcolor: "#E65100" }
        }}
      >
        Start Learning 🚀
      </Button>
    </Box>
  );
};

