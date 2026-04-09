import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import Navbar from '../Components/Layout/Navbar.js';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 100, height: 100, bgcolor: '#3498db', mb: 2 }}>
              {user.name?.charAt(0) || 'E'}
            </Avatar>
            <Typography variant="h4" gutterBottom>{user.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              {user.employeeId}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Box>
            <Typography variant="h6" gutterBottom>Personal Information</Typography>
            <Box display="grid" gap={2} sx={{ mt: 2 }}>
              <Box>
                <Typography variant="body2" color="textSecondary">Employee ID</Typography>
                <Typography variant="body1">{user.employeeId}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Name</Typography>
                <Typography variant="body1">{user.name}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Email</Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Department</Typography>
                <Typography variant="body1">{user.department}</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Profile;