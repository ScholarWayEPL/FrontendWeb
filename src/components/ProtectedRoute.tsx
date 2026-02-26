import React from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type { RoleUtilisateur } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: RoleUtilisateur[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Si non authentifié, rediriger vers login
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  // Vérifier si l'utilisateur a le rôle autorisé (si des rôles sont spécifiés)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Rediriger vers la page appropriée selon le rôle
    if (user.role === 'ROLE_ETABLISSEMENT') {
      return <Redirect to="/etablissement/dashboard" />;
    }
    return <Redirect to="/dashboard" />;
  }

  // Redirection automatique vers le bon dashboard si on est à la racine
  if (location.pathname === '/' || location.pathname === '/dashboard') {
    if (user && user.role === 'ROLE_ETABLISSEMENT') {
      return <Redirect to="/etablissement/dashboard" />;
    }
    // Pour ROLE_ADMINISTRATEUR, /dashboard est la bonne route
  }

  // Empêcher l'accès croisé entre les types d'admin
  if (user && user.role === 'ROLE_ADMINISTRATEUR' && location.pathname.startsWith('/etablissement/')) {
    return <Redirect to="/dashboard" />;
  }

  if (user && user.role === 'ROLE_ETABLISSEMENT' && !location.pathname.startsWith('/etablissement') && location.pathname !== '/parametres') {
    return <Redirect to="/etablissement/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
