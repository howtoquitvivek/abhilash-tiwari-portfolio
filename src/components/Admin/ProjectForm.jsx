import React, { useState, useEffect } from 'react';
import { uploadProjectImage } from '../../services/storageService';
import { addProject, updateProject } from '../../services/projectService';

/**
 * Functional component for adding or editing a project.
 */
const ProjectForm = ({ onProjectAdded, editingProject, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || '',
        description: editingProject.description || '',
        link: editingProject.link || ''
      });
      setImageFile(null); // Reset image selection
      setErrorMessage('');
      setStatus('idle');
    } else {
      setFormData({ title: '', description: '', link: '' });
      setImageFile(null);
    }
  }, [editingProject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage('File is too large. Max 2MB.');
        return;
      }
      setImageFile(file);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      setErrorMessage('Title is required.');
      return;
    }
    
    // In add mode, image is required. In edit mode, it's optional.
    if (!editingProject && !imageFile) {
      setErrorMessage('Initial project image is required.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      let imageUrl = editingProject?.imageUrl;

      // Handle image upload if a new file is selected
      if (imageFile) {
        imageUrl = await uploadProjectImage(imageFile);
      }

      if (editingProject) {
        // 2a. Update existing project
        await updateProject(editingProject.id, {
          ...formData,
          imageUrl
        });
      } else {
        // 2b. Add new project
        await addProject({
          ...formData,
          imageUrl
        });
      }

      setStatus('success');
      if (!editingProject) {
        setFormData({ title: '', description: '', link: '' });
        setImageFile(null);
      }
      
      if (onProjectAdded) onProjectAdded();
      
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('Project save error:', err);
      setErrorMessage('Failed to save project. Check console for details.');
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
        <label className="section-title-xs">PROJECT IMAGE</label>
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
          disabled={status === 'submitting'}
          className="file-input modern-input"
        />
        <p className="small text-muted mt-min">Max 2MB. Optimized automatically.</p>
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
    </form>
  );
};

export default ProjectForm;
