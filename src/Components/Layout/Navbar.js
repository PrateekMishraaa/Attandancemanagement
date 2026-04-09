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
  Box
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import {jwtDecode} from "jwt-decode"
const Navbar = () => {
  const [userName,setUserName] = useState('')
  console.log('this is suueruhushduhs',userName.name)
  const token = localStorage.getItem('token')
  console.log('this is user token',token)

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');


  useEffect(()=>{
    const fetchUserData =async()=>{
      if(token){
        const decode = await jwtDecode(token)
        console.log('this is decode',decode.username)
        setUserName(decode)
      }
    }
    fetchUserData()
  },[])
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

  return (
    <AppBar position="static" sx={{ bgcolor: '#3498db' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Attendance Management System
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">
            Welcome, {userName.name || 'Employee'}
          </Typography>
          <IconButton onClick={handleMenu} color="inherit">
            <Avatar sx={{ bgcolor: '#2c3e50' }}>
              {userName.name?.charAt(0) || 'E'}
            </Avatar>
          </IconButton>
            <Button onClick={handleLogout}>
              Logout
            </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;