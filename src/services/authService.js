import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';


/**
 * Initiates Google Login popup.
 * Phase 4 requirement: Google Login via Firebase Auth.
 * @returns {Promise<User>} Firebase User object.
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Auth Service Error (loginWithGoogle):', error);
    throw error;
  }
};

/**
 * Signs out the current user.
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Auth Service Error (logout):', error);
    throw error;
  }
};


/**
 * Subscribes to authentication state changes.
 * @param {Function} callback 
 * @returns {Unsubscribe} function to stop listening.
 */
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
