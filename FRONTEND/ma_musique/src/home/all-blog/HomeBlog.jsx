import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

const blogPosts = [
  {
    title: "The Healing Power of Music",
    date: "February 2025",
    image: "/blog1H.jpeg",
    shortContent: "Apprendre un instrument demande de la patience et de la discipline...",
    fullContent:
      "Beaucoup de personnes rêvent de jouer d’un instrument, mais abandonnent par manque de motivation ou de méthode. La clé est de pratiquer régulièrement, même quelques minutes par jour. Utiliser des applications d’apprentissage, suivre des cours en ligne et jouer avec d'autres musiciens peut accélérer votre progression. La passion et la persévérance sont les moteurs de l'apprentissage musical !",
  },
  {
    title: "Mastering the Piano: Tips for Beginners",
    date: "January 2025",
    image: "/blog2B.jpeg",
    shortContent: "La musique influence nos émotions et notre bien-être...",
    fullContent:
      "La musique est un langage universel qui traverse les cultures et les générations. Elle nous accompagne dans les moments heureux comme dans les périodes difficiles. De nombreuses études montrent que la musique peut réduire le stress, améliorer la concentration et même renforcer la mémoire. Que vous soyez musicien ou simple amateur, la musique joue un rôle essentiel dans notre quotidien.",
  },
  {
    title: "The Evolution of Jazz Music",
    date: "December 2024",
    image: "/blog3E.jpeg",
    shortContent: "From its roots in New Orleans to modern fusion styles...",
    fullContent:
      "From its roots in New Orleans to modern fusion styles, jazz has evolved significantly. Explore the history and key figures who shaped this genre. De nombreuses études montrent que la musique peut réduire le stress, améliorer la concentration et même renforcer la mémoire. Que vous soyez musicien ou simple amateur, la musique joue un rôle essentiel dans notre quotidien.",
  },
];

const HomeBlog = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ py: 6, px: { xs: 2, md: 8 }, backgroundColor: "#f5f5f5" }}>
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          mb: 5,
          fontWeight: "bold",
          color: "#43A047",
          textTransform: "uppercase",
          letterSpacing: 2,
        }}
      >
        Museschool Blog
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 4,
        }}
      >
        {blogPosts.map((post, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: 3,
              boxShadow: 4,
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-10px)",
                boxShadow: 6,
              },
              maxHeight: "600px",
            }}
          >
            <CardMedia
              component="img"
              height="220" // même hauteur pour toutes les images
              image={post.image}
              alt={post.title}
              sx={{ objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {post.title}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                {post.date}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  flexGrow: 1,
                  transition: "max-height 0.5s ease",
                  overflow: "hidden",
                  whiteSpace: expandedIndex === index ? "normal" : "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {expandedIndex === index ? post.fullContent : post.shortContent}
              </Typography>

              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{
                  mt: 3,
                  alignSelf: "flex-start",
                  textTransform: "none",
                  fontWeight: "bold",
                  bgcolor: "#43A047",
                  "&:hover": { bgcolor: "#388E3C" },
                }}
                onClick={() => toggleReadMore(index)}
              >
                {expandedIndex === index ? "Read Less" : "Read More"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default HomeBlog;
