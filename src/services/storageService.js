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
 * Uploads a file (image or video) to Cloudinary using Unsigned Upload API.
 * Includes client-side compression for images.
 * @param {File} file 
 * @returns {Promise<string>} Secure URL of the uploaded media
 */
export const uploadProjectMedia = async (file) => {
  try {
    let fileToUpload = file;
    const isImage = file.type.startsWith('image/');
    const resourceType = isImage ? 'image' : 'video';

    // 1. Compress image before upload (only if it's an image)
    if (isImage) {
      fileToUpload = await compressImage(file);
    }

    // 2. Prepare FormData
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('resource_type', resourceType);

    // 3. Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );


    const data = await response.json();

    if (data.secure_url) {
      console.log(`Cloudinary Upload Success (${resourceType}):`, data.secure_url);
      return data.secure_url;
    } else {
      console.error('Cloudinary detailed error:', data.error);
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }

  } catch (error) {
    console.error('Storage Service Error:', error);
    throw error;
  }
};

// Keep existing name for backward compatibility during transition
export const uploadProjectImage = uploadProjectMedia;

