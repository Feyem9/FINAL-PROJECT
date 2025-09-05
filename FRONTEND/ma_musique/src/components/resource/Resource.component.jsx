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
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material';
import axios from 'axios';
import { Navbar } from '../../home/Navbar';
import Footer from '../../home/Footer';

export const Resource = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'sheet_music',
    url: '',
    level: 'beginner',
    instrument: '',
    image: null,
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // const API_URL = import.meta.env.VITE_TESTING_BACKEND_URI;
  const databaseUri = import.meta.env.VITE_BACKEND_ONLINE_URI;


  // Fetch resources depuis backend
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/resources/all`);
        setResources(res.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des ressources:', err);
        setError('Impossible de charger les ressources. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
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
    setFormError('');
    setSubmitting(true);

    // Validation
    if (!form.title || !form.description || !form.url || !form.instrument) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('type', form.type);
    formData.append('url', form.url);
    formData.append('level', form.level);
    formData.append('instrument', form.instrument);

    if (form.image) {
      formData.append('image', form.image);
    }

    try {
      const res = await axios.post(`${API_URL}/resources/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = res.data;
      setResources([data, ...resources]);
      setForm({
        title: '',
        description: '',
        type: 'sheet_music',
        url: '',
        level: 'beginner',
        instrument: '',
        image: null,
      });
    } catch (err) {
      console.error('Erreur lors de la création de la ressource:', err);
      setFormError('Impossible de créer la ressource. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter and sort resources
  const filteredAndSortedResources = resources
    .filter(resource => {
      // Search filter
      if (searchTerm && !resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !resource.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !resource.instrument.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Type filter
      if (typeFilter && resource.type !== typeFilter) {
        return false;
      }

      // Level filter
      if (levelFilter && resource.level !== levelFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'instrument') {
        return a.instrument.localeCompare(b.instrument);
      }
      return 0;
    });

  return (
    <Box className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar />
      <Box className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <Typography variant="h4" className="text-3xl font-bold text-gray-800 mb-2">
              Ressources pédagogiques
            </Typography>
            <p className="text-gray-600">Accédez aux documents et supports d'apprentissage</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Ressources</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{resources.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Types de ressources</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {[...new Set(resources.map(r => r.type))].length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Instruments</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {[...new Set(resources.map(r => r.instrument))].length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Add Resource Form */}
        <Box className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <Typography variant="h6" className="text-xl font-bold text-gray-800 mb-6">
            Ajouter une nouvelle ressource
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate className="space-y-5">
            {formError && (
              <Alert severity="error" className="mb-4">
                {formError}
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <TextField
                  id="title"
                  label="Titre de la ressource"
                  name="title"
                  fullWidth
                  required
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="instrument" className="block text-sm font-medium text-gray-700 mb-2">
                  Instrument *
                </label>
                <TextField
                  id="instrument"
                  label="Instrument concerné"
                  name="instrument"
                  fullWidth
                  required
                  value={form.instrument}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <TextField
                id="description"
                label="Description de la ressource"
                name="description"
                fullWidth
                required
                multiline
                minRows={4}
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <TextField
                  id="url"
                  label="Lien vers la ressource"
                  name="url"
                  type="url"
                  fullWidth
                  required
                  value={form.url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <Button
                  variant="contained"
                  component="label"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  Télécharger une image
                  <input
                    type="file"
                    hidden
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <FormControl component="fieldset">
                  <Typography variant="subtitle1" className="text-sm font-medium text-gray-700 mb-2">
                    Type de ressource *
                  </Typography>
                  <RadioGroup
                    row
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  >
                    <FormControlLabel value="sheet_music" control={<Radio />} label="Partition" />
                    <FormControlLabel value="video" control={<Radio />} label="Vidéo" />
                    <FormControlLabel value="audio" control={<Radio />} label="Audio" />
                    <FormControlLabel value="article" control={<Radio />} label="Article" />
                  </RadioGroup>
                </FormControl>
              </div>

              <div>
                <FormControl fullWidth>
                  <InputLabel>Niveau</InputLabel>
                  <Select
                    name="level"
                    value={form.level}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <MenuItem value="beginner">Débutant</MenuItem>
                    <MenuItem value="intermediate">Intermédiaire</MenuItem>
                    <MenuItem value="advanced">Avancé</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center">
                    <CircularProgress size={20} className="mr-2 text-white" />
                    Publication...
                  </span>
                ) : (
                  'Publier la ressource'
                )}
              </Button>
            </div>
          </Box>
        </Box>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm mb-8 space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <TextField
              label="Rechercher des ressources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <FormControl className="w-full md:w-auto">
              <InputLabel>Type de ressource</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <MenuItem value="">Tous les types</MenuItem>
                <MenuItem value="sheet_music">Partition</MenuItem>
                <MenuItem value="video">Vidéo</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="article">Article</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="w-full md:w-auto">
              <InputLabel>Niveau</InputLabel>
              <Select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <MenuItem value="">Tous les niveaux</MenuItem>
                <MenuItem value="beginner">Débutant</MenuItem>
                <MenuItem value="intermediate">Intermédiaire</MenuItem>
                <MenuItem value="advanced">Avancé</MenuItem>
              </Select>
            </FormControl>

            <FormControl className="w-full md:w-auto">
              <InputLabel>Trier par</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <MenuItem value="newest">Plus récent</MenuItem>
                <MenuItem value="oldest">Plus ancien</MenuItem>
                <MenuItem value="title">Titre</MenuItem>
                <MenuItem value="instrument">Instrument</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {/* Resources Grid */}
        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <CircularProgress className="mb-4" />
              <Typography className="text-gray-600">Chargement des ressources...</Typography>
            </div>
          </div>
        ) : filteredAndSortedResources.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl shadow-sm">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <Typography variant="h6" className="text-xl font-bold text-gray-800 mb-2">Aucune ressource trouvée</Typography>
            <Typography className="text-gray-600">Il n'y a actuellement aucune ressource à afficher.</Typography>
          </div>
        ) : (
          <Grid container spacing={6}>
            {filteredAndSortedResources.map((resource) => (
              <Grid item xs={12} sm={6} md={4} key={resource._id}>
                <Card className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col">
                  {resource.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <CardMedia
                        component="img"
                        image={`${API_URL}/${resource.imageUrl}`}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <Typography variant="h6" className="font-bold text-gray-800 text-lg line-clamp-2">
                        {resource.title}
                      </Typography>
                      <Chip
                        label={resource.type === 'sheet_music' ? 'Partition' :
                          resource.type === 'video' ? 'Vidéo' :
                            resource.type === 'audio' ? 'Audio' : 'Article'}
                        size="small"
                        className={`${resource.type === 'sheet_music' ? 'bg-blue-100 text-blue-800' :
                            resource.type === 'video' ? 'bg-red-100 text-red-800' :
                              resource.type === 'audio' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                          }`}
                      />
                    </div>

                    <Typography variant="body2" color="text.secondary" className="text-gray-600 mb-3 line-clamp-3 flex-grow">
                      {resource.description}
                    </Typography>

                    <div className="flex items-center justify-between mb-3">
                      <Chip
                        label={resource.instrument}
                        size="small"
                        className="bg-indigo-100 text-indigo-800"
                      />
                      <Chip
                        label={resource.level === 'beginner' ? 'Débutant' :
                          resource.level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        size="small"
                        className={`${resource.level === 'beginner' ? 'bg-green-100 text-green-800' :
                            resource.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                          }`}
                      />
                    </div>

                    <div className="mt-auto">
                      <Button
                        variant="outlined"
                        size="small"
                        href={resource.url}
                        target="_blank"
                        className="w-full mb-2"
                      >
                        Accéder à la ressource
                      </Button>
                      <div className="text-xs text-gray-500">
                        Publié le {new Date(resource.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      <Footer />
    </Box>
  );
};
