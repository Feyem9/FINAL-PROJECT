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
import { Link } from "react-router-dom";


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
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      elevation={0}
    >
      <Toolbar className="container mx-auto flex flex-wrap">
        {/* Mobile: Menu Burger */}
        <Box sx={{ flexGrow: 0, display: { xs: 'flex', sm: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }
            }}
          >
            {navLinks.map((link) => (
              <MenuItem
                key={link.to}
                onClick={handleMenuClose}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(67, 160, 71, 0.1)'
                  }
                }}
              >
                <NavLink
                  to={link.to}
                  className="flex items-center gap-3 text-gray-800 hover:text-green-600 w-full py-2"
                  style={({ isActive }) => ({
                    fontWeight: isActive ? 'bold' : 'normal',
                    color: isActive ? '#43A047' : 'inherit'
                  })}
                >
                  {link.icon} {link.label}
                </NavLink>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={handleMenuClose}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(67, 160, 71, 0.1)'
                }
              }}
            >
              <NavLink
                to="/login"
                className="w-full text-gray-800 hover:text-green-600 py-2"
                style={({ isActive }) => ({
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? '#43A047' : 'inherit'
                })}
              >
                Sign In
              </NavLink>
            </MenuItem>
            <MenuItem
              onClick={handleMenuClose}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(67, 160, 71, 0.1)'
                }
              }}
            >
              <NavLink
                to="/register"
                className="w-full text-gray-800 hover:text-green-600 py-2"
                style={({ isActive }) => ({
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? '#43A047' : 'inherit'
                })}
              >
                Sign Up
              </NavLink>
            </MenuItem>
          </Menu>
        </Box>

        {/* Logo */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
          className="gap-3"
        >
          <img
            src="/ChatGPT Image 7 avr. 2025, 12_44_05.png"
            alt="Logo Museschool"
            className="
                  w-12 h-12 sm:w-14 sm:h-14
                  rounded-full
                  border-2 border-white
                  shadow-lg
                  object-cover
                  transition-transform duration-300
                  hover:scale-105
                "
          />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontFamily: "'Brush Script MT', cursive",
              letterSpacing: 1,
              fontWeight: 'bold',
            }}
            className="text-white text-xl sm:text-2xl"
          >
            Museschool
          </Typography>
        </Box>

        {/* Desktop: Nav Links */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
          alignItems="center"
          className="ml-4"
        >
          {navLinks.map((link) => (
            <Button
              key={link.to}
              color="inherit"
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                mx: 0.5,
                px: 2,
                py: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <NavLink
                to={link.to}
                className="text-white no-underline flex items-center gap-1"
                style={({ isActive }) => ({
                  fontWeight: isActive ? 'bold' : 'normal',
                  color: isActive ? '#ffffff' : 'inherit',
                  textShadow: isActive ? '0 0 4px rgba(255, 255, 255, 0.5)' : 'none'
                })}
              >
                {link.icon}
                <span className="hidden md:inline">{link.label}</span>
              </NavLink>
            </Button>
          ))}
        </Stack>

        {/* Desktop: Search */}
        <Search sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, mr: 2, maxWidth: '200px' }}>
          <SearchIcon fontSize="small" sx={{ color: 'white' }} />
          <InputBase
            placeholder="Search…"
            sx={{
              ml: 1,
              color: 'white',
              width: '100%',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }}
          />
        </Search>

        {/* Auth + Panier */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            color="inherit"
            sx={{
              textTransform: 'none',
              display: { xs: 'none', sm: 'block' },
              borderRadius: '8px',
              px: 2,
              py: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <NavLink
              to="/login"
              className="text-white no-underline"
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              Sign In
            </NavLink>
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#FF9800',
              color: 'white',
              '&:hover': {
                bgcolor: '#E65100',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              },
              textTransform: 'none',
              display: { xs: 'none', sm: 'block' },
              borderRadius: '8px',
              px: 3,
              py: 1,
              fontWeight: 'medium',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            <NavLink
              to="/register"
              className="text-white no-underline"
              style={({ isActive }) => ({
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              Sign Up
            </NavLink>
          </Button>
          <IconButton
            component={Link}
            to="/cart"
            edge="end"
            aria-label="cart"
            color="inherit"
            sx={{
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }
            }}
          >
            <ShoppingCartIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
