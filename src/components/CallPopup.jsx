import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addQuery } from '../services/projectService';

const CallPopup = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hidden on admin pages
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdminPage) return;

    // Check if user has suppressed the popup for the day
    const suppressedUntil = localStorage.getItem('callPopupSuppressedUntil');
    const now = new Date().getTime();

    if (suppressedUntil && now < parseInt(suppressedUntil)) {
      return; // Skip showing if suppressed
    }

    // Delay before showing (set to 10 minutes for high-intent visitors)
    const SHOW_DELAY = import.meta.env.DEV ? 10000 : 600000; // 10s in dev, 10m in prod
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY);

    return () => clearTimeout(timer);
  }, [isAdminPage]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSuppressLater = () => {
    // Suppress for 15 minutes
    const fifteenMinutes = new Date().getTime() + (15 * 60 * 1000);
    localStorage.setItem('callPopupSuppressedUntil', fifteenMinutes.toString());
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addQuery({
        ...formData,
        message: formData.query, // Map 'query' to 'message' for compatibility with existing dashboard
        source: 'popup'
      });
      setStep('success');
      setTimeout(handleClose, 5000); // Close after 5 seconds on success
    } catch (error) {
      console.error('Popup submission error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible || isAdminPage) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content glass-card animate-popup">
        <button className="close-btn" onClick={handleClose} aria-label="Close">&times;</button>
        
        {step === 'form' ? (
          <div className="popup-inner">
            <div className="popup-header">
              <div className="icon-badge">📞</div>
              <h3>Book a Free Call</h3>
              <p>Drop your details below and we'll reach out to you within 24 hours.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="popup-form">
              <div className="form-group-custom">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group-custom">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address (Optional)"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group-custom">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group-custom">
                <input
                  type="text"
                  name="location"
                  placeholder="Your Location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group-custom">
                <textarea
                  name="query"
                  placeholder="How can we help you?"
                  required
                  rows="3"
                  value={formData.query}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                   <span className="load-spinner"></span>
                ) : (
                  'Request a Callback'
                )}
              </button>
              
              <button 
                type="button" 
                className="suppress-btn" 
                onClick={handleSuppressLater}
              >
                Remind me later
              </button>
            </form>
          </div>
        ) : (
          <div className="success-message-v2 text-center">
            <div className="success-lottie">✨</div>
            <h3>Request Received!</h3>
            <p>Our team will reach out to you shortly. Thank you for your interest.</p>
            <button onClick={handleClose} className="button-outline small mt-1">Got it</button>
          </div>
        )}
      </div>

      <style>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(15, 23, 42, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          padding: 1.5rem;
        }

        .popup-content {
          max-width: 440px;
          width: 100%;
          position: relative;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }

        .popup-inner { padding: 2.5rem 2rem; }

        .popup-header { text-align: center; margin-bottom: 2rem; }
        
        .icon-badge {
          width: 50px;
          height: 50px;
          background: var(--accent);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin: 0 auto 1.2rem;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .popup-header h3 { font-size: 1.6rem; margin-bottom: 0.5rem; color: var(--primary); }
        .popup-header p { font-size: 0.95rem; color: var(--text-muted); line-height: 1.5; }

        .close-btn {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          background: rgba(0,0,0,0.05);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
          z-index: 10;
        }
        .close-btn:hover { background: rgba(0,0,0,0.1); color: var(--primary); transform: rotate(90deg); }

        .popup-form { display: flex; flex-direction: column; gap: 1rem; }
        
        .form-group-custom input, .form-group-custom textarea {
          width: 100%;
          padding: 1rem 1.2rem;
          border-radius: 12px;
          border: 1.5px solid rgba(0,0,0,0.05);
          background: white;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .form-group-custom input:focus, .form-group-custom textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.1);
        }

        .submit-btn {
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1.2rem;
          font-weight: 700;
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
        }

        .submit-btn:hover {
          background: var(--accent-light);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
        }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .suppress-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.85rem;
          margin-top: 0.5rem;
          cursor: pointer;
          text-decoration: underline;
          transition: all 0.2s;
        }
        .suppress-btn:hover { color: var(--primary); }

        .success-message-v2 { padding: 4rem 2rem; }
        .success-lottie { font-size: 4rem; margin-bottom: 1.5rem; }
        .success-message-v2 h3 { color: #10b981; margin-bottom: 0.8rem; font-size: 1.8rem; }
        .success-message-v2 p { color: var(--text-muted); line-height: 1.6; }

        @keyframes popupZoomIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-popup {
          animation: popupZoomIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }

        .load-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CallPopup;
