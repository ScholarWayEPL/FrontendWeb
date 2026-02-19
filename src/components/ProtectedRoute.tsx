import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('super_admin' | 'admin_etablissement' | 'bachelier')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier si l'utilisateur a le rôle autorisé (si des rôles sont spécifiés)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Rediriger vers la page appropriée selon le rôle
    if (user.role === 'admin_etablissement') {
      return <Navigate to="/etablissement/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Redirection automatique pour admin_etablissement qui accède à la racine
  if (user?.role === 'admin_etablissement' && (location.pathname === '/' || location.pathname === '/dashboard')) {
    return <Navigate to="/etablissement/dashboard" replace />;
  }

  // Redirection automatique pour super_admin qui accède aux routes admin établissement (pas /etablissements)
  if (user?.role === 'super_admin' && location.pathname.startsWith('/etablissement/')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Redirection automatique pour admin_etablissement qui accède aux routes super admin
  if (user?.role === 'admin_etablissement' && !location.pathname.startsWith('/etablissement') && location.pathname !== '/parametres') {
    return <Navigate to="/etablissement/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
