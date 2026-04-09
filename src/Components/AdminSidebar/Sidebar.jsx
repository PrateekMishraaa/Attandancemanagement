import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as AttendanceIcon,
  CalendarToday as LeaveIcon,
  Business as DepartmentIcon,
  Schedule as ShiftIcon,
  Settings as SettingsIcon,
  Assessment as ReportsIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings as AdminIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerificationIcon,
  History as HistoryIcon,
  BackupTable as BackupIcon,
  Security as SecurityIcon,
  Menu as MenuIcon,
  CalendarToday,
  Assessment,
} from '@mui/icons-material';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openSubMenus, setOpenSubMenus] = React.useState({
    userManagement: false,
    attendance: false,
    reports: false,
    systemSettings: false,
  });

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubMenuToggle = (menu) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 900) {
      setMobileOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Main navigation items
  const mainNavItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin/dashboard',
      exact: true,
    },
    
    {
      text: 'Attendance',
      icon: <AttendanceIcon />,
      subItems: [
        // { text: 'L', path: '/admin/attendance/live', icon: <LocationIcon /> },
        { text: "Today's Attendance", path: '/admin/dashboard/todays-attandance', icon: <AttendanceIcon /> },
        { text: 'Monthly Attandance', path: '/admin/monthly-attandance', icon: <VerificationIcon /> },
        { text: 'Attendance History', path: '/admin/attendance/history', icon: <HistoryIcon /> },
      ],
    },
    {
      text: 'Leave Management',
      icon: <LeaveIcon />,
      path: '/admin/leaves',
    },
    {
      text: 'Shift Management',
      icon: <ShiftIcon />,
      path: '/admin/shifts',
    },
    {
      text: 'Reports & Analytics',
      icon: <ReportsIcon />,
      subItems: [
        { text: 'Attendance Report', path: '/admin/reports/attendance', icon: <Assessment /> },
        { text: 'Leave Report', path: '/admin/reports/leaves', icon: <LeaveIcon /> },
        { text: 'Employee Report', path: '/admin/reports/employees', icon: <PeopleIcon /> },
        { text: 'Custom Reports', path: '/admin/reports/custom', icon: <ReportsIcon /> },
      ],
    },
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    {
      text: 'System Settings',
      icon: <SettingsIcon />,
      subItems: [
        { text: 'General Settings', path: '/admin/settings/general', icon: <SettingsIcon /> },
        { text: 'Holiday Calendar', path: '/admin/settings/holidays', icon: <CalendarToday /> },
        { text: 'Location Settings', path: '/admin/settings/locations', icon: <LocationIcon /> },
        { text: 'Backup & Restore', path: '/admin/settings/backup', icon: <BackupIcon /> },
        { text: 'Audit Logs', path: '/admin/audit-logs', icon: <SecurityIcon /> },
      ],
    },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: 'linear-gradient(135deg, #1a472a 0%, #0d2818 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 70,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            sx={{
              bgcolor: '#2e7d32',
              width: 40,
              height: 40,
              boxShadow: '0 0 15px rgba(46, 125, 50, 0.5)',
            }}
          >
            <AdminIcon />
          </Avatar>
          {open && (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                WorkSync
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Admin Portal
              </Typography>
            </Box>
          )}
        </Box>
        {!open && (
          <IconButton onClick={handleDrawerOpen} sx={{ color: 'white' }}>
            <MenuIcon />
          </IconButton>
        )}
        {open && window.innerWidth < 900 && (
          <IconButton onClick={handleDrawerClose} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Box>

      {/* User Profile Section */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          // bgcolor: 'background.paper',
        }}
      >
        <Avatar
          sx={{
            width: open ? 80 : 50,
            height: open ? 80 : 50,
            mx: 'auto',
            mb: 1,
            bgcolor: '#2e7d32',
            fontSize: open ? 32 : 20,
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
        </Avatar>
        
        {open && (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {user?.name || 'Admin User'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
              <AdminIcon sx={{ fontSize: 14, color: '#2e7d32' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {user?.role || 'Administrator'}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
              ID: {user?.employeeId || 'EMP0004'}
            </Typography>
          </>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List disablePadding>
          {mainNavItems.map((item) => (
            <React.Fragment key={item.text}>
              {item.subItems ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSubMenuToggle(
                        // item.text === 'User Management' ? 'userManagement' :
                        item.text === 'Attendance' ? 'attendance' : 'reports'
                      )}
                      sx={{
                        px: open ? 2 : 1.5,
                        justifyContent: open ? 'initial' : 'center',
                        '&:hover': {
                          backgroundColor: 'rgba(46, 125, 50, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : 'auto',
                          justifyContent: 'center',
                          color: '#6b7280',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      {open && (
                        <>
                          <ListItemText primary={item.text} />
                          {openSubMenus[
                            // item.text === 'User Management' ? 'userManagement' :
                            item.text === 'Attendance' ? 'attendance' : 'reports'
                          ] ? <ExpandLess /> : <ExpandMore />}
                        </>
                      )}
                    </ListItemButton>
                  </ListItem>
                  {open && (
                    <Collapse in={openSubMenus[
                      // item.text === 'User Management' ? 'userManagement' :
                      item.text === 'Attendance' ? 'attendance' : 'reports'
                    ]} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.subItems.map((subItem) => (
                          <ListItemButton
                            key={subItem.text}
                            onClick={() => handleNavigation(subItem.path)}
                            sx={{
                              pl: 4,
                              backgroundColor: isActive(subItem.path) ? 'rgba(46, 125, 50, 0.12)' : 'transparent',
                              borderRight: isActive(subItem.path) ? '3px solid #2e7d32' : 'none',
                              '&:hover': {
                                backgroundColor: 'rgba(46, 125, 50, 0.08)',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36, color: isActive(subItem.path) ? '#2e7d32' : '#6b7280' }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontSize: '0.9rem',
                                fontWeight: isActive(subItem.path) ? 'bold' : 'normal',
                                color: isActive(subItem.path) ? '#2e7d32' : 'inherit',
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      px: open ? 2 : 1.5,
                      justifyContent: open ? 'initial' : 'center',
                      backgroundColor: isActive(item.path) ? 'rgba(46, 125, 50, 0.12)' : 'transparent',
                      borderRight: isActive(item.path) ? '3px solid #2e7d32' : 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(46, 125, 50, 0.08)',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 'auto',
                        justifyContent: 'center',
                        color: isActive(item.path) ? '#2e7d32' : '#6b7280',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontWeight: isActive(item.path) ? 'bold' : 'normal',
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* System Section */}
        {open && (
          <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontSize: '0.7rem' }}>
            SYSTEM
          </Typography>
        )}
        
        <List disablePadding>
          {secondaryNavItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSubMenuToggle('systemSettings')}
                  sx={{
                    px: open ? 2 : 1.5,
                    justifyContent: open ? 'initial' : 'center',
                    '&:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 'auto',
                      justifyContent: 'center',
                      color: '#6b7280',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <>
                      <ListItemText primary={item.text} />
                      {openSubMenus.systemSettings ? <ExpandLess /> : <ExpandMore />}
                    </>
                  )}
                </ListItemButton>
              </ListItem>
              {open && (
                <Collapse in={openSubMenus.systemSettings} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItemButton
                        key={subItem.text}
                        onClick={() => handleNavigation(subItem.path)}
                        sx={{
                          pl: 4,
                          backgroundColor: isActive(subItem.path) ? 'rgba(46, 125, 50, 0.12)' : 'transparent',
                          borderRight: isActive(subItem.path) ? '3px solid #2e7d32' : 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(46, 125, 50, 0.08)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36, color: isActive(subItem.path) ? '#2e7d32' : '#6b7280' }}>
                          {subItem.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={subItem.text}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: isActive(subItem.path) ? 'bold' : 'normal',
                            color: isActive(subItem.path) ? '#2e7d32' : 'inherit',
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Tooltip title={!open ? "Logout" : ""} placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              justifyContent: open ? 'initial' : 'center',
              px: open ? 2 : 1.5,
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.08)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                color: '#f44336',
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {open && (
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{ sx: { color: '#f44336', fontWeight: 500 } }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            // bgcolor: 'background.default',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? 280 : 80,
          flexShrink: 0,
          display: { xs: 'none', sm: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: open ? 280 : 80,
            boxSizing: 'border-box',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            // bgcolor: 'background.default', 
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        variant="permanent"
        open={open}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}