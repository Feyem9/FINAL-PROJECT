import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Chip, CircularProgress, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

export const Scourse = () => {

      const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupère la catégorie d'inscription de l'étudiant depuis le profil ou le localStorage
  const student = JSON.parse(localStorage.getItem('student') || '{}');
  const studentCategory = student?.category || 'all'; // Assure-toi que la catégorie est bien stockée dans le profil étudiant
  const [selectedCategory, setSelectedCategory] = useState(studentCategory);

  useEffect(() => {
    axios.get(`${databaseUri}/course/all`)
      .then(res => setCourses(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const mediaColors = {
    video: '#e3f2fd',
    pdf: '#fce4ec',
    audio: '#e8f5e9',
  };

  // Filtrer les cours par la catégorie d'inscription de l'étudiant
  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(course => course.category === selectedCategory);

  // Grouper les cours filtrés par niveau
  const coursesByLevel = filteredCourses.reduce((acc, course) => {
    acc[course.level] = acc[course.level] || [];
    acc[course.level].push(course);
    return acc;
  }, {});

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mes cours par niveau
      </Typography>

      {/* Sélecteur de catégorie (désactivé si l'étudiant est inscrit à une seule catégorie) */}
      <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={selectedCategory}
          label="Catégorie"
          onChange={e => setSelectedCategory(e.target.value)}
          disabled={studentCategory !== 'all'}
        >
          <MenuItem value="all">Toutes les catégories</MenuItem>
          <MenuItem value="piano">Piano</MenuItem>
          <MenuItem value="flute">Flute</MenuItem>
          <MenuItem value="violon">Violon</MenuItem>
          <MenuItem value="baterie">Baterie</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : filteredCourses.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Aucun cours disponible pour la catégorie sélectionnée.
        </Typography>
      ) : (
        Object.keys(coursesByLevel).map(level => (
          <div key={level} style={{ marginBottom: 32 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Typography>
            <Grid container spacing={3}>
              {coursesByLevel[level].map(course => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card sx={{ p: 2, boxShadow: 2, backgroundColor: mediaColors[course.media] || '#fff' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold">{course.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{course.description}</Typography>
                      <Chip label={course.level} color="primary" size="small" sx={{ mt: 1, mr: 1 }} />
                      <Chip label={course.media} color="secondary" size="small" sx={{ mt: 1 }} />
                      <Chip label={course.category} color="default" size="small" sx={{ mt: 1, ml: 1 }} />
                      {/* Affichage de la vidéo si le cours est de type vidéo */}
                      {course.fileUrl && course.media === "video" && (
                        <video controls width="100%" style={{ marginTop: 8 }}>
                          <source src={`${databaseUri}${course.fileUrl}`} type="video/mp4" />
                          Votre navigateur ne supporte pas la lecture vidéo.
                        </video>
                      )}
                      {/* Affichage du PDF si media=pdf */}
                      {course.fileUrl && course.media === "pdf" && (
                        <a
                          href={`${databaseUri}${course.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "block", marginTop: 8 }}
                        >
                          Voir le PDF
                        </a>
                      )}
                      {/* Affichage de l'audio si media=audio */}
                      {course.fileUrl && course.media === "audio" && (
                        <audio controls style={{ marginTop: 8, width: "100%" }}>
                          <source src={`${databaseUri}${course.fileUrl}`} type="audio/mpeg" />
                          Votre navigateur ne supporte pas la lecture audio.
                        </audio>
                      )}
                    </CardContent>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      disabled
                    >
                      Lire
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        ))
      )}
    </div>
  );
};
