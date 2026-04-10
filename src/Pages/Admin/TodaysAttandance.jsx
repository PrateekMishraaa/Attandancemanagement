import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventNote as AttendanceIcon,
  Assignment as LeaveIcon,
  SwapHoriz as ShiftIcon,
  People as EmployeesIcon,
  TrendingUp as AnalyticsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AccessTime as LateIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  ChevronRight as ArrowIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../Components/AdminSidebar/Sidebar.jsx"

const drawerWidth = 280;

// Styled Components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
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

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '20px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
  },
}));

const StatCard = ({ title, value, icon, color, change }) => (
  <StyledCard>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {change && (
            <Typography variant="caption" color={change > 0 ? 'success.main' : 'error.main'}>
              {change > 0 ? `+${change}%` : `${change}%`} from last month
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </StyledCard>
);

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lateEmployees, setLateEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0,
    attendanceRate: 0
  });
  const navigate = useNavigate();

  const API_BASE_URL = 'https://attendancemanagementbackend-gg9v.onrender.com/api';

  useEffect(() => {
    fetchTodayLateEmployees();
    fetchDashboardStats();
  }, []);

  const getAuthHeaders = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });

  const fetchTodayLateEmployees = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/attendance/today/late`, getAuthHeaders());
      if (response.data.success) {
        setLateEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching late employees:', error);
    }
  };

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch today's attendance summary
      const response = await axios.get(`${API_BASE_URL}/attendance/today/summary`, getAuthHeaders());
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
    { text: 'Attendance', icon: <AttendanceIcon />, path: '/admin/attendance' },
    { text: 'Leave Management', icon: <LeaveIcon />, path: '/admin/leaves' },
    { text: 'Shift Management', icon: <ShiftIcon />, path: '/admin/shifts' },
    { text: 'Employees', icon: <EmployeesIcon />, path: '/admin/employees' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
          // color: '#1a1a2e',
          // boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
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
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Welcome back! Here's what's happening with your workforce today.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees || 45}
              icon={<EmployeesIcon />}
              color="#667eea"
              change={5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Present Today"
              value={stats.presentToday || 38}
              icon={<PresentIcon />}
              color="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Late Today"
              value={stats.lateToday || lateEmployees.length}
              icon={<LateIcon />}
              color="#ff9800"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Absent Today"
              value={stats.absentToday || 7}
              icon={<AbsentIcon />}
              color="#f44336"
            />
          </Grid>
        </Grid>

        {/* Today's Late Arrivals Table */}
        <Paper sx={{ p: 3, borderRadius: '20px', mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Today's Late Arrivals ⏰
            </Typography>
            <Chip
              label={`${lateEmployees.length} Late Today`}
              color="warning"
              sx={{ fontWeight: 'bold' }}
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
                  <TableRow sx={{  }}>
                    <TableCell><strong>Employee ID</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell><strong>Department</strong></TableCell>
                    <TableCell><strong>Check In Time</strong></TableCell>
                    <TableCell><strong>Late By</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
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
                          sx={{ bgcolor: alpha('#667eea', 0.1), color: '#667eea' }}
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
                          color="warning"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Late"
                          size="small"
                          color="error"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StyledCard>
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
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
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
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <StyledCard>
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
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>
      </Main>
    </Box>
  );
};

export default AdminDashboard;