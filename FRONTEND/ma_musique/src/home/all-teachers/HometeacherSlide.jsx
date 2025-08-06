import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/system";

const teachers = [
  { name: "Alice Dupont", instrument: "Piano", description: "Piano virtuoso with 20 years of experience.", image: "/prof-piano.jpg" },
  { name: "Jean Moulin", instrument: "Guitare", description: "Accomplished guitarist, specialized in jazz and rock.", image: "/prof-guitar.jpg" },
  { name: "Sophie Martin", instrument: "Violon", description: "Renowned violinist who has played with major orchestras.", image: "/prof-violon.jpg" },
  { name: "Lucas Moreau", instrument: "Flûte", description: "Talented flutist with a unique style.", image: "/prof-flute.jpg" },
  { name: "Emma Bernard", instrument: "Piano", description: "Passionate teacher and outstanding pedagogue.", image: "/prof2-piano.jpg" },
  { name: "Paul Lefevre", instrument: "Guitare", description: "Expert in fingerstyle and flamenco.", image: "/prof-guitar.jpg" },
  { name: "Marie Curie", instrument: "Violon", description: "Winner of numerous international competitions.", image: "/prof-violon.jpg" },
  { name: "Antoine Roux", instrument: "Flûte", description: "Soloist and passionate flute teacher.", image: "/prof-flute.jpg" },
  { name: "Isabelle Fontaine", instrument: "Piano", description: "Conservatory teacher with extensive experience.", image: "/prof-piano.jpg" },
  { name: "Thomas Girard", instrument: "Guitare", description: "Specialist in classical and acoustic guitars.", image: "/prof-guitar.jpg" }
];

const TeacherContainer = styled(Box)({
  display: "flex",
  overflowX: "auto",
  scrollSnapType: "x mandatory",
  WebkitOverflowScrolling: "touch",
  gap: "20px",
  paddingBottom: "20px",
  justifyContent: "center",
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE 10+
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

const Slide = styled(Box)(({ theme }) => ({
  flex: "0 0 auto",
  scrollSnapAlign: "center",
  position: "relative",
  borderRadius: "15px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  transition: "transform 0.4s ease, opacity 0.4s ease",
  cursor: "pointer",
  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",

  // Styles par défaut pour les images petites
  width: 180,
  height: 270,
  opacity: 0.6,
  transform: "scale(0.85)",

  // Responsive
  [theme.breakpoints.up("sm")]: {
    width: 220,
    height: 330,
  },
  [theme.breakpoints.up("md")]: {
    width: 260,
    height: 390,
  },
}));

const SlideActive = styled(Slide)({
  opacity: 1,
  transform: "scale(1.15)",
  boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
  zIndex: 10,
});

const TextOverlay = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  padding: "10px",
  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
  color: "#fff",
  borderBottomLeftRadius: "15px",
  borderBottomRightRadius: "15px",
});

const SlideTitle = styled(Typography)({
  fontSize: "1rem",
  fontWeight: "bold",
});
const SlideSubtitle = styled(Typography)({
  fontSize: "0.85rem",
  fontStyle: "italic",
  marginTop: "3px",
});
const SlideDescription = styled(Typography)({
  fontSize: "0.75rem",
  marginTop: "3px",
  lineHeight: 1.2,
});

const HomeTeacherSlide = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  // Auto slide toutes les 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % teachers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll pour centrer l'image active
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const activeSlide = container.children[activeIndex];
      if (activeSlide) {
        const containerRect = container.getBoundingClientRect();
        const slideRect = activeSlide.getBoundingClientRect();
        const scrollLeft = container.scrollLeft;
        const offset = slideRect.left - containerRect.left;
        // Scroll pour centrer le slide actif
        container.scrollTo({
          left: scrollLeft + offset - (containerRect.width / 2) + (slideRect.width / 2),
          behavior: "smooth"
        });
      }
    }
  }, [activeIndex]);

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 8 }, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4, fontWeight: "bold" }}>
        Our Teachers
      </Typography>

      <TeacherContainer ref={containerRef}>
        {teachers.map((teacher, index) => {
          const isActive = index === activeIndex;
          const SlideComp = isActive ? SlideActive : Slide;

          return (
            <SlideComp
              key={index}
              style={{ backgroundImage: `url(${teacher.image})` }}
              onMouseEnter={() => setActiveIndex(index)}
              onTouchStart={() => setActiveIndex(index)} // tactile aussi
              aria-label={`${teacher.name} - ${teacher.instrument}`}
              role="img"
            >
              <TextOverlay>
                <SlideTitle>{teacher.name}</SlideTitle>
                <SlideSubtitle>{teacher.instrument}</SlideSubtitle>
                <SlideDescription>{teacher.description}</SlideDescription>
              </TextOverlay>
            </SlideComp>
          );
        })}
      </TeacherContainer>
    </Box>
  );
};

export default HomeTeacherSlide;
