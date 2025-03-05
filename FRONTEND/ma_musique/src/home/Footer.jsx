import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer style={{ background: "linear-gradient(90deg, #43A047, #FF9800)", padding: "20px 0", marginTop: "20px" }}>
      <Container>
        <Grid container spacing={3} justifyContent="center">
          {/* Museschool Section */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" , color:"#fff"}}>Museschool</Typography>
            <Typography variant="body2">Learn music from the best instructors</Typography>
          </Grid>

          {/* Explore Section */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}  style={{color:"#fff"}}>Explore</Typography>
            <Typography variant="body2">Courses</Typography>
            <Typography variant="body2">Teachers</Typography>
            <Typography variant="body2">Pricing</Typography>
          </Grid>

          {/* Support Section */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}  style={{color:"#fff"}}>Support</Typography>
            <Typography variant="body2">FAQ</Typography>
            <Typography variant="body2">Contact Us</Typography>
          </Grid>

          {/* Follow Us Section */}
          <Grid item xs={12} sm={3}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}  style={{color:"#fff"}}>Follow Us</Typography>
            <Box sx={{ display: "flex", gap: "10px", marginTop: "5px" }}>
              <Facebook sx={{ cursor: "pointer", fontSize: "24px" }} />
              <Twitter sx={{ cursor: "pointer", fontSize: "24px" }} />
              <Instagram sx={{ cursor: "pointer", fontSize: "24px" }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
