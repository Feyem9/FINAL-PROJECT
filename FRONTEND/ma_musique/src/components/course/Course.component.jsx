import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from "@mui/material/Container"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Grid from "@mui/material/Grid"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"

const useCourses = () => {

    // const databaseUri = process.env.REACT_APP_BACKEND_ONLINE_URI;
        const databaseUri = import.meta.env.VITE_TESTING_BACKEND_URI;


  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${databaseUri}/course/all`);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return { courses, setCourses, loading, setLoading };
};

const useNewCourse = () => {
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    amount: '',
    level: '',
    media: 'video',
    category: '',
  });
  const [file, setFile] = useState(null);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return { newCourse, setNewCourse, file, setFile, handleInputChange, handleFileChange };
};

export default function Course() {
  const { courses, setCourses, loading, setLoading } = useCourses();
  const { newCourse, setNewCourse, file, setFile, handleInputChange, handleFileChange } = useNewCourse();
  const [open, setOpen] = useState(false);

  // Récupère l'id du teacher depuis le localStorage (à adapter selon ton auth)
  const teacherData = JSON.parse(localStorage.getItem('teacher') || '{}');
  const teacherId = teacherData?._id || '';

  const handleCreateCourse = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', newCourse.title);
    formData.append('description', newCourse.description);
    formData.append('amount', newCourse.amount);
    formData.append('level', newCourse.level);
    formData.append('media', newCourse.media);
    formData.append('category', newCourse.category);
    formData.append('teacher_id', teacherId);
    if (file) formData.append('file', file);
    console.log('file', file);
    console.log('formdata',formData);
    

    try {
      const response = await axios.post(`${databaseUri}/course/create`, formData);
      setCourses((prev) => [...prev, response.data]);
      setNewCourse({
        title: '',
        description: '',
        amount: '',
        level: '',
        media: 'video',
        category: '',
      });
      setFile(null);
      setOpen(false); // Ferme le modal après création
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
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

  // Couleurs selon le type de média
  const mediaColors = {
    video: '#e3f2fd',
    pdf: '#fce4ec',
    audio: '#e8f5e9',
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Course Management
      </Typography>

      {/* Bouton pour ouvrir le modal */}
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={() => setOpen(true)}>
        Nouveau cours
      </Button>

      {/* Modal de création de cours */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Course Title"
            name="title"
            variant="outlined"
            margin="normal"
            value={newCourse.title}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Course Description"
            name="description"
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
            value={newCourse.description}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            label="Course Amount ($)"
            name="amount"
            type="number"
            variant="outlined"
            margin="normal"
            value={newCourse.amount}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select name="category" value={newCourse.category} onChange={handleInputChange}>
              <MenuItem value="piano">Piano</MenuItem>
              <MenuItem value="flute">Flute</MenuItem>
              <MenuItem value="violon">Violon</MenuItem>
              <MenuItem value="baterie">Baterie</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Level</InputLabel>
            <Select name="level" value={newCourse.level} onChange={handleInputChange}>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Media Type</InputLabel>
            <Select name="media" value={newCourse.media} onChange={handleInputChange}>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="audio">Audio</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" component="label" fullWidth sx={{ my: 2 }}>
            Upload Media
            <input type="file" name='file' hidden onChange={handleFileChange} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleCreateCourse} color="primary" variant="contained" disabled={loading}>
            {loading ? "Creating Course..." : "Create Course"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Liste des cours */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        All Courses
      </Typography>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card sx={{ p: 2, boxShadow: 2, backgroundColor: mediaColors[course.media] || '#fff' }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                {/* Affichage de la vidéo si fileUrl existe */}
                {course.fileUrl && course.media === "video" && (
                  <video controls width="100%" style={{ marginTop: 8 }}>
                    <source src={`http://localhost:3000${course.fileUrl}`} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                )}
                {/* Affichage du PDF si media=pdf */}
                {course.fileUrl && course.media === "pdf" && (
                  <a
                    href={`http://localhost:3000${course.fileUrl}`}
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
                    <source src={`http://localhost:3000${course.fileUrl}`} type="audio/mpeg" />
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                )}
                <Typography variant="subtitle1" mt={1}>
                  Amount: <b>${course.amount}</b>
                </Typography>
                <Typography variant="subtitle1">Category: {course.category}</Typography>
                <Typography variant="subtitle1">Level: {course.level}</Typography>
                <Typography variant="subtitle1">Media: {course.media}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() => handleDeleteCourse(course._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}