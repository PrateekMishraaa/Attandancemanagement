import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Chip,
  Tooltip,
  IconButton,
  Divider,
  alpha,
  useTheme,
  keyframes,
  Badge,
  Skeleton,
  Backdrop,
  Slide
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
  BusinessCenter,
  AnalyticsOutlined,
  Celebration,
  Coffee,
  LunchDining,
  Nightlight,
  WbSunny,
  CloudQueue,
  Speed,
  Stars,
  Shield,
  VerifiedUser,
  Schedule,
  Timer,
  TrendingDown,
  SentimentSatisfiedAlt,
  RocketLaunch,
  WorkspacePremium,
  Timelapse,
  PlayArrow,
  Stop,
  Brightness1,
  Circle,
  Bolt
} from '@mui/icons-material';
import { jwtDecode } from "jwt-decode";

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
  100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.8); }
`;

// Styled Components
const GradientCard = styled(Card)(({ theme, gradient }) => ({
  background: gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '28px',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
  },
}));

const AnimatedButton = styled(Button)(({ theme, gradient }) => ({
  borderRadius: '60px',
  padding: '14px 32px',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  background: gradient || `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s ease',
  },
  '&:hover::before': {
    left: '100%',
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
}));

const TimeCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  borderRadius: '40px',
  padding: '40px',
  textAlign: 'center',
  color: 'white',
  boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 200,
    height: 200,
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    borderRadius: '50%',
  },
}));

const StatsCard = styled(Card)(({ theme, color }) => ({
  borderRadius: '24px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
  border: `1px solid ${color}30`,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 15px 35px ${color}40`,
    border: `1px solid ${color}80`,
  },
}));

const FloatingIcon = styled(Avatar)(({ theme, delay }) => ({
  animation: `${float} 3s ease-in-out infinite`,
  animationDelay: delay || '0s',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
}));

const NeonChip = styled(Chip)(({ theme }) => ({
  borderRadius: '20px',
  background: 'rgba(255,255,255,0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.3)',
  '&:hover': {
    background: 'rgba(255,255,255,0.25)',
    transform: 'scale(1.05)',
    transition: 'all 0.3s ease',
  },
}));

const GradientProgress = styled(LinearProgress)(({ theme }) => ({
  height: 12,
  borderRadius: 10,
  background: 'rgba(0,0,0,0.1)',
  '& .MuiLinearProgress-bar': {
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 10,
  },
}));

const Dashboard = () => {
  const theme = useTheme();
  const loginToken = localStorage.getItem('token');
  const [tokenData, setTokenData] = useState(null);
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
  const [greeting, setGreeting] = useState('');
  const [weatherIcon, setWeatherIcon] = useState(null);
  const [streakCount, setStreakCount] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState({ present: 0, absent: 0, late: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Office Timings Configuration
  const OFFICE_START_TIME = "10:00";
  const OFFICE_END_TIME = "19:00";
  const GRACE_PERIOD_MINUTES = 15;

  const API_BASE_URL = 'http://localhost:3500/api';

  // Set greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
    
    // Set weather icon based on time
    if (hour < 12) setWeatherIcon(<WbSunny sx={{ fontSize: 40, color: '#FFD700' }} />);
    else if (hour < 17) setWeatherIcon(<WbSunny sx={{ fontSize: 40, color: '#FFA500' }} />);
    else setWeatherIcon(<Nightlight sx={{ fontSize: 40, color: '#4169E1' }} />);
  }, []);

  useEffect(() => {
    const fetchUserTokenData = async () => {
      try {
        if (loginToken) {
          const decodedToken = await jwtDecode(loginToken);
          setTokenData(decodedToken);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    fetchUserTokenData();
    fetchMonthlyStats();
    fetchStreakCount();
  }, []);

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

  const isCheckInAllowed = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const startTimeInMinutes = 10 * 60;
    const endTimeInMinutes = 19 * 60;
    
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return { allowed: true, message: '' };
    } else if (currentTimeInMinutes < startTimeInMinutes) {
      return { allowed: false, message: `Office starts at 10:00 AM. Please wait until office hours to check in.` };
    } else {
      return { allowed: false, message: `Office hours ended at 7:00 PM. You cannot check in now.` };
    }
  };

  const isCheckOutAllowed = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const startTimeInMinutes = 10 * 60;
    const endTimeInMinutes = 20 * 60;
    
    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
      return { allowed: true, message: '' };
    } else if (currentTimeInMinutes < startTimeInMinutes) {
      return { allowed: false, message: `You haven't checked in yet. Office starts at 10:00 AM.` };
    } else {
      return { allowed: false, message: `Office closed at 7:00 PM. Please check out before that time.` };
    }
  };

  const isLate = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
    const startTimeInMinutes = 10 * 60;
    const graceTimeInMinutes = startTimeInMinutes + GRACE_PERIOD_MINUTES;
    return currentTimeInMinutes > graceTimeInMinutes;
  };

  const fetchTodayStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
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

  const fetchMonthlyStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${API_BASE_URL}/attendance/monthly-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMonthlyStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
    }
  };

  const fetchStreakCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get(`${API_BASE_URL}/attendance/streak`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStreakCount(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };
const handleProceedWithWarning = () => {
  if (pendingAction === 'checkin') {
    handleCheckIn();
  }
};
  const handleCheckInClick = () => {
    const timeCheck = isCheckInAllowed();
    if (!timeCheck.allowed) {
      setSnackbar({ open: true, message: '⏰ ' + timeCheck.message, severity: 'warning' });
      return;
    }
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
      setSnackbar({ open: true, message: '⏰ ' + timeCheck.message, severity: 'warning' });
      return;
    }
    handleCheckOut();
  };

  const handleCheckIn = async () => {
    setLocationLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSnackbar({ open: true, message: '❌ Please login first', severity: 'error' });
        window.location.href = '/login';
        return;
      }
      const location = await getCurrentLocation();
      const response = await axios.post(`${API_BASE_URL}/attendance/checkin`, {
        latitude: location.latitude,
        longitude: location.longitude
      }, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        setSnackbar({ open: true, message: '✅ ' + response.data.message, severity: 'success' });
        fetchTodayStatus();
        fetchMonthlyStats();
        fetchStreakCount();
      } else {
        setSnackbar({ open: true, message: '❌ ' + response.data.message, severity: 'error' });
      }
    } catch (error) {
      let errorMessage = 'Failed to mark check-in';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      setSnackbar({ open: true, message: '❌ ' + errorMessage, severity: 'error' });
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
        setSnackbar({ open: true, message: '❌ Please login first', severity: 'error' });
        window.location.href = '/login';
        return;
      }
      const location = await getCurrentLocation();
      const response = await axios.post(`${API_BASE_URL}/attendance/checkout`, {
        latitude: location.latitude,
        longitude: location.longitude
      }, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      
      if (response.data.success) {
        setSnackbar({ open: true, message: '✅ ' + response.data.message, severity: 'success' });
        fetchTodayStatus();
        fetchMonthlyStats();
      } else {
        setSnackbar({ open: true, message: '❌ ' + response.data.message, severity: 'error' });
      }
    } catch (error) {
      let errorMessage = 'Failed to mark check-out';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      setSnackbar({ open: true, message: '❌ ' + errorMessage, severity: 'error' });
    } finally {
      setLocationLoading(false);
    }
  };

  const isCheckedIn = todayStatus?.checkInTime ? true : false;
  const isCheckedOut = todayStatus?.checkOutTime ? true : false;
  const workingHours = todayStatus?.workingHours || 0;
  const checkInTime = todayStatus?.checkInTime;
  const checkOutTime = todayStatus?.checkOutTime;
  const status = todayStatus?.status;

  const getTimeOfDayIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return <Coffee sx={{ fontSize: 28 }} />;
    if (hour < 17) return <LunchDining sx={{ fontSize: 28 }} />;
    return <Nightlight sx={{ fontSize: 28 }} />;
  };

  const getMotivationalMessage = () => {
    if (!isCheckedIn) return "Start your day strong! 💪";
    if (isCheckedIn && !isCheckedOut) return "Great progress! Keep going! 🚀";
    return "Amazing work today! 🌟";
  };

  const getProductivityPercentage = () => {
    return Math.min((workingHours / 9) * 100, 100);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ 
        bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh', 
        py: 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}>
        <Container maxWidth="lg">
          {/* Connection Status Bar */}
          <Slide direction="down" in={!connectionStatus} mountOnEnter unmountOnExit>
            <Alert 
              severity="warning" 
              icon={<WifiOff sx={{ animation: `${pulse} 2s infinite` }} />} 
              sx={{ mb: 3, borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
            >
              You are offline. Please check your internet connection.
            </Alert>
          </Slide>

          {/* Welcome Header with Greeting */}
          <Grow in={true} timeout={800}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                <FloatingIcon delay="0s">
                  {weatherIcon}
                </FloatingIcon>
                <Typography variant="h3" sx={{ 
                  fontWeight: 'bold', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  {greeting}!
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ color: '#2c3e50', mb: 1, fontWeight: 500 }}>
                Welcome back, {tokenData?.name || 'Employee'} 👋
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#7f8c8d', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <CalendarToday fontSize="small" />
                {currentDate}
              </Typography>
            </Box>
          </Grow>

          {/* Time Card with Animation */}
          <Zoom in={true} timeout={600}>
            <TimeCard elevation={0}>
              <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
                <AccessTime sx={{ fontSize: 50, animation: `${rotate} 10s linear infinite` }} />
                <Typography variant="h3" sx={{ fontWeight: 'light', letterSpacing: 2 }}>
                  Current Time
                </Typography>
              </Box>
              <Typography variant="h1" sx={{ 
                fontWeight: 'bold', 
                fontSize: { xs: '3.5rem', md: '6rem' }, 
                mb: 2,
                fontFamily: 'monospace',
                letterSpacing: 5,
                textShadow: '0 0 20px rgba(0,0,0,0.3)'
              }}>
                {currentTime}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                {currentDate}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <NeonChip 
                  icon={<PlayArrow sx={{ fontSize: 16 }} />}
                  label={`Opens: 10:00 AM`}
                  size="medium"
                />
                <NeonChip 
                  icon={<Stop sx={{ fontSize: 16 }} />}
                  label={`Closes: 7:00 PM`}
                  size="medium"
                />
                <NeonChip 
                  icon={<Timer sx={{ fontSize: 16 }} />}
                  label={`Grace: 15 min`}
                  size="medium"
                />
              </Box>
            </TimeCard>
          </Zoom>

          {/* Stats Cards Grid */}
          <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
            <Grid item xs={12} md={3}>
              <Fade in={true} timeout={1000}>
                <StatsCard color="#4caf50" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          Today's Status
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: isCheckedIn ? (status === 'late' ? '#ff9800' : '#4caf50') : '#f44336' }}>
                          {isCheckedIn ? (status === 'late' ? 'Late' : 'Present') : 'Absent'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {isCheckedIn ? `In: ${checkInTime}` : 'Not marked yet'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ 
                        bgcolor: alpha(isCheckedIn ? (status === 'late' ? '#ff9800' : '#4caf50') : '#f44336', 0.2),
                        width: 70,
                        height: 70,
                        animation: isHovering ? `${pulse} 1s infinite` : 'none'
                      }}>
                        {isCheckedIn ? <CheckCircle sx={{ fontSize: 40, color: isCheckedIn ? (status === 'late' ? '#ff9800' : '#4caf50') : '#f44336' }} /> : <Cancel sx={{ fontSize: 40, color: '#f44336' }} />}
                      </Avatar>
                    </Box>
                  </CardContent>
                </StatsCard>
              </Fade>
            </Grid>

            <Grid item xs={12} md={3}>
              <Fade in={true} timeout={1200}>
                <StatsCard color="#3498db">
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          Working Hours
                        </Typography>
                        <Typography variant="h3" fontWeight="bold">
                          {workingHours.toFixed(1)} <span style={{ fontSize: '1rem' }}>hrs</span>
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Target: 9 hours
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha('#3498db', 0.2), width: 70, height: 70 }}>
                        <Timelapse sx={{ fontSize: 40, color: '#3498db' }} />
                      </Avatar>
                    </Box>
                    <GradientProgress variant="determinate" value={getProductivityPercentage()} sx={{ mt: 2 }} />
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      {getProductivityPercentage().toFixed(0)}% of daily goal
                    </Typography>
                  </CardContent>
                </StatsCard>
              </Fade>
            </Grid>

            <Grid item xs={12} md={3}>
              <Fade in={true} timeout={1400}>
                <StatsCard color="#ff9800">
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          Monthly Streak
                        </Typography>
                        <Typography variant="h3" fontWeight="bold">
                          {streakCount} <span style={{ fontSize: '1rem' }}>days</span>
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Keep it up! 🔥
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha('#ff9800', 0.2), width: 70, height: 70 }}>
                        <Bolt sx={{ fontSize: 40, color: '#ff9800' }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </StatsCard>
              </Fade>
            </Grid>

            <Grid item xs={12} md={3}>
              <Fade in={true} timeout={1600}>
                <StatsCard color="#9c27b0">
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                          Location Status
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: locationPermission ? '#4caf50' : '#f44336' }}>
                          {locationPermission === null ? '?' : locationPermission ? 'Active' : 'Off'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {locationPermission ? 'GPS verified' : 'Please enable'}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: alpha(locationPermission ? '#4caf50' : '#f44336', 0.2), width: 70, height: 70 }}>
                        <LocationOn sx={{ fontSize: 40, color: locationPermission ? '#4caf50' : '#f44336' }} />
                      </Avatar>
                    </Box>
                  </CardContent>
                </StatsCard>
              </Fade>
            </Grid>
          </Grid>

          {/* Motivational Banner */}
          {!isCheckedOut && (
            <Grow in={true} timeout={1000}>
              <Alert 
                severity={isCheckedIn ? "info" : "warning"}
                sx={{ 
                  mb: 3, 
                  borderRadius: '20px', 
                  fontSize: '16px',
                  background: `linear-gradient(135deg, ${alpha('#667eea', 0.1)} 0%, ${alpha('#764ba2', 0.1)} 100%)`,
                  border: '1px solid #667eea40'
                }}
                icon={isCheckedIn ? <RocketLaunch /> : <Coffee />}
              >
                <strong>{getMotivationalMessage()}</strong>
                {isCheckedIn && !isCheckedOut && (
                  <Box mt={1}>
                    <Typography variant="body2">
                      Checked in at {checkInTime}
                      {status === 'late' && ' ⚠️ You were late today'}
                    </Typography>
                  </Box>
                )}
              </Alert>
            </Grow>
          )}

          {/* Action Buttons with Enhanced Design */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={800}>
                <GradientCard gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <FloatingIcon sx={{ width: 100, height: 100, margin: '0 auto 20px' }} delay="0s">
                      <PlayArrow sx={{ fontSize: 50 }} />
                    </FloatingIcon>
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                      Check In
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                      Start your workday
                    </Typography>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip label="10:00 AM Start" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label="10:15 AM Grace" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                    </Box>
                    <AnimatedButton
                      fullWidth
                      variant="contained"
                      disabled={locationLoading || isCheckedIn || !connectionStatus}
                      onClick={handleCheckInClick}
                      gradient="linear-gradient(135deg, #fff 0%, #f0f0f0 100%)"
                      sx={{ color: '#667eea', fontWeight: 'bold' }}
                    >
                      {locationLoading ? <CircularProgress size={24} color="inherit" /> : '📍 Check In Now'}
                    </AnimatedButton>
                    {isCheckedIn && !checkOutTime && (
                      <Typography variant="caption" sx={{ mt: 2, display: 'block', opacity: 0.9 }}>
                        ✅ Checked in at {checkInTime}
                        {status === 'late' && <Chip label="Late" size="small" sx={{ ml: 1, bgcolor: '#ff9800', color: 'white' }} />}
                      </Typography>
                    )}
                  </CardContent>
                </GradientCard>
              </Zoom>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={true} timeout={1000}>
                <GradientCard gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <FloatingIcon sx={{ width: 100, height: 100, margin: '0 auto 20px' }} delay="0.5s">
                      <Stop sx={{ fontSize: 50 }} />
                    </FloatingIcon>
                    <Typography variant="h3" gutterBottom fontWeight="bold">
                      Check Out
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, opacity: 0.9 }}>
                      Complete your workday
                    </Typography>
                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                      <Chip label="7:00 PM End" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                      <Chip label="9 Hours Goal" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                    </Box>
                    <AnimatedButton
                      fullWidth
                      variant="contained"
                      disabled={locationLoading || !isCheckedIn || isCheckedOut || !connectionStatus}
                      onClick={handleCheckOutClick}
                      gradient="linear-gradient(135deg, #fff 0%, #f0f0f0 100%)"
                      sx={{ color: '#f5576c', fontWeight: 'bold' }}
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

          {/* Monthly Statistics Section */}
          <Fade in={true} timeout={1800}>
            <Paper sx={{ mt: 6, p: 3, borderRadius: '28px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsOutlined sx={{ color: '#667eea' }} />
                Monthly Performance
              </Typography>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="#4caf50">
                      {monthlyStats.present}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Present Days</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="#f44336">
                      {monthlyStats.absent}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Absent Days</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="#ff9800">
                      {monthlyStats.late}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">Late Arrivals</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Fade>

          {/* Security Notice */}
          <Fade in={true} timeout={2000}>
            <Paper sx={{ mt: 4, p: 2, bgcolor: alpha('#667eea', 0.1), borderRadius: '20px' }}>
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Shield sx={{ color: '#667eea', fontSize: 30 }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>🔒 Secure Location-Based Attendance</strong><br />
                  Your location is verified in real-time. Attendance can only be marked within 100 meters of office premises.
                </Typography>
                <VerifiedUser sx={{ color: '#4caf50', ml: 'auto' }} />
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      {/* Warning Dialog */}
      <Dialog open={showTimeWarning} onClose={() => setShowTimeWarning(false)} PaperProps={{ sx: { borderRadius: '24px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff3e0' }}>
          <Warning sx={{ color: '#ff9800', animation: `${pulse} 1s infinite` }} />
          Late Check-in Warning
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            You are checking in after 10:15 AM. This will be marked as <strong style={{ color: '#ff9800' }}>LATE</strong>.
            <br /><br />
            Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowTimeWarning(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleProceedWithWarning} variant="contained" color="warning">
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;