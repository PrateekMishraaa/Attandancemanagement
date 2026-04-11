import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole, hasPermission, getCurrentUser } from '../../services/auth';

const PrivateRoute = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [],
  redirectTo = '/login',
  exactRole = false 
}) => {
  const authenticated = isAuthenticated();
  const userRole = getUserRole();
  const currentUser = getCurrentUser();

  // Not authenticated - redirect to login
  if (!authenticated) {
    return <Navigate to={redirectTo} />;
  }

  // Check role-based access
  const hasRequiredRole = () => {
    if (allowedRoles.length === 0) return true;
    
    if (exactRole) {
      return allowedRoles.includes(userRole);
    }
    
    // Role hierarchy (admin can access everything, manager can access employee routes)
    const roleHierarchy = {
      'admin': 3,
      'manager': 2,
      'employee': 1,
      'hr': 2,
      'supervisor': 2
    };
    
    const userRoleLevel = roleHierarchy[userRole] || 0;
    const highestRequiredLevel = Math.max(...allowedRoles.map(role => roleHierarchy[role] || 0));
    
    return userRoleLevel >= highestRequiredLevel;
  };

  // Check permission-based access
  const hasRequiredPermissions = () => {
    if (requiredPermissions.length === 0) return true;
    return requiredPermissions.every(permission => hasPermission(permission));
  };

  // Role check failed
  if (!hasRequiredRole()) {
    // Redirect to appropriate dashboard based on role
    switch(userRole) {
      case 'Admin':
        return <Navigate to="/admin/dashboard" />;
      case 'manager':
        return <Navigate to="/manager/dashboard" />;
      case 'hr':
        return <Navigate to="/hr/dashboard" />;
      case 'Employee':
        return <Navigate to="/dashboard" />;
      default:
        return <Navigate to="/unauthorized" />;
    }
  }

  // Permission check failed
  if (!hasRequiredPermissions()) {
    return <Navigate to="/unauthorized" />;
  }

  // Authorized - render children
  return children;
};

// HOC to wrap components with role protection
export const withRoleProtection = (Component, allowedRoles = [], requiredPermissions = []) => {
  return (props) => (
    <PrivateRoute allowedRoles={allowedRoles} requiredPermissions={requiredPermissions}>
      <Component {...props} />
    </PrivateRoute>
  );
};

// Component for conditional rendering based on role
export const RoleBasedComponent = ({ children, allowedRoles = [], fallback = null }) => {
  const userRole = getUserRole();
  const hasAccess = allowedRoles.length === 0 || allowedRoles.includes(userRole);
  return hasAccess ? children : fallback;
};

// Component for conditional rendering based on permission
export const PermissionBasedComponent = ({ children, requiredPermissions = [], fallback = null }) => {
  const hasAccess = requiredPermissions.length === 0 || requiredPermissions.every(p => hasPermission(p));
  return hasAccess ? children : fallback;
};

export default PrivateRoute;