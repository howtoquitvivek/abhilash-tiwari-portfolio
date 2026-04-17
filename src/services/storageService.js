import imageCompression from 'browser-image-compression';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Compresses an image file according to Phase 1 requirements.
 * @param {File} file 
 * @returns {Promise<File>}
 */
const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1, // Max size 1MB as per max 2MB requirement
    maxWidthOrHeight: 1920, // Standard HD resize
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('Compression error:', error);
    return file; // Fallback to original if compression fails
  }
};

/**
 * Uploads a file to Cloudinary using Unsigned Upload API.
 * Includes client-side compression.
 * @param {File} file 
 * @returns {Promise<string>} Secure URL of the uploaded image
 */
export const uploadProjectImage = async (file) => {
  try {
    // 1. Compress image before upload (Requirement: Image Optimization)
    const compressedFile = await compressImage(file);

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    // 3. Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();

    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
  } catch (error) {
    console.error('Storage Service Error:', error);
    throw error;
  }
};
