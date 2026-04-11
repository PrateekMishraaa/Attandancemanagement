// src/components/Common/RoleBasedNavigation.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, isAuthenticated, getDashboardRoute } from '../../services/auth';

const RoleBasedNavigation = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const userRole = getUserRole();

  useEffect(() => {
    if (authenticated && userRole) {
      // Get the correct dashboard route based on role
      const dashboardRoute = getDashboardRoute();
      navigate(dashboardRoute, { replace: true });
    } else if (!authenticated) {
      navigate('/login', { replace: true });
    }
  }, [authenticated, userRole, navigate]);

  return null; // This component doesn't render anything
};

export default RoleBasedNavigation;