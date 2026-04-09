import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Container,
  Tooltip,
  Divider,
  ListItemIcon,
  useTheme,
  alpha
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Settings,
  Person,
  Dashboard,
  Fingerprint,
  Brightness4,
  Brightness7,
  ExitToApp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import { jwtDecode } from "jwt-decode";
import { ThemeContext } from '@emotion/react';

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        const decode = await jwtDecode(token);
        setUserName(decode);
      }
    };
    fetchUserData();
  }, [token]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (userName.name) {
      return userName.name.charAt(0).toUpperCase();
    }
    return 'E';
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={scrolled ? 4 : 0}
      sx={{
        bgcolor: scrolled 
          ? alpha(ThemeContext?.palette?.primary?.main || '#3498db', 0.95)
          : '#3498db',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'all 0.3s ease-in-out',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ py: 1, justifyContent: 'space-between' }}>
          {/* Logo and Brand Section */}
          <Box 
            display="flex" 
            alignItems="center" 
            gap={1}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                transform: 'scale(1.02)',
                transition: 'transform 0.2s'
              }
            }}
            onClick={() => navigate('/dashboard')}
          >
            <Fingerprint sx={{ fontSize: 32, color: '#fff' }} />
            <Typography 
              variant="h6" 
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #fff 0%, #e0e0e0 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '0.5px'
              }}
            >
              Attendance Management
            </Typography>
          </Box>

          {/* Right Section */}
          <Box display="flex" alignItems="center" gap={2}>
            {/* Welcome Message */}
            <Typography 
              variant="body2" 
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 500,
                letterSpacing: '0.3px'
              }}
            >
              Welcome back, 
              <Box component="span" sx={{ fontWeight: 700, ml: 0.5 }}>
                {userName.name || 'Employee'}
              </Box>
            </Typography>

            {/* Theme Toggle Button */}
            {toggleTheme && (
              <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                <IconButton 
                  onClick={toggleTheme} 
                  color="inherit"
                  sx={{
                    '&:hover': {
                      transform: 'rotate(180deg)',
                      transition: 'transform 0.3s'
                    }
                  }}
                >
                  {isDarkMode ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>
            )}

            {/* Desktop Logout Button */}
            {/* <Button 
              onClick={handleLogout}
              variant="outlined"
              sx={{
                display: { xs: 'none', md: 'flex' },
                color: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s'
              }}
            >
              <ExitToApp sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </Button> */}

            {/* Avatar with Menu */}
            <Tooltip title="Account settings">
              <IconButton 
                onClick={handleMenu} 
                size="small"
                sx={{ 
                  ml: 1,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: '#2c3e50',
                    width: 40,
                    height: 40,
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      border: '2px solid #fff'
                    }
                  }}
                >
                  {getInitials()}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  overflow: 'visible',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: -8,
                    right: 14,
                    width: 16,
                    height: 16,
                    bgcolor: 'background.paper',
                    transform: 'rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {userName.name || 'Employee'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userName.email || 'employee@company.com'}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
                <ListItemIcon>
                  <Dashboard fontSize="small" />
                </ListItemIcon>
                Dashboard
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                My Profile
              </MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;