import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // 📌 Import du Router
import App from './App';  // 📌 Import de l'application principale
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// 📌 Création d'un thème Material UI (facultatif)
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#ff9800',
    },
  },
});

// 📌 Sélection de l'élément où injecter React (id="root" dans index.html)
const root = ReactDOM.createRoot(document.getElementById('root'));

// 📌 Rendu de l'application React
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Un seul Router ici */}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App /> {/* 📌 Le composant principal */}
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
