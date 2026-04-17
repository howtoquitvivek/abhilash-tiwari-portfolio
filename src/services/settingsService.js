import { db } from '../firebase/config';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const SETTINGS_COLLECTION = 'settings';
const SITE_DOC = 'site';

/**
 * Fetches all site settings from Firestore.
 * Initializes the document if it doesn't exist.
 */
export const getSettings = async () => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Default settings
      const defaultSettings = {
        adminEmails: [],
        superAdminEmails: ["vivekbarman425@gmail.com"], // Manually set as the first superadmins
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14670.33441544431!2d79.9912773!3d23.18536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1767070707%3A0x123456789abcdef!2sSobhapur%20Greens!5e0!3m2!1sen!2sin!4v1713254400000!5m2!1sen!2sin",
        mapAddress: "Sobhapur Greens, Near Chhawani, Jabalpur, MP 482011"
      };
      await setDoc(docRef, defaultSettings);
      return defaultSettings;
    }
  } catch (error) {
    console.error('Settings Service Error (getSettings):', error);
    throw error;
  }
};

/**
 * Updates site settings.
 * @param {Object} data - Settings data to update.
 */
export const updateSettings = async (data) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_DOC);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Settings Service Error (updateSettings):', error);
    throw error;
  }
};

/**
 * Adds an email to the admin list.
 * @param {string} email 
 */
export const addAdminEmail = async (email) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_DOC);
    await updateDoc(docRef, {
      adminEmails: arrayUnion(email.toLowerCase().trim())
    });
  } catch (error) {
    console.error('Settings Service Error (addAdminEmail):', error);
    throw error;
  }
};

/**
 * Removes an email from the admin list.
 * @param {string} email 
 */
export const removeAdminEmail = async (email) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SITE_DOC);
    await updateDoc(docRef, {
      adminEmails: arrayRemove(email)
    });
  } catch (error) {
    console.error('Settings Service Error (removeAdminEmail):', error);
    throw error;
  }
};
