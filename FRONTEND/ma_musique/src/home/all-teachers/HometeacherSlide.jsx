// import React , { useRef } from "react";
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import styled  from "@emotion/styled";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import { Autoplay } from "swiper/modules";

// // Données des enseignants
// const teachers = [
//   { name: "Alice Dupont", instrument: "Piano", description: "Virtuose du piano avec 20 ans d'expérience.", image: "/prof-piano.jpg" },
//   { name: "Jean Moulin", instrument: "Guitare", description: "Guitariste accompli, spécialisé en jazz et rock.", image: "/prof-guitar.jpg" },
//   { name: "Sophie Martin", instrument: "Violon", description: "Violoniste de renom ayant joué avec les plus grands orchestres.", image: "/prof-violon.jpg" },
//   { name: "Lucas Moreau", instrument: "Flûte", description: "Flûtiste talentueux avec un style unique.", image: "/prof-flute.jpg" },
//   { name: "Emma Bernard", instrument: "Piano", description: "Professeure passionnée et pédagogue hors pair.", image: "/prof2-piano.jpg" },
//   { name: "Paul Lefevre", instrument: "Guitare", description: "Expert en fingerstyle et flamenco.", image: "/prof-guitar.jpg" },
//   { name: "Marie Curie", instrument: "Violon", description: "Lauréate de nombreux concours internationaux.", image: "/prof-violon.jpg" },
//   { name: "Antoine Roux", instrument: "Flûte", description: "Soliste et professeur de flûte passionné.", image: "/prof-flute.jpg" },
//   { name: "Isabelle Fontaine", instrument: "Piano", description: "Professeure de conservatoire avec une grande expérience.", image: "/prof-piano.jpg" },
//   { name: "Thomas Girard", instrument: "Guitare", description: "Spécialiste des guitares classiques et acoustiques.", image: "/prof-guitar.jpg" }
// ];

// const TeacherContainer = styled(Box)({
//   display: "flex",
//   gap: "15px",
//   overflow: "hidden",
//   width: "100%",
//   padding: "20px",
//   cursor: "grab",
//   transition: "transform 0.3s ease-out",
// });

// const Slide = styled(Box)({
//   position: "relative",
//   flex: "0 0 250px",
//   height: "400px",
//   backgroundSize: "cover",
//   backgroundPosition: "center",
//   borderRadius: "15px",
//   transition: "transform 0.4s ease",
//   "&:hover": {
//     transform: "scale(1.1)",
//     zIndex: 2,
//   },
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     background: "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
//     // background: "linear-gradient(90deg, #43A047, #FF9800)",
//     borderRadius: "15px",
//   },
// });

// const SlideTitle = styled(Typography)({
//   position: "absolute",
//   bottom: "20px",
//   left: "20px",
//   color: "#fff",
//   fontSize: "20px",
//   fontWeight: "bold",
// });

// const InteractiveSlide = () => {
//   const sliderRef = useRef<HTMLDivElement | null>(null);

//   // Déplacement du slider au mouvement de la souris
//   const handleMouseMove = (e) => {
//     if (!sliderRef.current) return;
//     const { clientX } = e;
//     const { offsetWidth } = sliderRef.current;
//     const centerX = offsetWidth / 2;
//     const moveX = (clientX - centerX) * 0.05; // Ajuste la sensibilité
//     sliderRef.current.style.transform = `translateX(${moveX}px)`;
//   };
//   return (
//     <TeacherContainer ref={sliderRef} onMouseMove={handleMouseMove}>
//       {teachers.map((teacher, index) => (
//         <Slide key={index} style={{ backgroundImage: `url(${teacher.image})` }}>
//           <SlideTitle>{teacher.name}</SlideTitle>
//         </Slide>
//       ))}
//     </TeacherContainer>
//   );
// };

// const HomeTeacherSlide = () => {
//   const sliderRef = useRef<HTMLDivElement | null>(null); // Ajout de sliderRef

//   return (
//     <Box sx={{
//       overflow: "hidden",
//       padding: "20px",
//       // background: "linear-gradient(to right, #000428, #004e92)",
//       background: "linear-gradient(90deg,#43a048,#33ff00)"
//     }}
//     //  onMouseMove={handleMouseMove}
//      >
//       <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 4 , color: "black"}}>
//         Our Teachers
//       </Typography>
//       <Swiper
//         spaceBetween={0}
//         slidesPerView={3}
//         loop={true}
//         autoplay={{ delay: 3000, disableOnInteraction: false }}
//         modules={[Autoplay]}
//         breakpoints={{
//           320: { slidesPerView: 1 },
//           768: { slidesPerView: 2 },
//           1024: { slidesPerView: 3 }
//         }}
//       >
//         <TeacherContainer ref={sliderRef}>
//         {teachers.map((teacher, index) => (
//           // <SwiperSlide key={index}>
//             <Card  key={index} sx={{ maxWidth: 300, margin: "auto", borderRadius: 3, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
//               <CardMedia component="img" height="200" image={teacher.image} alt={teacher.name} />
//               <CardContent>
//                 <Typography variant="h6" sx={{ fontWeight: "bold" }}>{teacher.name}</Typography>
//                 <Typography variant="subtitle1" color="textSecondary">{teacher.instrument}</Typography>
//                 <Typography variant="body2" sx={{ marginTop: 1 }}>{teacher.description}</Typography>
//               </CardContent> 
//             </Card>
//           // </SwiperSlide>
//         ))}
//          </TeacherContainer>
//       </Swiper>
//     </Box>
//   );
// };

// export default HomeTeacherSlide;

// import React, { useState, useEffect, useRef } from "react";
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import styled from "@emotion/styled";

// // Données des enseignants
// const teachers = [
//   { name: "Alice Dupont", instrument: "Piano", description: "Virtuose du piano avec 20 ans d'expérience.", image: "/prof-piano.jpg" },
//   { name: "Jean Moulin", instrument: "Guitare", description: "Guitariste accompli, spécialisé en jazz et rock.", image: "/prof-guitar.jpg" },
//   { name: "Sophie Martin", instrument: "Violon", description: "Violoniste de renom ayant joué avec les plus grands orchestres.", image: "/prof-violon.jpg" },
//   { name: "Lucas Moreau", instrument: "Flûte", description: "Flûtiste talentueux avec un style unique.", image: "/prof-flute.jpg" },
//   { name: "Emma Bernard", instrument: "Piano", description: "Professeure passionnée et pédagogue hors pair.", image: "/prof2-piano.jpg" },
//   { name: "Paul Lefevre", instrument: "Guitare", description: "Expert en fingerstyle et flamenco.", image: "/prof-guitar.jpg" },
//   { name: "Marie Curie", instrument: "Violon", description: "Lauréate de nombreux concours internationaux.", image: "/prof-violon.jpg" },
//   { name: "Antoine Roux", instrument: "Flûte", description: "Soliste et professeur de flûte passionné.", image: "/prof-flute.jpg" },
//   { name: "Isabelle Fontaine", instrument: "Piano", description: "Professeure de conservatoire avec une grande expérience.", image: "/prof-piano.jpg" },
//   { name: "Thomas Girard", instrument: "Guitare", description: "Spécialiste des guitares classiques et acoustiques.", image: "/prof-guitar.jpg" }
// ];

// const TeacherContainer = styled(Box)({
//   display: "flex",
//   gap: "15px",
//   overflow: "hidden",
//   width: "100%",
//   padding: "20px",
//   cursor: "grab",
//   transition: "transform 0.3s ease-out",
// });

// const Slide = styled(Box)({
//   flex: "0 0 200px", // Réduit la taille par défaut
//   height: "350px",
//   backgroundSize: "cover",
//   backgroundPosition: "center",
//   borderRadius: "15px",
//   transition: "transform 0.4s ease",
//   opacity: 0.6,
//   "&:hover": {
//     transform: "scale(1.1)",
//     zIndex: 2,
//     opacity: 1,
//   },
//   "&.center": { // C'est la classe pour l'image du milieu
//     flex: "0 0 300px", // Augmente la taille de l'image du milieu
//     opacity: 1,
//     transition: "transform 0.4s ease, opacity 0.4s ease",
//   }
// });

// const SlideTitle = styled(Typography)({
//   position: "absolute",
//   bottom: "20px",
//   left: "20px",
//   color: "#fff",
//   fontSize: "20px",
//   fontWeight: "bold",
// });

// const HomeTeacherSlide = () => {
//   const [activeIndex, setActiveIndex] = useState(0); // Suivi de l'image du milieu
//   const sliderRef = useRef<HTMLDivElement | null>(null);

//   // Fonction pour déplacer les images après 5 secondes
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((prevIndex) => (prevIndex + 1) % teachers.length);
//     }, 5000); // Change toutes les 5 secondes

//     return () => clearInterval(interval); // Nettoyage de l'intervalle lors de la destruction du composant
//   }, []);

//   return (
//     <Box sx={{
//       overflow: "hidden",
//       padding: "20px",
//       background: "linear-gradient(90deg, #43a048, #33ff00)"
//     }}>
//       <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 4, color: "black" }}>
//         Our Teachers
//       </Typography>
//       <TeacherContainer ref={sliderRef}>
//         {teachers.map((teacher, index) => (
//           <Slide
//             key={index}
//             style={{ backgroundImage: `url(${teacher.image})` }}
//             className={index === activeIndex ? "center" : ""}
//           >
//             <SlideTitle>{teacher.name}</SlideTitle>
//           </Slide>
//         ))}
//       </TeacherContainer>
//     </Box>
//   );
// };

// export default HomeTeacherSlide;

import React, { useState, useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import styled from "@emotion/styled";

// Données des enseignants
const teachers = [
  { name: "Alice Dupont", instrument: "Piano", description: "Virtuose du piano avec 20 ans d'expérience.", image: "/prof-piano.jpg" },
  { name: "Jean Moulin", instrument: "Guitare", description: "Guitariste accompli, spécialisé en jazz et rock.", image: "/prof-guitar.jpg" },
  { name: "Sophie Martin", instrument: "Violon", description: "Violoniste de renom ayant joué avec les plus grands orchestres.", image: "/prof-violon.jpg" },
  { name: "Lucas Moreau", instrument: "Flûte", description: "Flûtiste talentueux avec un style unique.", image: "/prof-flute.jpg" },
  { name: "Emma Bernard", instrument: "Piano", description: "Professeure passionnée et pédagogue hors pair.", image: "/prof2-piano.jpg" },
  { name: "Paul Lefevre", instrument: "Guitare", description: "Expert en fingerstyle et flamenco.", image: "/prof-guitar.jpg" },
  { name: "Marie Curie", instrument: "Violon", description: "Lauréate de nombreux concours internationaux.", image: "/prof-violon.jpg" },
  { name: "Antoine Roux", instrument: "Flûte", description: "Soliste et professeur de flûte passionné.", image: "/prof-flute.jpg" },
  { name: "Isabelle Fontaine", instrument: "Piano", description: "Professeure de conservatoire avec une grande expérience.", image: "/prof-piano.jpg" },
  { name: "Thomas Girard", instrument: "Guitare", description: "Spécialiste des guitares classiques et acoustiques.", image: "/prof-guitar.jpg" }
];

const TeacherContainer = styled(Box)({
  display: "flex",
  gap: "15px",
  overflow: "hidden",
  width: "100%",
  padding: "20px",
  cursor: "grab",
  justifyContent: "center",
  transition: "transform 0.3s ease-out",
});

const Slide = styled(Box)({
  flex: "0 0 100px", // Réduit la taille par défaut
  height: "350px",
  // width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "15px",
  position: "relative",
  transition: "transform 0.4s ease , opacity 0.4s ease",
  opacity: 0.6,
  transformOrigin: "center", // Le zoom se fait à partir du centre de l'image

  "&:hover": {
    transform: "scale(1.1)",
    zIndex: 2,
    opacity: 1,
    borderRadius: "10px"
  },
  "&.center": { // C'est la classe pour l'image du milieu
    flex: "0 0 300px", // Augmente la taille de l'image du milieu
    opacity: 1,
    transition: "transform 0.4s ease, opacity 0.4s ease",
    transform: "scale(1.2)", // Zoom de l'image du milieu
    borderRadius: "10px"

  }
});

const TextOverlay = styled(Box)({
  position: "absolute",
  bottom: "0",
  left: "0",
  width: "100%",
  padding: "10px",
  background: "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
  color: "#fff",
  borderBottomLeftRadius: "15px",
  borderBottomRightRadius: "15px",
});

const SlideTitle = styled(Typography)({
  fontSize: "18px",
  fontWeight: "bold",
});

const SlideSubtitle = styled(Typography)({
  fontSize: "14px",
  fontStyle: "italic",
  marginTop: "5px",
});

const SlideDescription = styled(Typography)({
  fontSize: "12px",
  marginTop: "5px",
});

const HomeTeacherSlide = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Suivi de l'image du milieu
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Fonction pour déplacer les images après 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % teachers.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lors de la destruction du composant
  }, []);

  return (
    <Box sx={{
      overflow: "hidden",
      padding: "20px",
      background: "linear-gradient(90deg, #43a048, #33ff00)"
    }}>
      <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 4, color: "black" }}>
        Our Teachers
      </Typography>
      <TeacherContainer ref={sliderRef} sx={{borderRadius: "10px"}}>
        {teachers.map((teacher, index) => (
          <Slide
            // sx={{ flex: index === activeIndex ? "0 0 300px" : "0 0 200px", width: "100%" }}
            key={index}
            style={{ backgroundImage: `url(${teacher.image})` }}
            className={index === activeIndex ? "center" : ""}
          >
            <TextOverlay>
              <SlideTitle>{teacher.name}</SlideTitle>
              <SlideSubtitle> Instrument : {teacher.instrument}</SlideSubtitle>
              <SlideDescription>{teacher.description}</SlideDescription>
            </TextOverlay>
          </Slide>
        ))}
      </TeacherContainer>
    </Box>
  );
};

export default HomeTeacherSlide;
