import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Fade,
  Grow,
  InputAdornment,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import {
  Business,
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  Badge,
  Fingerprint,
  AdminPanelSettings,
  Person
} from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.password) {
      toast.error('Please enter Employee ID and Password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3500/api/auth/login', formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Decode token to get role (optional - for verification)
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        
        toast.success(`Welcome ${user.name}! Redirecting...`, {
          duration: 2000,
          icon: '🎉',
        });
        
        // Role-based navigation
        setTimeout(() => {
          if (user.role === 'Admin' || user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (user.role === 'Manager' || user.role === 'manager') {
            navigate('/manager-dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 2000);
      } else {
        toast.error(response.data.message || 'Login failed');
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="sm">
          <Grow in={true} timeout={800}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: '30px',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '40px 30px',
                  textAlign: 'center',
                  color: 'white',
                }}
              >
                <Business sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Attendance System
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                  Secure Employee Portal
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label="Version 2.0"
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Box>
              </Box>

              {/* Login Form */}
              <Box sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold', color: '#2c3e50' }}>
                  Employee Login
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                  Enter your credentials to access the dashboard
                </Typography>

                {error && (
                  <Fade in={true}>
                    <Alert
                      severity="error"
                      sx={{ mb: 3, borderRadius: '15px' }}
                      onClose={() => setError('')}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Employee ID"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Badge sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '15px',
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Fingerprint sx={{ color: '#667eea' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleTogglePassword} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '15px',
                        '&:hover fieldset': {
                          borderColor: '#667eea',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#667eea',
                        },
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      borderRadius: '50px',
                      padding: '12px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 5px 20px rgba(102, 126, 234, 0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                  </Button>

                  <Divider sx={{ my: 3 }}>
                    <Chip label="Secure Login" size="small" />
                  </Divider>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary">
                      <Fingerprint sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.5 }} />
                      Location verification enabled for attendance
                    </Typography>
                  </Box>
                </form>
              </Box>
            </Paper>
          </Grow>
        </Container>
      </Box>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '15px',
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

export default Login;