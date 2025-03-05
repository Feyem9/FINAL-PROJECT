import React, { useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

const plans = [
  {
    title: "Basique",
    price: "  0€ ,  Gratuit",
    features: ["Accès à quelques cours", "Support communautaire", "Accès limité aux ressources"],
  },
  {
    title: "Standard",
    price: "$19.99/mois",
    features: ["Accès à tous les cours", "Support par email", "Téléchargement des partitions" ,  "Cours illimités"],
  },
  {
    title: "Premium",
    price: "$49.99/mois",
    features: ["Cours en direct avec professeurs", "Support prioritaire", "Accès exclusif aux masterclasses" , "Accès aux événements exclusifs"],
  },
];

const HomePricing = () => {

    const [email, setEmail] = useState("");

    const handleSubscribe = () => {
      alert(`Merci pour votre inscription: ${email}`);
      setEmail("");
    };
  return (
    <Box sx={{ textAlign: "center", py: 6, background: "#f4f4f4" }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3 , color:"#43A047"}}>
        Nos Offres
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#43A047" }}>
                  {plan.title}
                </Typography>
                <Typography variant="h6" sx={{ my: 2 }}>
                  {plan.price}
                </Typography>
                <ul style={{ textAlign: "left", paddingLeft: 20 }}>
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <Typography variant="body2">{feature}</Typography>
                    </li>
                  ))}
                </ul>
                <Button variant="contained"  sx={{ mt: 2 , background:"#E65100" , fontWeight:"bolder" }}>
                  Choisir
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div style={{ marginTop: "40px" }}>
        <Typography variant="h5" gutterBottom>Inscrivez-vous à notre newsletter</Typography>
        <TextField 
          label="Votre email" 
          variant="outlined" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={{ marginRight: "10px" }}
        />
        <Button variant="contained" onClick={handleSubscribe} sx={{background:"#E65100" , fontWeight:"bolder"}}>S'abonner</Button>
      </div>

    </Box>
  );
};

export default HomePricing;
