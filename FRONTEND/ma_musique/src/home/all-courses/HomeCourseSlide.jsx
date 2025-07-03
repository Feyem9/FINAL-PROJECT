import React from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Navigation, Autoplay } from "swiper/modules";

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
    <Box sx={{ px: { xs: 2, md: 10 }, py: { xs: 4, md: 8 } }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          mb: { xs: 4, md: 6 },
          fontSize: { xs: "1.8rem", md: "2.5rem" },
          fontWeight: "bold",
        }}
      >
        Our Courses
      </Typography>

      <Swiper
        spaceBetween={30}
        slidesPerView={1}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        modules={[Navigation, Autoplay]}
      >
        {courses.map((course, index) => (
          <SwiperSlide key={index}>
            <Grid
              container
              spacing={4}
              alignItems="center"
              sx={{
                p: { xs: 2, md: 4 },
                bgcolor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 3,
                boxShadow: 3,
                flexDirection: { xs: "column", md: "row" },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {/* Image */}
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    overflow: "hidden",
                    maxHeight: { xs: 250, md: 500 },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Grid>

              {/* Texte */}
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                  }}
                >
                  {course.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 3, fontSize: { xs: "0.9rem", md: "1rem" } }}
                >
                  {course.description}
                </Typography>
                <Button
                  variant="contained"
                  href={`/courses/${course.title.toLowerCase()}`}
                  sx={{
                    bgcolor: "#43A047",
                    '&:hover': { bgcolor: "#388E3C" },
                    px: 3,
                    py: 1.5,
                    fontSize: { xs: "0.8rem", md: "1rem" },
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
