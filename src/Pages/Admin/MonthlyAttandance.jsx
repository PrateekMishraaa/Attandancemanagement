import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  alpha,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  EventNote as AttendanceIcon,
  Assignment as LeaveIcon,
  SwapHoriz as ShiftIcon,
  People as EmployeesIcon,
  AccessTime as LateIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  ArrowUpward as ArrowUpIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../Components/AdminSidebar/Sidebar.jsx";

const drawerWidth = 280;

// Styled Components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: '#1a1a2e',
    color: 'white',
    borderRight: 'none',
  },
}));

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  width: `calc(100% - ${drawerWidth}px)`,
  minHeight: '100vh',
  background: '#f5f7fa',
}));

const StatCard = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
}));

const MonthlyAttandance = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lateEmployees, setLateEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 45,
    presentToday: 38,
    lateToday: 3,
    absentToday: 7,
    attendanceRate: 84.4
  });
  const navigate = useNavigate();

  const API_BASE_URL = 'https://attendancemanagementbackend-oqfl.onrender.com/api';

  // Define getAuthHeaders with useCallback to prevent recreation on every render
  const getAuthHeaders = useCallback(() => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  }), []);

  // Define fetchTodayLateEmployees with useCallback
  const fetchTodayLateEmployees = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attendance/today/late`, getAuthHeaders());
      if (response.data.success) {
        setLateEmployees(response.data.data);
        setStats(prev => ({ ...prev, lateToday: response.data.data.length }));
      }
    } catch (error) {
      console.error('Error fetching late employees:', error);
      // Demo data for display
      setLateEmployees([
        { employeeId: 'EMP001', name: 'Parait Kumar', department: 'IT', checkInTime: '10:30:00', lateByMinutes: 15 },
        { employeeId: 'EMP0000', name: 'Prateek', department: 'IT', checkInTime: '10:16:24', lateByMinutes: 1 },
        { employeeId: 'EMP0004', name: 'Pratyush', department: 'IT', checkInTime: '14:01:50', lateByMinutes: 226 }
      ]);
    }
  }, [API_BASE_URL, getAuthHeaders]);

  // Define fetchDashboardStats with useCallback
  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/attendance/today/summary`, getAuthHeaders());
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders]);

  // useEffect with proper dependencies
  useEffect(() => {
    fetchTodayLateEmployees();
    fetchDashboardStats();
  }, [fetchTodayLateEmployees, fetchDashboardStats]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Sidebar/>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar for Mobile */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'white',
          color: '#1a1a2e',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          display: { xs: 'block', sm: 'none' }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            WorkSync Admin
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' } }}
        >
          {drawer}
        </StyledDrawer>
        <StyledDrawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' } }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>

      {/* Main Content */}
      <Main>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#2c3e50' }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back! Here's what's happening with your workforce today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Employees Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Total Employees
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#667eea' }}>
                      {stats.totalEmployees}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <ArrowUpIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                        +5% from last month
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#667eea', 0.1), color: '#667eea' }}>
                    <EmployeesIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Present Today Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Present Today
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#4caf50' }}>
                      {stats.presentToday}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)}% of total
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#4caf50' }}>
                    <PresentIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Late Today Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Late Today
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#ff9800' }}>
                      {stats.lateToday}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Need attention
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#ff9800', 0.1), color: '#ff9800' }}>
                    <LateIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>

          {/* Absent Today Card */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Absent Today
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#f44336' }}>
                      {stats.absentToday}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {((stats.absentToday / stats.totalEmployees) * 100).toFixed(1)}% absent
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: alpha('#f44336', 0.1), color: '#f44336' }}>
                    <AbsentIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>

        {/* Today's Late Arrivals Table */}
        <Paper sx={{ p: 3, borderRadius: '20px' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#2c3e50' }}>
              Today's Late Arrivals ⏰
            </Typography>
            <Chip
              label={`${stats.lateToday} Late Today`}
              sx={{
                bgcolor: '#ff9800',
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-label': { px: 2 }
              }}
            />
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : lateEmployees.length === 0 ? (
            <Alert severity="success" sx={{ borderRadius: '15px' }}>
              🎉 Excellent! No employees are late today!
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Employee ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Check In Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Late By</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lateEmployees.map((employee, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {employee.employeeId}
                        </Typography>
                      </TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>
                        <Chip
                          label={employee.department}
                          size="small"
                          sx={{ bgcolor: '#e8eaf6', color: '#667eea', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LateIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                          {employee.checkInTime}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${employee.lateByMinutes} minutes`}
                          size="small"
                          sx={{ bgcolor: '#fff3e0', color: '#ff9800', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Late"
                          size="small"
                          sx={{ bgcolor: '#ffebee', color: '#f44336', fontWeight: 600 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Quick Actions Section */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <StatCard>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: alpha('#667eea', 0.1), color: '#667eea' }}>
                    <AttendanceIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Attendance Overview
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  View complete attendance report for all employees
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: '10px', borderColor: '#667eea', color: '#667eea' }}
                  onClick={() => navigate('/admin/attendance')}
                >
                  View Details
                </Button>
              </CardContent>
            </StatCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: alpha('#4caf50', 0.1), color: '#4caf50' }}>
                    <LeaveIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Leave Requests
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  3 pending leave requests awaiting approval
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: '10px', borderColor: '#4caf50', color: '#4caf50' }}
                  onClick={() => navigate('/admin/leaves')}
                >
                  Manage Requests
                </Button>
              </CardContent>
            </StatCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: alpha('#ff9800', 0.1), color: '#ff9800' }}>
                    <ShiftIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    Shift Management
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Manage employee shifts and schedules
                </Typography>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: '10px', borderColor: '#ff9800', color: '#ff9800' }}
                  onClick={() => navigate('/admin/shifts')}
                >
                  Configure Shifts
                </Button>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>
      </Main>
    </Box>
  );
};

export default MonthlyAttandance;