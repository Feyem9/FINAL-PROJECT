import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import axios from 'axios';

export const Resource = () => {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    image: '',
    tags: '',
    categories: '',
  });

    const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;


  // Fetch resources depuis backend
  useEffect(() => {
    axios.get('/API_URL/resources/all')
      .then((res) => setResources(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    try {
      const res = await axios.post('/API_URL/resources/create', {
        body: formData,
      });

      const data = await res.json();
      setResources([data, ...resources]);
      setForm({
        title: '',
        content: '',
        image: '',
        tags: '',
        categories: '',
      });
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Ressources pédagogiques
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mb: 4 }}>
        <TextField
          label="Titre"
          name="title"
          fullWidth
          required
          value={form.title}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Contenu"
          name="content"
          fullWidth
          required
          multiline
          minRows={4}
          value={form.content}
          onChange={handleChange}
          margin="normal"
        />
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          Télécharger une image
          <input
            type="file"
            hidden
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </Button>
        <TextField
          label="Tags (virgule séparée)"
          name="tags"
          fullWidth
          value={form.tags}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          label="Catégories (virgule séparée)"
          name="categories"
          fullWidth
          value={form.categories}
          onChange={handleChange}
          margin="normal"
        />
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
          Publier la ressource
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} sm={6} md={4} key={resource._id}>
            <Card>
              {resource.imageUrl && (
                <CardMedia
                  component="img"
                  height="160"
                  image={resource.imageUrl}
                  alt={resource.title}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {resource.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {resource.content}
                </Typography>
                <Box mt={1}>
                  {(resource.tags || '').split(',').map((tag, idx) => (
                    <Chip key={idx} label={tag.trim()} size="small" sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
                <Box mt={1}>
                  {(resource.categories || '').split(',').map((cat, idx) => (
                    <Chip
                      key={idx}
                      label={cat.trim()}
                      color="secondary"
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
