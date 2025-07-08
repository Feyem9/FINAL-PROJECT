import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Grid, Chip, Box, TextField, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';

export const Tcourses = () => {

  const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;


  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    amount: '',
    level: '',
    media: 'video',
    category: '', // Ajout du champ catégorie
  });
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false); // Pour le modal

  const isFormValid = () =>
    newCourse.title &&
    newCourse.description &&
    newCourse.amount &&
    newCourse.level &&
    newCourse.media &&
    newCourse.category &&
    teacherId;

  // Récupère l'id du teacher depuis le localStorage
  const teacher = JSON.parse(localStorage.getItem('teacher') || '{}');
  const teacherId = teacher?._id || '';
  console.log('Teacher ID:', teacherId);
  

  useEffect(() => {
    if (teacherId) {
      axios.get(`${databaseUri}/course/teacher/${teacherId}`)
        .then(res => setCourses(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [teacherId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCreateCourse = async () => {
    const formData = new FormData();
    formData.append('title', newCourse.title);
    formData.append('description', newCourse.description);
    formData.append('amount', newCourse.amount);
    formData.append('level', newCourse.level);
    formData.append('media', newCourse.media);
    formData.append('category', newCourse.category); // Ajout dans le formData
    formData.append('teacher_id', teacherId);
    if (file) formData.append('file', file);

    try {
      const response = await axios.post(`${databaseUri}/course/create`, formData);
      setCourses((prev) => [...prev, response.data]);
      setNewCourse({
        title: '',
        description: '',
        amount: '',
        level: '',
        media: 'video',
        category: '', // reset
      });
      setFile(null);
      setOpen(false); // Ferme le modal après création
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`${databaseUri}/course/delete/${courseId}`);
      setCourses((prev) => prev.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const mediaColors = {
    video: '#e3f2fd',
    pdf: '#fce4ec',
    audio: '#e8f5e9',
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mes cours créés
      </Typography>

      {/* Bouton pour ouvrir le modal */}
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={() => setOpen(true)}>
        Nouveau cours
      </Button>

      {/* Modal de création de cours */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Créer un nouveau cours</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Titre" name="title" value={newCourse.title} onChange={handleInputChange} margin="normal" />
          <TextField fullWidth label="Description" name="description" value={newCourse.description} onChange={handleInputChange} margin="normal" multiline rows={3} />
          <TextField fullWidth label="Montant ($)" name="amount" type="number" value={newCourse.amount} onChange={handleInputChange} margin="normal" />
          {/* Sélection catégorie */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Catégorie</InputLabel>
            <Select name="category" value={newCourse.category} onChange={handleInputChange}>
              <MenuItem value="piano">Piano</MenuItem>
              <MenuItem value="flute">Flute</MenuItem>
              <MenuItem value="violon">Violon</MenuItem>
              <MenuItem value="baterie">Baterie</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Niveau</InputLabel>
            <Select name="level" value={newCourse.level} onChange={handleInputChange}>
              <MenuItem value="beginner">Débutant</MenuItem>
              <MenuItem value="intermediate">Intermédiaire</MenuItem>
              <MenuItem value="advanced">Avancé</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type de média</InputLabel>
            <Select name="media" value={newCourse.media} onChange={handleInputChange}>
              <MenuItem value="video">Vidéo</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="audio">Audio</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" component="label" fullWidth sx={{ my: 2 }}>
            Upload Media
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleCreateCourse} color="primary" variant="contained">
            Créer le cours
          </Button>
        </DialogActions>
      </Dialog>

      {/* Liste des cours */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <Typography>Chargement...</Typography>
        </Box>
      ) : courses.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Aucun cours créé pour le moment.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {courses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card sx={{ p: 2, boxShadow: 2, backgroundColor: mediaColors[course.media] || '#fff' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{course.description}</Typography>
                  <Chip label={course.category} color="default" size="small" sx={{ mt: 1, mr: 1 }} />
                  <Chip label={course.level} color="primary" size="small" sx={{ mt: 1, mr: 1 }} />
                  <Chip label={course.media} color="secondary" size="small" sx={{ mt: 1 }} />
                  {/* Affichage de la vidéo si fileUrl existe et media=video */}
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
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => handleDeleteCourse(course._id)}
                  disabled={!isFormValid()}
                >
                  Supprimer
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
