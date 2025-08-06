import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Stack,
  InputBase,
  Menu,
  MenuItem,
  Box,
  Divider,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import FolderIcon from '@mui/icons-material/Folder';

const Search = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  padding: '4px 10px',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

export const Navbar = () => {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const navLinks = [
    { to: '/course', label: 'Course', icon: <LibraryMusicIcon fontSize="small" sx={{ mr: 1 }} /> },
    { to: '/teacher', label: 'Teachers', icon: <SchoolIcon fontSize="small" sx={{ mr: 1 }} /> },
    { to: '/blog', label: 'Blog', icon: <BookIcon fontSize="small" sx={{ mr: 1 }} /> },
    { to: '/resource', label: 'Resources', icon: <FolderIcon fontSize="small" sx={{ mr: 1 }} /> },
    { to: '/annonce', label: 'Annonces', icon: <AnnouncementIcon fontSize="small" sx={{ mr: 1 }} /> },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'linear-gradient(90deg, #43A047, #FF9800)',
        backdropFilter: 'blur(10px)',
      }}
      elevation={2}
    >
      <Toolbar className="container mx-auto flex flex-wrap">
        {/* Mobile: Menu Burger */}
        <Box sx={{ flexGrow: 0, display: { xs: 'flex', sm: 'none' } }}>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            {navLinks.map((link) => (
              <MenuItem key={link.to} onClick={handleMenuClose}>
                <NavLink to={link.to} className="flex items-center gap-2 text-gray-800 hover:text-primary">
                  {link.icon} {link.label}
                </NavLink>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={handleMenuClose}>
              <NavLink to="/login" className="w-full text-gray-800 hover:text-primary">Sign In</NavLink>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <NavLink to="/register" className="w-full text-gray-800 hover:text-primary">Sign Up</NavLink>
            </MenuItem>
          </Menu>
        </Box>

        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
          className="gap-2"
        >
          <img
            src="/ChatGPT Image 7 avr. 2025, 12_44_05.png"  // remplace par ton fichier
            alt="Logo Museschool"
            className="
              w-10 h-10 sm:w-12 sm:h-12 
              rounded-full 
              border-2 border-indigo-500 
              shadow-md 
              object-cover 
              transition-transform duration-300 
              hover:scale-105 
            " 
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontFamily: "'Brush Script MT', cursive",
              letterSpacing: 1,
            }}
            className="text-white text-base sm:text-lg"
          >
            Museschool
          </Typography>
        </Box>

        {/* Desktop: Nav Links */}
        <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', sm: 'flex' } }} alignItems="center">
          {navLinks.map((link) => (
            <Button key={link.to} color="inherit" sx={{ textTransform: 'none' }}>
              {link.icon}
              <NavLink
                to={link.to}
                className="text-white no-underline hover:underline"
              >
                {link.label}
              </NavLink>
            </Button>
          ))}
        </Stack>

        {/* Desktop: Search */}
        <Search sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, mr: 2 }}>
          <SearchIcon fontSize="small" />
          <InputBase placeholder="Search…" sx={{ ml: 1, color: 'white', width: '100%' }} />
        </Search>

        {/* Auth + Panier */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Button color="inherit" sx={{ textTransform: 'none', display: { xs: 'none', sm: 'block' } }}>
            <NavLink to="/login" className="text-white no-underline">Sign In</NavLink>
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#FF9800',
              color: 'white',
              '&:hover': { bgcolor: '#E65100' },
              textTransform: 'none',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <NavLink to="/register" className="text-white no-underline">Sign Up</NavLink>
          </Button>
          <IconButton edge="end" aria-label="cart" color="inherit">
            <ShoppingCartIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
