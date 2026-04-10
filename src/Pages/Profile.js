import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Divider,
  Grid,
  Chip,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Email,
  Badge,
  Business,
  Phone,
  CalendarToday,
  Edit,
  LocationOn,
  // School,
  Work
} from '@mui/icons-material';
import Navbar from '../Components/Layout/Navbar.js';
import { jwtDecode } from 'jwt-decode';

const Profile = () => {
  const theme = useTheme();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    role: '',
    phone: '',
    address: '',
    joinDate: '',
    // designation: ''
  });
  console.log('this is uer data role',userData.role)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (userToken) {
          const decodedToken = await jwtDecode(userToken);
          console.log('Decoded token:', decodedToken.role);

          
          // Get additional user data from localStorage if available
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          
          setUserData({
            name: decodedToken.name || storedUser.name || '',
            email: decodedToken.email || storedUser.email || '',
            employeeId: decodedToken.employeeId || storedUser.employeeId || 'EMP001',
            department: decodedToken.department || storedUser.department || 'Not Specified',
            role: decodedToken.role || storedUser.role || 'Employee',
            phone: decodedToken.number || storedUser.number || 'Not Provided',
            address: decodedToken.address || storedUser.address || 'Not Provided',
            joinDate: decodedToken.date || storedUser.date || '',
            // designation: decodedToken.designation || storedUser.designation || 'Staff'
          });
        }
        console.log('setuserdata',setUserData.role)
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userToken]);

  const getInitials = () => {
    if (userData.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Not Provided') return 'Not Provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="80vh"
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Cover Photo Area */}
        <Box
          sx={{
            height: 200,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            borderRadius: 3,
            mb: -6,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 1
            }}
          >
            <IconButton 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
              }}
            >
              <Edit sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Profile Content */}
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Profile Header */}
          <Box 
            sx={{ 
              p: 4,
              pt: 8,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              gap: 3,
              bgcolor: 'background.paper'
            }}
          >
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: theme.palette.primary.main,
                border: '4px solid white',
                boxShadow: 3,
                fontSize: 48,
                fontWeight: 'bold'
              }}
            >
              {getInitials()}
            </Avatar>
            
            <Box textAlign={{ xs: 'center', sm: 'left' }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {userData.name}
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" justifyContent={{ xs: 'center', sm: 'flex-start' }}>
                <Chip 
                  label={userData.role} 
                  color="primary" 
                  size="small"
                  icon={<Work />}
                />
                <Chip 
                  label={userData.department} 
                  variant="outlined" 
                  size="small"
                  icon={<Business />}
                />
                <Chip 
                  label={`ID: ${userData.employeeId}`} 
                  variant="outlined" 
                  size="small"
                  icon={<Badge />}
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          {/* Profile Details */}
          <Box sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Email color="primary" />
                      <Typography variant="body2" color="textSecondary">Email Address</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {userData.email}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Badge color="primary" />
                      <Typography variant="body2" color="textSecondary">Employee ID</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {userData.employeeId}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Business color="primary" />
                      <Typography variant="body2" color="textSecondary">Department</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {userData.department}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Work color="primary" />
                      <Typography variant="body2" color="textSecondary">Designation</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {userData.designation}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid> */}

              <Grid item xs={12} Account Typemd={6}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Phone color="primary" />
                      <Typography variant="body2" color="textSecondary">Phone Number</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {userData.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <CalendarToday color="primary" />
                      <Typography variant="body2" color="textSecondary">Join Date</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(userData.joinDate)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <LocationOn color="primary" />
                      <Typography variant="body2" color="textSecondary">Address</Typography>
                    </Box>
                    <Typography variant="body1" fontWeight="medium">
                      {userData.address}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Additional Info Section */}
            <Box mt={4}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
                Account Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Account Type</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {userData.role === 'admin' ? 'Administrator' : 'Regular User'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">Status</Typography>
                  <Chip 
                    label="Active" 
                    color="success" 
                    size="small" 
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Profile;