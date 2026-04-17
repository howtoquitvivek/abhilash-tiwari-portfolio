import { useState, useEffect } from 'react';
import { loginWithGoogle, logout, subscribeToAuthChanges } from '../services/authService';
import { getSettings } from '../services/settingsService';

/**
 * Custom hook to manage authentication state and admin verification.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser && currentUser.email) {
        try {
          const settings = await getSettings();
          const adminEmails = settings.adminEmails || [];
          const superAdminEmails = settings.superAdminEmails || [];
          const userEmail = currentUser.email.toLowerCase().trim();
          
          const isUserSuperAdmin = superAdminEmails.some(email => 
            email.toLowerCase().trim() === userEmail
          );
          const isUserAdmin = isUserSuperAdmin || adminEmails.some(email => 
            email.toLowerCase().trim() === userEmail
          );
          
          setIsAdmin(isUserAdmin);
          setIsSuperAdmin(isUserSuperAdmin);
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setIsSuperAdmin(false);
        }
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    isAdmin,
    isSuperAdmin,
    login,
    logout: handleLogout,
  };
};
