import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from "@mui/material/Button";

// Exemple de données d'annonces (avec image, lien et localisation)
const announcements = [
  { 
    id: 1, 
    title: "Concert de Piano", 
    type: "Événement", 
    description: "Venez assister à un concert de piano classique!", 
    date: "2025-02-20", 
    image: "/concert-piano.jpg",
    link: "https://example.com/concert-piano",
    location: "Salle de Concert, Paris"
  },
  { 
    id: 2, 
    title: "Cours de Guitare", 
    type: "Formation", 
    description: "Des cours de guitare pour débutants et confirmés.", 
    date: "2025-02-21", 
    image: "/cours-guitare.jpg", 
    link: "https://example.com/cours-guitare", 
    location: "École de Musique, Lyon" 
  },
  { 
    id: 3, 
    title: "Vente de Violon", 
    type: "Vente", 
    description: "Venez découvrir un violon de qualité à vendre.", 
    date: "2025-02-22", 
    image: "/vente-violon.jpg", 
    link: "https://example.com/vente-violon", 
    location: "Magasin de Musique, Marseille" 
  },
];

const HomeAnonce = () => {
  const [selectedType, setSelectedType] = useState("Tous");

  const filterAnnouncements = () => {
    if (selectedType === "Tous") return announcements;
    return announcements.filter((annonce) => annonce.type === selectedType);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" sx={{ textAlign: "center", marginBottom: 4 }}>
        Annonces
      </Typography>
      
      {/* Menu de filtre pour les types d'annonces */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <Button variant="contained" onClick={() => setSelectedType("Tous")} sx={{ margin: 1 }}>
          Tous
        </Button>
        <Button variant="contained" onClick={() => setSelectedType("Événement")} sx={{ margin: 1 }}>
          Événements
        </Button>
        <Button variant="contained" onClick={() => setSelectedType("Formation")} sx={{ margin: 1 }}>
          Formations
        </Button>
        <Button variant="contained" onClick={() => setSelectedType("Vente")} sx={{ margin: 1 }}>
          Ventes
        </Button>
      </Box>
      
      {/* Liste des annonces filtrées */}
      <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {filterAnnouncements().map((annonce) => (
          <Card key={annonce.id} sx={{ boxShadow: 3 }}>
            <CardMedia
              component="img"
              height="200"
              image={annonce.image}
              alt={annonce.title}
            />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>{annonce.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">{annonce.type}</Typography>
              <Typography variant="body2" sx={{ marginTop: 1 }}>{annonce.description}</Typography>
              <Typography variant="body2" sx={{ marginTop: 1, color: "textSecondary" }}>
                Date: {annonce.date}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: 1, color: "textSecondary" }}>
                Localisation: {annonce.location}
              </Typography>
              <Button
                variant="outlined"
                sx={{ marginTop: 2 }}
                href={annonce.link}
                target="_blank"
              >
                Plus d'infos
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default HomeAnonce;
