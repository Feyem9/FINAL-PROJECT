// import React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Stack from '@mui/material/Stack';
// import InputBase from "@mui/material/InputBase";
// import MenuIcon from "@mui/icons-material/Menu";
// import Menu from "@mui/material/Menu";
// import SearchIcon from "@mui/icons-material/Search";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
// import SchoolIcon from "@mui/icons-material/School";
// import BookIcon from "@mui/icons-material/Book";
// import AnnouncementIcon from "@mui/icons-material/Announcement";
// import FolderIcon from "@mui/icons-material/Folder";
// import { styled } from "@mui/material/styles";
// import { NavLink } from 'react-router-dom';
// import { useState } from 'react';


// const Search = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   backgroundColor: "rgba(255, 255, 255, 0.15)",
//   padding: "4px 10px",
//   borderRadius: "4px",
// }));

// export const Navbar = () => {

//   const [menuAnchor, setMenuAnchor] = useState(null);

//   const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
//   const handleMenuClose = () => setMenuAnchor(null);
//   return (
//     <AppBar position="static" sx={{ background: "linear-gradient(90deg, #43A047, #FF9800)" }}>
//       <Toolbar>
//         {/* Bouton Menu pour les petits écrans */}
//         <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ display: { sm: "none" } }} onClick={handleMenuOpen}>
//           <MenuIcon fontSize="small" />
//         </IconButton>

//                 {/* Menu déroulant mobile */}
//           <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
//           <MenuItem onClick={handleMenuClose}><NavLink to="/course">Course</NavLink></MenuItem>
//           <MenuItem onClick={handleMenuClose}><NavLink to="/teacher">Teachers</NavLink></MenuItem>
//           <MenuItem onClick={handleMenuClose}><NavLink to="/blog">Blog</NavLink></MenuItem>
//           <MenuItem onClick={handleMenuClose}><NavLink to="/resource">Resources</NavLink></MenuItem>
//           <MenuItem onClick={handleMenuClose}><NavLink to="/annonce">Annonces</NavLink></MenuItem>
//         </Menu>

//         {/* Titre du site */}
//         <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: "'Brush Script MT', cursive" }}>
//           Museschool
//         </Typography>

//         {/* Boutons de navigation */}
//         <Stack direction="row" spacing={2} >
//           <Button color="inherit" sx={{ display: { xs: "none", sm: "block" } }}>
//             <LibraryMusicIcon fontSize="small" sx={{ mr: 1 , textDecoration:"none" }} /> <NavLink to="/course" style={{ color: "white", textDecoration: "none" , cursor:"pointer"}}>Course</NavLink>
//           </Button>
//           <Button color="inherit" sx={{ display: { xs: "none", sm: "block" } }}>
//             <SchoolIcon fontSize="small" sx={{ mr: 1 }} /> <NavLink to="/teacher" style={{ color: "white", textDecoration: "none" }}>Teachers</NavLink>
//           </Button>
//           <Button color="inherit" sx={{ display: { xs: "none", sm: "block" } }}>
//             <BookIcon fontSize="small" sx={{ mr: 1 }} /> <NavLink to="/blog" style={{ color: "white", textDecoration: "none" }}>Blog</NavLink>
//           </Button>
//           <Button color="inherit" sx={{ display: { xs: "none", sm: "block" } }}>
//             <FolderIcon fontSize="small" sx={{ mr: 1 }} /> <NavLink to="/resource" style={{ color: "white", textDecoration: "none" }}>Resources</NavLink>
//           </Button>
//           <Button color="inherit" sx={{ display: { xs: "none", sm: "block" } }}>
//             <AnnouncementIcon fontSize="small" sx={{ mr: 1 }} /> <NavLink to="/annonce" style={{ color: "white", textDecoration: "none" }}>Annonces</NavLink>
//           </Button>

//           {/* Barre de recherche */}
//           <Search>
//             <SearchIcon fontSize="small" />
//             <InputBase placeholder="Search…" sx={{ ml: 1, color: "white" }} />
//           </Search>

//           {/* Boutons d'authentification */}
//           <Button color="inherit"> <NavLink to="/login" style={{ color: "white", textDecoration: "none" }}>Sign In</NavLink></Button>
//           <Button 
//             sx={{ ml: 1, bgcolor: "#FF9800", color: "white", '&:hover': { bgcolor: "#E65100" } }} 
//             variant="contained"
//           >
//             <NavLink to="/register" style={{ color: "white", textDecoration: "none" }}>Sign Up</NavLink>
//           </Button>

//           {/* Icône du panier */}
//           <IconButton edge="end" aria-label="cart" color="inherit">
//             <ShoppingCartIcon fontSize="small" />
//           </IconButton>
//         </Stack>
//       </Toolbar>
//     </AppBar>
//   );
// };
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Stack, InputBase, Menu, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import FolderIcon from '@mui/icons-material/Folder';

const Search = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  padding: "4px 10px",
  borderRadius: "4px",
}));

export const Navbar = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(90deg, #43A047, #FF9800)" }}>
      <Toolbar>
        {/* Bouton Menu pour petits écrans */}
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" 
          sx={{ display: { sm: "none" } }} onClick={handleMenuOpen}>
          <MenuIcon fontSize="small" />
        </IconButton>

        {/* Menu déroulant mobile */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}><NavLink to="/course">Course</NavLink></MenuItem>
          <MenuItem onClick={handleMenuClose}><NavLink to="/teacher">Teachers</NavLink></MenuItem>
          <MenuItem onClick={handleMenuClose}><NavLink to="/blog">Blog</NavLink></MenuItem>
          <MenuItem onClick={handleMenuClose}><NavLink to="/resource">Resources</NavLink></MenuItem>
          <MenuItem onClick={handleMenuClose}><NavLink to="/annonce">Annonces</NavLink></MenuItem>
        </Menu>

        {/* Titre du site */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: "'Brush Script MT', cursive" }}>
          Museschool
        </Typography>

        {/* Boutons de navigation desktop */}
        <Stack direction="row" spacing={2} sx={{ display: { xs: "none", sm: "flex" } }}>
          <Button color="inherit">
            <LibraryMusicIcon fontSize="small" sx={{ mr: 1 }} /> 
            <NavLink to="/course" style={{ color: "white", textDecoration: "none" }}>Course</NavLink>
          </Button>
          <Button color="inherit">
            <SchoolIcon fontSize="small" sx={{ mr: 1 }} /> 
            <NavLink to="/teacher" style={{ color: "white", textDecoration: "none" }}>Teachers</NavLink>
          </Button>
          <Button color="inherit">
            <BookIcon fontSize="small" sx={{ mr: 1 }} /> 
            <NavLink to="/blog" style={{ color: "white", textDecoration: "none" }}>Blog</NavLink>
          </Button>
          <Button color="inherit">
            <FolderIcon fontSize="small" sx={{ mr: 1 }} /> 
            <NavLink to="/resource" style={{ color: "white", textDecoration: "none" }}>Resources</NavLink>
          </Button>
          <Button color="inherit">
            <AnnouncementIcon fontSize="small" sx={{ mr: 1 }} /> 
            <NavLink to="/annonce" style={{ color: "white", textDecoration: "none" }}>Annonces</NavLink>
          </Button>
        </Stack>

        {/* Barre de recherche */}
        <Search sx={{ display: { xs: "none", sm: "flex" } }}>
          <SearchIcon fontSize="small" />
          <InputBase placeholder="Search…" sx={{ ml: 1, color: "white" }} />
        </Search>

        {/* Authentification */}
        <Button color="inherit">
          <NavLink to="/login" style={{ color: "white", textDecoration: "none" }}>Sign In</NavLink>
        </Button>
        <Button sx={{ ml: 1, bgcolor: "#FF9800", color: "white", '&:hover': { bgcolor: "#E65100" } }} variant="contained">
          <NavLink to="/register" style={{ color: "white", textDecoration: "none" }}>Sign Up</NavLink>
        </Button>

        {/* Icône panier */}
        <IconButton edge="end" aria-label="cart" color="inherit">
          <ShoppingCartIcon fontSize="small" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
