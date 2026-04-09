import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Snackbar,
  Avatar,
  LinearProgress,
  Fade,
  Grow,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../Components/Layout/Navbar.js';
import axios from 'axios';
import {
  AccessTime,
  LocationOn,
  CheckCircle,
  Cancel,
  TrendingUp,
  EmojiEvents,
  CalendarToday,
  WifiOff,
  Wifi,
  Fingerprint,
  Warning,
  BusinessCenter
} from '@mui/icons-material';

// Styled Components
const GradientCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '20px',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: '50px',
  padding: '12px 30px',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
}));

const TimeCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '30px',
  padding: '30px',
  textAlign: 'center',
  color: 'white',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
}));

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [connectionStatus, setConnectionStatus] = useState(true);
  const [locationPermission, setLocationPermission] = useState(null);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Office Timings Configuration
  const OFFICE_START_TIME = "10:00"; // 10:00 AM
  const OFFICE_END_TIME = "19:00";   // 7:00 PM
  const GRACE_PERIOD_MINUTES = 15;    // 15 minutes grace period

  const API_BASE_URL = 'http://localhost:3500/api';

  useEffect(() => {
    fetchTodayStatus();
    checkConnection();
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const updateDateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    }));
    setCurrentDate(now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  };

  const checkConnection = () => {
    setConnectionStatus(navigator.onLine);
    window.addEventListener('online', () => setConnectionStatus(true));
    window.addEventListener('offline', () => setConnectionStatus(false));
  };

  // Check if check-in is allowed based on time
  const isCheckInAllowed = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    
    const startTimeInMinutes = 10 * 60; // 10:00 = 600 minutes
    const endTimeInMinutes = 19 * 60;   // 19:00 = 1140 minutes
    
    // Allow check-in from 10:00 AM to 7:00 PM
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return { allowed: true, message: '' };
    } else if (currentTimeInMinutes < startTimeInMinutes) {
      return { 
        allowed: false, 
        message: `Office starts at 10:00 AM. Please wait until office hours to check in.` 
      };
    } else {
      return { 
        allowed: false, 
        message: `Office hours ended at 7:00 PM. You cannot check in now.` 
      };
    }
  };

  // Check if check-out is allowed based on time
  const isCheckOutAllowed = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    
    const startTimeInMinutes = 10 * 60; // 10:00 AM
    const endTimeInMinutes = 20 * 60;   // 8:00 PM (extended for checkout)
    
    // Allow check-out from 10:00 AM to 8:00 PM
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return { allowed: true, message: '' };
    } else if (currentTimeInMinutes < startTimeInMinutes) {
      return { 
        allowed: false, 
        message: `You haven't checked in yet. Office starts at 10:00 AM.` 
      };
    } else {
      return { 
        allowed: false, 
        message: `Office closed at 7:00 PM. Please check out before that time.` 
      };
    }
  };

  // Calculate late status
  const isLate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    
    const startTimeInMinutes = 10 * 60; // 10:00 AM
    const graceTimeInMinutes = startTimeInMinutes + GRACE_PERIOD_MINUTES; // 10:15 AM
    
    return currentTimeInMinutes > graceTimeInMinutes;
  };

  const fetchTodayStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, user might not be logged in');
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/attendance/today`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setTodayStatus(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching today status:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationPermission(false);
          let errorMessage = 'Location access denied';
          if (error.code === 1) errorMessage = 'Please allow location permission';
          if (error.code === 2) errorMessage = 'Location unavailable';
          if (error.code === 3) errorMessage = 'Location request timeout';
          reject(new Error(errorMessage));
        },
        { 
          enableHighAccuracy: true, 
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const handleCheckInClick = () => {
    const timeCheck = isCheckInAllowed();
    if (!timeCheck.allowed) {
      setSnackbar({
        open: true,
        message: '⏰ ' + timeCheck.message,
        severity: 'warning'
      });
      return;
    }
    
    // Show warning if late
    if (isLate()) {
      setPendingAction('checkin');
      setShowTimeWarning(true);
    } else {
      handleCheckIn();
    }
  };

  const handleCheckOutClick = () => {
    const timeCheck = isCheckOutAllowed();
    if (!timeCheck.allowed) {
      setSnackbar({
        open: true,
        message: '⏰ ' + timeCheck.message,
        severity: 'warning'
      });
      return;
    }
    handleCheckOut();
  };

  const handleCheckIn = async () => {
    setLocationLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: '❌ Please login first',
          severity: 'error'
        });
        window.location.href = '/login';
        return;
      }

      const location = await getCurrentLocation();
      
      const response = await axios.post(
        `${API_BASE_URL}/attendance/checkin`,
        {
          latitude: location.latitude,
          longitude: location.longitude
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Check-in response:', response.data);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: '✅ ' + response.data.message,
          severity: 'success'
        });
        fetchTodayStatus();
      } else {
        setSnackbar({
          open: true,
          message: '❌ ' + response.data.message,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Check-in error:', error);
      let errorMessage = 'Failed to mark check-in';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: '❌ ' + errorMessage,
        severity: 'error'
      });
    } finally {
      setLocationLoading(false);
      setShowTimeWarning(false);
      setPendingAction(null);
    }
  };

  const handleCheckOut = async () => {
    setLocationLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({
          open: true,
          message: '❌ Please login first',
          severity: 'error'
        });
        window.location.href = '/login';
        return;
      }

      const location = await getCurrentLocation();
      
      const response = await axios.post(
        `${API_BASE_URL}/attendance/checkout`,
        {
          latitude: location.latitude,
          longitude: location.longitude
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      console.log('Check-out response:', response.data);
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: '✅ ' + response.data.message,
          severity: 'success'
        });
        fetchTodayStatus();
      } else {
        setSnackbar({
          open: true,
          message: '❌ ' + response.data.message,
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Check-out error:', error);
      let errorMessage = 'Failed to mark check-out';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setSnackbar({
        open: true,
        message: '❌ ' + errorMessage,
        severity: 'error'
      });
    } finally {
      setLocationLoading(false);
    }
  };

  // Parse status data correctly
  const isCheckedIn = todayStatus?.checkInTime ? true : false;
  const isCheckedOut = todayStatus?.checkOutTime ? true : false;
  const workingHours = todayStatus?.workingHours || 0;
  const checkInTime = todayStatus?.checkInTime;
  const checkOutTime = todayStatus?.checkOutTime;
  const status = todayStatus?.status;

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleCloseWarning = () => {
    setShowTimeWarning(false);
    setPendingAction(null);
  };

  const handleProceedWithWarning = () => {
    if (pendingAction === 'checkin') {
      handleCheckIn();
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          {/* Connection Status Bar */}
          {!connectionStatus && (
            <Alert severity="warning" icon={<WifiOff />} sx={{ mb: 3, borderRadius: '15px' }}>
              You are offline. Please check your internet connection.
            </Alert>
          )}

          {/* Office Hours Banner */}
          <Grow in={true} timeout={600}>
            <Alert 
              severity="info" 
              icon={<BusinessCenter />}
              sx={{ mb: 3, borderRadius: '15px', bgcolor: '#e3f2fd' }}
            >
              <strong>Office Hours: 10:00 AM - 7:00 PM</strong>
              <br />
              Grace period: 15 minutes (until 10:15 AM)
            </Alert>
          </Grow>

          {/* Welcome Section */}
          <Grow in={true} timeout={800}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50', mb: 1 }}>
                Welcome Back! 👋
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#7f8c8d' }}>
                {currentDate}
              </Typography>
            </Box>
          </Grow>

          {/* Time Card */}
          <Zoom in={true} timeout={600}>
            <TimeCard elevation={0}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                <AccessTime sx={{ fontSize: 40 }} />
                <Typography variant="h4" sx={{ fontWeight: 'light' }}>
                  Current Time
                </Typography>
              </Box>
              <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '3rem', md: '5rem' }, mb: 2 }}>
                {currentTime}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {currentDate}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Chip 
                  label={`Office Opens: 10:00 AM`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  label={`Office Closes: 7:00 PM`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </TimeCard>
          </Zoom>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Fade in={true} timeout={1000}>
                <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Today's Status
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {isCheckedIn ? (status === 'late' ? 'Late' : 'Present') : 'Absent'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {isCheckedIn 
                            ? `Checked in at ${checkInTime}` 
                            : 'Not marked yet'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ 
                        bgcolor: isCheckedIn 
                          ? (status === 'late' ? '#ff9800' : '#4caf50') 
                          : '#f44336', 
                        width: 56, 
                        height: 56 
                      }}>
                        {isCheckedIn ? <CheckCircle /> : <Cancel />}
                      </Avatar>
                    </Box>
                  </Box>
                </Card>
              </Fade>
            </Grid>

            <Grid item xs={12} md={4}>
              <Fade in={true} timeout={1200}>
                <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Working Hours
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {workingHours.toFixed(1)} hrs
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Target: 9 hours
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: '#3498db', width: 56, height: 56 }}>
                        <TrendingUp />
                      </Avatar>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((workingHours / 9) * 100, 100)} 
                      sx={{ mt: 2, height: 8, borderRadius: '10px' }}
                    />
                  </Box>
                </Card>
              </Fade>
            </Grid>

            <Grid item xs={12} md={4}>
              <Fade in={true} timeout={1400}>
                <Card sx={{ borderRadius: '20px', overflow: 'hidden' }}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Location Status
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                      <Box>
                        <Typography variant="h4" fontWeight="bold">
                          {locationPermission === null ? 'Unknown' : locationPermission ? 'Active' : 'Disabled'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {locationPermission ? 'GPS is enabled' : 'Please enable location'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: locationPermission ? '#4caf50' : '#f44336', width: 56, height: 56 }}>
                        <LocationOn />
                      </Avatar>
                    </Box>
                  </Box>
                </Card>
              </Fade>
            </Grid>
          </Grid>

          {/* Status Alert */}
          {todayStatus && checkInTime && (
            <Grow in={true} timeout={1000}>
              <Alert 
                severity={checkOutTime ? "success" : "info"} 
                sx={{ mb: 3, borderRadius: '15px', fontSize: '16px' }}
                icon={checkOutTime ? <CheckCircle /> : <AccessTime />}
              >
                <strong>{checkOutTime ? '✅ Day Completed!' : '🟢 Work in Progress'}</strong>
                <br />
                Check In: {checkInTime}
                {checkOutTime && ` | Check Out: ${checkOutTime}`}
                {workingHours > 0 && ` | Working Hours: ${workingHours.toFixed(2)} hrs`}
                {status === 'late' && !checkOutTime && ` | ⚠️ You were late today (After 10:15 AM)`}
              </Alert>
            </Grow>
          )}

          {/* Location Info Banner */}
          <Grow in={true} timeout={1000}>
            <Paper sx={{ p: 2, mb: 4, bgcolor: '#fff3e0', borderRadius: '15px' }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Fingerprint sx={{ color: '#ff9800', fontSize: 30 }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>📍 Location-Based Attendance</strong><br />
                  You can only mark attendance when within 100 meters of the office premises. 
                  Your location is verified in real-time for security.
                </Typography>
              </Box>
            </Paper>
          </Grow>

          {/* Action Buttons */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={800}>
                <GradientCard>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      width: 80, 
                      height: 80, 
                      margin: '0 auto 20px' 
                    }}>
                      <AccessTime sx={{ fontSize: 50 }} />
                    </Avatar>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                      Check In
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                      Mark your arrival time
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                      ⏰ Office starts at <strong>10:00 AM</strong>
                      <br />
                      ⚠️ Late after <strong>10:15 AM</strong>
                    </Typography>
                    <AnimatedButton
                      fullWidth
                      variant="contained"
                      disabled={locationLoading || isCheckedIn || !connectionStatus}
                      onClick={handleCheckInClick}
                      sx={{ 
                        bgcolor: 'white', 
                        color: '#667eea',
                        '&:hover': { bgcolor: '#f0f0f0' }
                      }}
                    >
                      {locationLoading ? <CircularProgress size={24} color="inherit" /> : '📍 Check In Now'}
                    </AnimatedButton>
                    {isCheckedIn && !checkOutTime && (
                      <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.9 }}>
                        ✅ Checked in at {checkInTime}
                        {status === 'late' && ' (Late)'}
                      </Typography>
                    )}
                  </CardContent>
                </GradientCard>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={1000}>
                <GradientCard>
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      width: 80, 
                      height: 80, 
                      margin: '0 auto 20px' 
                    }}>
                      <EmojiEvents sx={{ fontSize: 50 }} />
                    </Avatar>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                      Check Out
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                      Mark your departure time
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                      ⏰ Office ends at <strong>7:00 PM</strong>
                      <br />
                      📊 Minimum 9 hours required
                    </Typography>
                    <AnimatedButton
                      fullWidth
                      variant="contained"
                      disabled={locationLoading || !isCheckedIn || isCheckedOut || !connectionStatus}
                      onClick={handleCheckOutClick}
                      sx={{ 
                        bgcolor: 'white', 
                        color: '#764ba2',
                        '&:hover': { bgcolor: '#f0f0f0' }
                      }}
                    >
                      {locationLoading ? <CircularProgress size={24} color="inherit" /> : '📍 Check Out Now'}
                    </AnimatedButton>
                    {isCheckedOut && (
                      <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.9 }}>
                        ✅ Checked out at {checkOutTime}
                        {workingHours > 0 && ` | Hours: ${workingHours.toFixed(1)}`}
                      </Typography>
                    )}
                  </CardContent>
                </GradientCard>
              </Zoom>
            </Grid>
          </Grid>

          {/* Motivational Quote */}
          <Fade in={true} timeout={1500}>
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Paper sx={{ p: 3, bgcolor: '#2c3e50', borderRadius: '20px' }}>
                <Typography variant="body1" sx={{ color: 'white', fontStyle: 'italic' }}>
                  "Success is the sum of small efforts, repeated day in and day out."
                </Typography>
                <Typography variant="caption" sx={{ color: '#ecf0f1', mt: 1, display: 'block' }}>
                  - Robert Collier
                </Typography>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Warning Dialog for Late Check-in */}
      <Dialog
        open={showTimeWarning}
        onClose={handleCloseWarning}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning sx={{ color: '#ff9800' }} />
          Late Check-in Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are checking in after 10:15 AM. This will be marked as <strong>LATE</strong>.
            <br /><br />
            Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWarning} color="primary">
            Cancel
          </Button>
          <Button onClick={handleProceedWithWarning} color="warning" autoFocus>
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '15px' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;