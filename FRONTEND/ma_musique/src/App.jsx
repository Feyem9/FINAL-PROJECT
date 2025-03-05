import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Request from '../src/auth/Register'
import Login from '../src/auth/Login'
import Home from '../src/home/Home'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';


import './App.css'
import { Course } from './components/course/Course.component';
import { Teacher } from './components/teacher/Teacher.component';
import { Blog } from './components/blog/Blog.component';
import { Resource } from './components/resource/Resource.component';
import { Annonce } from './components/annonce/Annonce.component';

// Crée un thème personnalisé (optionnel)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Couleur principale
    },
    secondary: {
      main: '#ff4081', // Couleur secondaire
    },
  },
});


function App() {

  return (

      <Router>
        <Routes>
          <Route path='*' element={<Login/>}/>
          <Route path="/register" element={<Request />} />
          <Route path="/login" element={<Login />} />
          <Route path='/home' element={<Home />} />
          <Route path='/course' element={<Course />} />
          <Route path='/teacher' element={<Teacher />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/resource' element={<Resource />} />
          <Route path='/annonce' element={<Annonce />} />

        </Routes>
      </Router>
  );
}

export default App
