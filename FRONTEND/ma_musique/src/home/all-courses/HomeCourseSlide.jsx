import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Grid  from "@mui/material/Grid";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules"; // Importer le module de navigation pour Swiper

// Données des cours
const courses = [
  {
    title: "Piano",
    description: "Learn to play the piano, one of the most versatile and beautiful instruments.",
    image: "/piano.jpg",
  },
  {
    title: "Guitar",
    description: "The guitar, a popular and accessible instrument, ideal for beginners and experienced musicians.",
    image: "/guitar.jpg",
  },
  {
    title: "Violon",
    description: "The violin, a classical musical instrument, perfect for those looking for a musical challenge.",
    image: "/violon.jpg",
  },
  {
    title: "Flute",
    description: "The flute, a light and soft instrument that will allow you to play captivating melodies.",
    image: "/flute.jpg",
  },
];

const HomeCourseSlide = () => {
    return (
      <Box sx={{ padding: 4 , gap:"10%" }}>
        <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 4 }}>
          Ours Course
        </Typography>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          navigation={false} // Activer la navigation
          autoplay={{ delay: 6000, disableOnInteraction: false }} // Activer l'autoplay avec une pause de 3 secondes
          modules={[Navigation, Autoplay]} // Activer les modules de navigation et d'autoplay
        >
          {courses.map((course, index) => (
            <SwiperSlide key={index}>
              <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{
                  padding: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 3,
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Image à gauche */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 2,
                      overflow: "hidden",
                      maxWidth: "100%", // Empêcher l'image d'être trop grande sur un écran large
                      maxHeight:"500px",
                      margin: "auto", // Centrer l'image si nécessaire
                      display:"flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Grid>
  
                {/* Texte explicatif à droite */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                    {course.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 2 }}>
                    {course.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    href={`/courses/${course.title.toLowerCase()}`}
                    sx={{
                      bgcolor: "#43A047",
                      '&:hover': { bgcolor: "#388E3C" },
                    }}
                  >
                    Commencer le Cours
                  </Button>
                </Grid>
              </Grid>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    );
  };
  
  export default HomeCourseSlide;
