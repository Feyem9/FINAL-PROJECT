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

const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/course/all');
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

export const Course = () => {
  const { courses, setCourses, loading, setLoading } = useCourses();
  const { newCourse, setNewCourse, file, setFile, handleInputChange, handleFileChange } = useNewCourse();

  const handleCreateCourse = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('title', newCourse.title);
    formData.append('description', newCourse.description);
    formData.append('amount', newCourse.amount);
    formData.append('level', newCourse.level);
    formData.append('media', newCourse.media);
    if (file) formData.append('file', file);
   // Correction de la ligne 202
   for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
    try {
      const response = await axios.post('http://localhost:3000/course/create', formData ,{
        headers: {
          'Content-Type': 'application/json'
        }
      } );
      console.log('Course created:', response.data);
      setCourses((prev) => [...prev, response.data]);
      setNewCourse({
        title: '',
        description: '',
        amount: '',
        level: '',
        media: 'video',
      });
      setFile(null);
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:3000/course/delete/${courseId}`);
      setCourses((prev) => prev.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Course Management
      </Typography>

      {/* Section de création */}
      <Card sx={{ p: 3, mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Create New Course
          </Typography>

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

          {/* Sélection niveau */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Level</InputLabel>
            <Select name="level" value={newCourse.level} onChange={handleInputChange}>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          {/* Sélection media */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Media Type</InputLabel>
            <Select name="media" value={newCourse.media} onChange={handleInputChange}>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="audio">Audio</MenuItem>
            </Select>
          </FormControl>

          {/* Fichier */}
          <Button variant="contained" component="label" fullWidth sx={{ my: 2 }}>
            Upload Media
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </CardContent>

        <CardActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleCreateCourse}
            disabled={loading}
          >
            {loading ? "Creating Course..." : "Create Course"}
          </Button>
        </CardActions>
      </Card>

      {/* Liste des cours */}
      <Typography variant="h5" fontWeight="bold" mb={2}>
        All Courses
      </Typography>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card sx={{ p: 2, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
                <Typography variant="subtitle1" mt={1}>
                  Amount: <b>${course.amount}</b>
                </Typography>
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
};