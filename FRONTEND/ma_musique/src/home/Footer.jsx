import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer style={{
      background: "linear-gradient(90deg, #43A047, #FF9800)",
      padding: "40px 0 20px 0",
      marginTop: "40px",
      borderTopLeftRadius: "30px",
      borderTopRightRadius: "30px",
      boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.1)"
    }}>
      <Container>
        <Grid container spacing={4} justifyContent="center">
          {/* Museschool Section */}
          <Grid item xs={12} sm={3}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                mb: 2,
                fontFamily: "'Brush Script MT', cursive",
                fontSize: "2rem"
              }}
            >
              Museschool
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 2 }}>
              Learn music from the best instructors
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.8rem" }}>
              © {new Date().getFullYear()} Museschool. All rights reserved.
            </Typography>
          </Grid>

          {/* Explore Section */}
          <Grid item xs={12} sm={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                mb: 2,
                borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
                pb: 1,
                display: "inline-block"
              }}
            >
              Explore
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 1 }}>Courses</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 1 }}>Teachers</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 1 }}>Pricing</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 1 }}>Blog</Typography>
          </Grid>

          {/* Support Section */}
          <Grid item xs={12} sm={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                mb: 2,
                borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
                pb: 1,
                display: "inline-block"
              }}
            >
              Support
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 1 }}>FAQ</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 1 }}>Contact Us</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 1 }}>Privacy Policy</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 1 }}>Terms of Service</Typography>
          </Grid>

          {/* Follow Us Section */}
          <Grid item xs={12} sm={3}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                mb: 2,
                borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
                pb: 1,
                display: "inline-block"
              }}
            >
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: "15px", marginTop: "5px" }}>
              <Facebook
                sx={{
                  cursor: "pointer",
                  fontSize: "28px",
                  color: "rgba(255, 255, 255, 0.9)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#fff",
                    transform: "scale(1.1)"
                  }
                }}
              />
              <Twitter
                sx={{
                  cursor: "pointer",
                  fontSize: "28px",
                  color: "rgba(255, 255, 255, 0.9)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#fff",
                    transform: "scale(1.1)"
                  }
                }}
              />
              <Instagram
                sx={{
                  cursor: "pointer",
                  fontSize: "28px",
                  color: "rgba(255, 255, 255, 0.9)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#fff",
                    transform: "scale(1.1)"
                  }
                }}
              />
              <Box
                sx={{
                  cursor: "pointer",
                  fontSize: "28px",
                  color: "rgba(255, 255, 255, 0.9)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#fff",
                    transform: "scale(1.1)"
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.85H7.9V12.06H10.44V9.94C10.44 7.44 11.94 6.04 14.22 6.04C15.31 6.04 16.45 6.24 16.45 6.24V8.7H15.19C13.95 8.7 13.56 9.47 13.56 10.21V12.06H16.34L15.89 14.85H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                </svg>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
