import React, { useState, useEffect } from 'react';
import { uploadProjectMedia } from '../../services/storageService';
import { addProject, updateProject } from '../../services/projectService';

/**
 * Functional component for adding or editing a project.
 */
const ProjectForm = ({ onProjectAdded, editingProject, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    client: '',
    location: '',
    description: '',
    link: '',
    mapEmbedUrl: ''
  });
  const [primaryImage, setPrimaryImage] = useState(null); // The mandatory first image
  const [additionalMedia, setAdditionalMedia] = useState([]); // List of { file, type, preview } for new uploads
  const [existingMedia, setExistingMedia] = useState([]); // List of { url, type } from DB
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');


  // Pre-fill form when in edit mode
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        category: editingProject.category || '',
        client: editingProject.client || '',
        location: editingProject.location || '',
        description: editingProject.description || '',
        link: editingProject.link || '',
        mapEmbedUrl: editingProject.mapEmbedUrl || ''
      });
      setExistingMedia(editingProject.media || []);
      setPrimaryImage(null);
      setAdditionalMedia([]);
      setErrorMessage('');
      setStatus('idle');
    } else {
      setFormData({ title: '', category: '', client: '', location: '', description: '', link: '', mapEmbedUrl: '' });
      setPrimaryImage(null);
      setAdditionalMedia([]);
      setExistingMedia([]);
    }
  }, [editingProject]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePrimaryFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Primary file must be an image.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('File is too large. Max 2MB.');
        return;
      }
      setPrimaryImage({
        file,
        preview: URL.createObjectURL(file)
      });
      setErrorMessage('');
    }
  };

  const handleAdditionalMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const validMedia = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const maxSize = 10 * 1024 * 1024; // 10MB for images
      return isImage && file.size <= maxSize;
    });

    if (validMedia.length < files.length) {
      setErrorMessage('Some files were skipped. Max size: 10MB and only images are allowed.');
    }



    const newMediaItems = validMedia.map(file => ({
      file,
      type: 'image',
      preview: URL.createObjectURL(file)
    }));


    setAdditionalMedia(prev => [...prev, ...newMediaItems]);
  };

  const removeAdditionalMedia = (index) => {
    setAdditionalMedia(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = (index) => {
    setExistingMedia(prev => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      setErrorMessage('Title is required.');
      return;
    }
    
    // In add mode, at least one image is required (either primary or existing if editing)
    if (!editingProject && !primaryImage) {
      setErrorMessage('Primary project image is required.');
      return;
    }

    if (editingProject && existingMedia.length === 0 && !primaryImage) {
      setErrorMessage('At least one image is required.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      let imageUrl = editingProject?.imageUrl;
      let mediaArray = [...existingMedia];

      // 1. Handle Primary Image upload if a new file is selected
      if (primaryImage) {
        const uploadedUrl = await uploadProjectMedia(primaryImage.file);
        imageUrl = uploadedUrl; // Update main image
        // Add to media array if it's the only image or if we want it in the gallery
        // Usually, the first image is also part of the gallery
        mediaArray.unshift({ url: uploadedUrl, type: 'image' });
      }

      // 2. Handle Additional Media uploads
      if (additionalMedia.length > 0) {
        const uploadPromises = additionalMedia.map(item => uploadProjectMedia(item.file));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        const newMediaObjects = uploadedUrls.map((url, index) => ({
          url,
          type: additionalMedia[index].type
        }));
        
        mediaArray = [...mediaArray, ...newMediaObjects];
      }

      // Ensure at least one image is available (safety check)
      if (mediaArray.length === 0 && !imageUrl) {
        throw new Error('No media uploaded.');
      }

      const payload = {
        ...formData,
        imageUrl: imageUrl || mediaArray[0]?.url, // Fallback if imageUrl specifically missing
        media: mediaArray
      };

      if (editingProject) {
        await updateProject(editingProject.id, payload);
      } else {
        await addProject(payload);
      }

      setStatus('success');
      if (!editingProject) {
        setFormData({ title: '', category: '', client: '', location: '', description: '', link: '', mapEmbedUrl: '' });
        setPrimaryImage(null);
        setAdditionalMedia([]);
        setExistingMedia([]);
      }
      
      if (onProjectAdded) onProjectAdded();
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Project save error:', err);
      setErrorMessage('Failed to save project. ' + (err.message || 'Check console.'));
      setStatus('error');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="form-group mb-2">
        <label className="section-title-xs">PROJECT TITLE</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="e.g. Sobhapur Residential Complex"
          value={formData.title}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          className="modern-input"
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="section-title-xs">CATEGORY</label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="e.g. Builder"
            value={formData.category}
            onChange={handleInputChange}
            disabled={status === 'submitting'}
            className="modern-input"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="section-title-xs">CLIENT</label>
          <input
            type="text"
            id="client"
            name="client"
            placeholder="e.g. Simbuilt"
            value={formData.client}
            onChange={handleInputChange}
            disabled={status === 'submitting'}
            className="modern-input"
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label className="section-title-xs">LOCATION</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g. Diamond Valley, Victoria"
            value={formData.location}
            onChange={handleInputChange}
            disabled={status === 'submitting'}
            className="modern-input"
          />
        </div>
      </div>

      <div className="form-group mb-2">
        <label className="section-title-xs">DESCRIPTION (BIO)</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          placeholder="Briefly describe the project..."
          value={formData.description}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          className="modern-textarea"
        ></textarea>
      </div>

      <div className="form-group mb-2">
        <label className="section-title-xs">GOOGLE MAP EMBED LINK (OPTIONAL)</label>
        <input
          type="text"
          id="mapEmbedUrl"
          name="mapEmbedUrl"
          placeholder="e.g. https://google.com/maps/embed... or iframe src=..."
          value={formData.mapEmbedUrl}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          className="modern-input"
        />
        <p className="small text-muted mt-min">Paste the "Embed a map" iframe source or the link. (From Share &gt; Embed map)</p>
      </div>

      <div className="form-group mb-2">
        <label className="section-title-xs">PRIMARY PROJECT IMAGE (MANDATORY)</label>
        <input
          type="file"
          id="primaryImage"
          accept="image/*"
          onChange={handlePrimaryFileChange}
          disabled={status === 'submitting'}
          className="file-input modern-input"
        />
        {primaryImage && (
          <div className="media-preview-item mt-min">
            <img src={primaryImage.preview} alt="Primary Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
          </div>
        )}
      </div>

      <div className="form-group mb-2">
        <label className="section-title-xs">ADDITIONAL IMAGES (OPTIONAL)</label>
        <input
          type="file"
          id="additionalMedia"
          multiple
          accept="image/*"
          onChange={handleAdditionalMediaChange}
          disabled={status === 'submitting'}
          className="file-input modern-input"
        />
        
        {/* New Media Previews */}
        <div className="media-preview-grid mt-1">
          {additionalMedia.map((item, index) => (
            <div key={`new-${index}`} className="media-preview-card">
              <img src={item.preview} alt="New Preview" />
              <button type="button" className="remove-btn" onClick={() => removeAdditionalMedia(index)}>×</button>
            </div>
          ))}
        </div>

        {/* Existing Media Previews (Edit Mode) */}
        {existingMedia.length > 0 && (
          <div className="existing-media-section mt-2">
            <label className="section-title-xs">EXISTING IMAGES</label>
            <div className="media-preview-grid">
              {existingMedia.map((item, index) => (
                <div key={`ex-${index}`} className="media-preview-card">
                  <img src={item.url} alt="Existing" />
                  <button type="button" className="remove-btn" onClick={() => removeExistingMedia(index)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>



      <div className="form-group mb-2">
        <label className="section-title-xs">VISIT LINK (OPTIONAL)</label>
        <input
          type="text"
          id="link"
          name="link"
          placeholder="https://..."
          value={formData.link}
          onChange={handleInputChange}
          disabled={status === 'submitting'}
          className="modern-input"
        />
      </div>

      <button type="submit" className="button-primary w-100" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'SAVING...' : (editingProject ? 'SAVE CHANGES' : 'ADD PROJECT')}
      </button>

      {editingProject && (
        <button 
          type="button" 
          onClick={onCancel} 
          className="action-btn-pro w-100 mt-1" 
          style={{ padding: '0.85rem' }}
          disabled={status === 'submitting'}
        >
          CANCEL EDIT
        </button>
      )}

      {status === 'success' && (
        <p className="status-msg success mt-min">Project {editingProject ? 'updated' : 'added'} successfully!</p>
      )}

      {status === 'error' && (
        <p className="status-msg error mt-min">{errorMessage}</p>
      )}


      <style>{`
        .media-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;
        }
        .media-preview-card {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
        }
        .media-preview-card img, .media-preview-card video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(239, 68, 68, 0.9);
          color: white;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.2s;
        }
        .remove-btn:hover { background: #ef4444; transform: scale(1.1); }
        .existing-media-section { padding-top: 1rem; border-top: 1px solid #eee; }
      `}</style>
    </form>

  );
};

export default ProjectForm;
