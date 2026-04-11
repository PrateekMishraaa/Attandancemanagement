import api from './api';

// Store user data with role information
export const login = async (employeeId, password) => {
  try {
    const response = await api.post('/auth/login', { employeeId, password });
    if (response.data.success) {
      const { token, ...userData } = response.data.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Store complete user data with role
      localStorage.setItem('user', JSON.stringify({
        id: userData.id || userData._id,
        employeeId: userData.employeeId,
        name: userData.name,
        email: userData.email,
        role: userData.role || userData.userRole || 'employee', // Ensure role exists
        department: userData.department,
        designation: userData.designation,
        permissions: userData.permissions || getDefaultPermissions(userData.role),
        ...userData
      }));
      
      // Store token expiry info
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('tokenExpiry', tokenData.exp * 1000);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
      
      return { success: true, data: userData };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Login failed' 
    };
  }
};

// Get default permissions based on role
const getDefaultPermissions = (role) => {
  const permissions = {
    'admin': [
      'view_all_users',
      'edit_all_users',
      'delete_users',
      'view_all_attendance',
      'edit_attendance',
      'view_reports',
      'export_data',
      'manage_leaves',
      'approve_leaves',
      'reject_leaves',
      'manage_departments',
      'manage_settings'
    ],
    'manager': [
      'view_team_members',
      'edit_team_members',
      'view_team_attendance',
      'approve_team_leaves',
      'reject_team_leaves',
      'view_team_reports',
      'manage_team_schedule'
    ],
    'employee': [
      'view_own_profile',
      'edit_own_profile',
      'view_own_attendance',
      'apply_leave',
      'view_own_leaves',
      'view_own_reports'
    ]
  };
  
  return permissions[role] || permissions.employee;
};

// Enhanced logout with cleanup
export const logout = () => {
  // Clear all auth-related data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('tokenExpiry');
  localStorage.removeItem('permissions');
  
  // Optional: Call logout API to invalidate token
  // api.post('/auth/logout').catch(err => console.error('Logout API error:', err));
  
  // Redirect to login
  window.location.href = '/login';
};

// Get current user with full data
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    const userData = JSON.parse(user);
    
    // Check if user data has required fields
    if (!userData.role) {
      userData.role = 'employee';
    }
    
    return userData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

// Get user ID
export const getUserId = () => {
  const user = getCurrentUser();
  return user?.id || user?.employeeId || null;
};

// Check if user is authenticated with token validation
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  
  if (!token) return false;
  
  // Check if token is expired
  if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
    logout(); // Auto logout on token expiry
    return false;
  }
  
  return true;
};

// Check if user has specific role
export const hasRole = (allowedRoles) => {
  const userRole = getUserRole();
  if (!userRole) return false;
  
  // Handle single role string or array of roles
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(userRole);
};

// Check if user has specific permission
export const hasPermission = (permission) => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  const permissions = user.permissions || getDefaultPermissions(user.role);
  return permissions.includes(permission);
};

// Check if user has all required permissions
export const hasPermissions = (permissions) => {
  return permissions.every(permission => hasPermission(permission));
};

// Get user permissions
export const getUserPermissions = () => {
  const user = getCurrentUser();
  if (!user) return [];
  
  if (user.role === 'admin') {
    return getDefaultPermissions('admin');
  }
  
  return user.permissions || getDefaultPermissions(user.role);
};

// Update user data in localStorage (after profile update)
export const updateCurrentUser = (updatedData) => {
  try {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  } catch (error) {
    console.error('Error updating user data:', error);
  }
  return null;
};

// Check token validity with backend (optional)
export const verifyToken = async () => {
  if (!isAuthenticated()) return false;
  
  try {
    const response = await api.get('/auth/verify');
    return response.data.success;
  } catch (error) {
    if (error.response?.status === 401) {
      logout();
    }
    return false;
  }
};

// Role-based redirect helper
export const getDashboardRoute = () => {
  const role = getUserRole();
  
  switch(role) {
    case 'admin':
      return '/admin/dashboard';
    case 'manager':
      return '/manager/dashboard';
    case 'employee':
      return '/dashboard';
    default:
      return '/login';
  }
};

// Get user display name with role
export const getUserDisplayInfo = () => {
  const user = getCurrentUser();
  if (!user) return { name: 'Guest', role: 'guest' };
  
  const roleLabels = {
    'admin': 'Administrator',
    'manager': 'Team Manager',
    'employee': 'Employee'
  };
  
  return {
    name: user.name || user.employeeId || 'User',
    role: user.role,
    roleLabel: roleLabels[user.role] || 'Employee',
    email: user.email,
    department: user.department,
    designation: user.designation
  };
};