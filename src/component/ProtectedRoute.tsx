import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUserRole } from '../utils/auth.utils';
import { routePermissions } from '../config/routes.config';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = isAuthenticated();
  const currentRole = getCurrentUserRole();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRoute = routePermissions.find(route => {
    return location.pathname.startsWith(route.path);
  });

  if (!currentRoute) {
    return <Navigate to="/login" replace />;
  }
  if (currentRole && !currentRoute.allowedRoles.includes(currentRole)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;