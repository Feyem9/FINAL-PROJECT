import React, { useState, useEffect } from "react";
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
    fullContent: "From its roots in New Orleans to modern fusion styles, jazz has evolved significantly. Explore the history and key figures who shaped this genre. De nombreuses études montrent que la musique peut réduire le stress, améliorer la concentration et même renforcer la mémoire. Que vous soyez musicien ou simple amateur, la musique joue un rôle essentiel dans notre quotidien."
  }
];

const HomeBlog = () => {
    const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleReadMore = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  return (
    <Box sx={{ padding: "40px", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h3" sx={{ textAlign: "center", marginBottom: "20px", fontWeight: "bold", color: "#43A047" }}>
        Museschool Blog
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {blogPosts.map((post, index) => (
          <Card key={index} sx={{ borderRadius: "10px", boxShadow: 3 }}>
            <CardMedia component="img" height="200" image={post.image} alt={post.title} />
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{post.title}</Typography>
              <Typography variant="subtitle2" color="textSecondary">{post.date}</Typography>
              <Typography variant="body2" sx={{ marginTop: "10px" }}>{expandedIndex === index ? post.fullContent : post.shortContent}</Typography>
              <Button
              sx={{ marginTop: 2 }}
              variant="contained"
              color="primary"
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
