import emailjs from 'emailjs-com';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

/**
 * Sends a contact inquiry email via EmailJS.
 * Phase 1 Requirement: Contact/query form notifications.
 * @param {Object} formData - Data from the contact form (name, email, message).
 * @returns {Promise<Object>} EmailJS response.
 */
export const sendContactEmail = async (formData) => {
  // Graceful handling for missing credentials (during setup)
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || 
      SERVICE_ID === 'your_service_id' || 
      TEMPLATE_ID === 'your_template_id' || 
      PUBLIC_KEY === 'your_public_key') {
    console.warn('EmailJS credentials missing or are placeholders. Email not sent.');
    return { status: 'skipped', text: 'Email notification skipped - placeholders in use' };
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID, 
      TEMPLATE_ID, 
      {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: "Abhilash Tiwari", // Sourced from businessInformation
      }, 
      PUBLIC_KEY
    );
    return response;
  } catch (error) {
    console.error('Email Service Error (sendContactEmail):', error);
    throw error;
  }
};
