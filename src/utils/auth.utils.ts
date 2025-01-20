import { UserRole } from '../types/auth.types';

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  return token !== null;
};

export const getCurrentUserRole = (): UserRole | null => {
  const role = localStorage.getItem('role') as UserRole;
  return role || null;
};
