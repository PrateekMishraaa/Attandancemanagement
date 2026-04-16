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
  const [totalEmp, setTotalEmp] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [lateEmployeesLoading, setLateEmployeesLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    absentToday: 0,
    attendanceRate: 0
  });
  const navigate = useNavigate();

  // FIXED: Remove duplicate /api/api
  const API_BASE_URL = 'https://attendancemanagementbackend-oqfl.onrender.com/api';

  // Define getAuthHeaders with useCallback
  const getAuthHeaders = useCallback(() => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  }), []);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    try {
      setEmployeesLoading(true);
      const response = await axios.get(`${API_BASE_URL}/admin/employees`, getAuthHeaders());
      console.log('Employees response:', response.data);
      
      let employeesData = [];
      if (Array.isArray(response.data)) {
        employeesData = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        employeesData = response.data.data;
      } else if (response.data.employees && Array.isArray(response.data.employees)) {
        employeesData = response.data.employees;
      } else if (response.data.success && response.data.data) {
        employeesData = response.data.data;
      }
      
      setTotalEmp(employeesData);
      
      // Update total employees count in stats
      setStats(prev => ({
        ...prev,
        totalEmployees: employeesData.length
      }));
      
      console.log('Total employees count:', employeesData.length);
      
    } catch (error) {
      console.error('Error fetching employees:', error);
      console.error('Error details:', error.response?.data);
      setTotalEmp([]);
    } finally {
      setEmployeesLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders]);

  // Fetch today's late employees
  const fetchTodayLateEmployees = useCallback(async () => {
    try {
      setLateEmployeesLoading(true);
      const response = await axios.get(`${API_BASE_URL}/attendance/today/late`, getAuthHeaders());
      console.log('Late employees response:', response.data);
      
      if (response.data.success) {
        const lateData = response.data.data || [];
        setLateEmployees(lateData);
        
        // Update late count in stats
        setStats(prev => ({
          ...prev,
          lateToday: lateData.length
        }));
      } else {
        console.error('API returned error:', response.data.message);
        setLateEmployees([]);
      }
    } catch (error) {
      console.error('Error fetching late employees:', error);
      console.error('Error details:', error.response?.data);
      setLateEmployees([]);
    } finally {
      setLateEmployeesLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders]);

  // Fetch dashboard stats (present, absent, attendance rate)
  const fetchDashboardStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/attendance/today/summary`, getAuthHeaders());
      console.log('Dashboard stats response:', response.data);
      
      if (response.data.success && response.data.data) {
        setStats(prev => ({
          ...prev,
          presentToday: response.data.data.presentToday || 0,
          absentToday: response.data.data.absentToday || 0,
          attendanceRate: response.data.data.attendanceRate || 0,
          totalEmployees: prev.totalEmployees || response.data.data.totalEmployees || 0
        }));
        console.log('Stats updated:', stats);
      } else {
        console.error('Invalid response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setStatsLoading(false);
    }
  }, [API_BASE_URL, getAuthHeaders]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    console.log('Fetching all data...');
    await Promise.all([
      fetchEmployees(),
      fetchTodayLateEmployees(),
      fetchDashboardStats()
    ]);
    console.log('All data fetched');
  }, [fetchEmployees, fetchTodayLateEmployees, fetchDashboardStats]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Sidebar/>
  );

  // Calculate percentage for display
  const presentPercentage = stats.totalEmployees > 0 
    ? ((stats.presentToday / stats.totalEmployees) * 100).toFixed(1) 
    : 0;
    
  const absentPercentage = stats.totalEmployees > 0 
    ? ((stats.absentToday / stats.totalEmployees) * 100).toFixed(1) 
    : 0;

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
                      {employeesLoading ? <CircularProgress size={30} /> : stats.totalEmployees}
                    </Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <ArrowUpIcon sx={{ fontSize: 16, color: '#4caf50' }} />
                      <Typography variant="caption" color="success.main" sx={{ ml: 0.5 }}>
                        Active employees
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
                      {statsLoading ? <CircularProgress size={30} /> : stats.presentToday}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {presentPercentage}% of total
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
                      {lateEmployeesLoading ? <CircularProgress size={30} /> : stats.lateToday}
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
                      {statsLoading ? <CircularProgress size={30} /> : stats.absentToday}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {absentPercentage}% absent
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

          {lateEmployeesLoading ? (
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
                    <TableRow key={employee._id || index} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {employee.employeeId || employee.employee_id || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>{employee.name || employee.employeeName || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip
                          label={employee.department || 'N/A'}
                          size="small"
                          sx={{ bgcolor: '#e8eaf6', color: '#667eea', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <LateIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                          {employee.checkInTime || employee.check_in_time || employee.time || 'N/A'}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${employee.lateByMinutes || employee.late_minutes || 0} minutes`}
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
                  View and manage leave requests
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