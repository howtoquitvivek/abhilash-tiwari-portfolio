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

  // Hidden on admin and project detail pages
  const isExcludedPage = location.pathname.startsWith('/admin') || location.pathname.startsWith('/project');

  useEffect(() => {
    if (isExcludedPage) return;

    // Check if user has suppressed the popup for the day
    const suppressedUntil = localStorage.getItem('callPopupSuppressedUntil');
    const now = new Date().getTime();

    if (suppressedUntil && now < parseInt(suppressedUntil)) {
      return; // Skip showing if suppressed
    }

    // Delay before showing (set to 20 seconds for high-intent visitors)
    const SHOW_DELAY = import.meta.env.DEV ? 20000 : 20000; // 20s in dev, 20s in prod

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY);

    return () => clearTimeout(timer);
  }, [isExcludedPage]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSuppressLater = () => {
    // Suppress for 2 minutes
    const twoMinutes = new Date().getTime() + (2 * 60 * 1000);
    localStorage.setItem('callPopupSuppressedUntil', twoMinutes.toString());
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

  if (!isVisible || isExcludedPage) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content glass-card animate-popup">
        <button className="close-btn" onClick={handleClose} aria-label="Close">&times;</button>

        {step === 'form' ? (
          <div className="popup-inner">
            <div className="popup-header">
              <div className="icon-badge-premium">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <h3 className="font-display">Book a Free Call</h3>
              <p>Get elite-level guidance. We’ll connect with you within 24 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="popup-form">
              <div className="form-group-premium">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="premium-input"
                />
              </div>
              <div className="form-groups-row">
                <div className="form-group-premium">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email (Optional)"
                    value={formData.email}
                    onChange={handleChange}
                    className="premium-input"
                  />
                </div>
                <div className="form-group-premium">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="premium-input"
                  />
                </div>
              </div>
              <div className="form-group-premium">
                <input
                  type="text"
                  name="location"
                  placeholder="Your Location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="premium-input"
                />
              </div>
              <div className="form-group-premium">
                <textarea
                  name="query"
                  placeholder="How can we help you?"
                  required
                  rows="2"
                  value={formData.query}
                  onChange={handleChange}
                  className="premium-textarea"
                ></textarea>
              </div>

              <button type="submit" className="submit-btn-premium" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="load-spinner"></span>
                ) : (
                  <>
                    <span>Request a Callback</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </>
                )}
              </button>

              <button
                type="button"
                className="dismiss-btn-premium"
                onClick={handleSuppressLater}
              >
                Not right now, maybe later
              </button>
            </form>
          </div>
        ) : (
          <div className="success-message-premium">
            <div className="success-icon-wrap">
              <div className="success-ring"></div>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="font-display">Request Sent!</h3>
            <p>Stand by. Our lead specialist will reach out to you shortly.</p>
            <button onClick={handleClose} className="button-premium-outline">Got it</button>
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
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          padding: 1.5rem;
        }

        .popup-content {
          max-width: 460px;
          width: 100%;
          position: relative;
          background: var(--bg-main);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-pro);
          box-shadow: var(--shadow-pro);
          overflow: hidden;
          margin: auto;
        }

        .popup-inner { padding: 2.5rem; }

        .popup-header { text-align: center; margin-bottom: 2rem; }
        
        .icon-badge-premium {
          width: 52px;
          height: 52px;
          background: var(--brand-red);
          color: var(--text-white);
          border-radius: 30%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.2rem;
          box-shadow: var(--shadow-pro-red);
          transform: rotate(-4deg);
        }

        .popup-header h3 { 
          font-family: 'Outfit', sans-serif;
          font-size: 1.8rem; 
          margin-bottom: 0.5rem; 
          color: var(--brand-black); 
          letter-spacing: -0.02em;
          font-weight: 900;
        }

        .popup-header p { 
          font-size: 0.95rem; 
          color: var(--text-muted); 
          line-height: 1.5; 
          max-width: 320px;
          margin: 0 auto;
        }

        .close-btn {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          background: var(--neutral-100);
          border: none;
          width: 35px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: var(--neutral-400);
          z-index: 10;
          border-radius: 100px;
        }

        .close-btn:hover { 
          background: rgba(var(--accent-rgb), 0.1); 
          color: var(--accent); 
        }

        .popup-form { display: flex; flex-direction: column; gap: 1rem; }
        
        .form-groups-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .premium-input, .premium-textarea {
          width: 100%;
          padding: 0.85rem 1.2rem;
          border-radius: var(--radius-pro-inner);
          border: 1.5px solid var(--border-subtle);
          background: var(--bg-soft);
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--text-main);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .premium-input:focus, .premium-textarea:focus {
          outline: none;
          background: var(--bg-main);
          border-color: var(--brand-red);
          box-shadow: 0 0 0 4px var(--brand-red-glow);
        }

        .submit-btn-premium {
          background: var(--brand-black);
          color: var(--text-white);
          border: none;
          border-radius: var(--radius-pro-inner);
          padding: 1.1rem;
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s ease;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          min-height: 56px;
        }

        .submit-btn-premium:hover {
          background: var(--brand-red);
          transform: translateY(-2px);
          box-shadow: var(--shadow-pro-red);
        }

        .dismiss-btn-premium {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .dismiss-btn-premium:hover { color: var(--brand-red); text-decoration: underline; }

        .success-message-premium { 
          padding: 4rem 2rem; 
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon-wrap {
          width: 72px;
          height: 72px;
          background: var(--brand-success-bg);
          color: var(--brand-success);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .success-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid var(--brand-success);
          border-radius: 50%;
          animation: success-ping 1.5s infinite;
        }

        @keyframes success-ping {
          75%, 100% { transform: scale(1.6); opacity: 0; }
        }

        .success-message-premium h3 { 
          font-family: 'Outfit', sans-serif;
          font-size: 2.2rem; 
          color: var(--brand-black); 
          margin-bottom: 0.75rem; 
          font-weight: 900;
        }
        .success-message-premium p { 
          color: var(--text-muted); 
          line-height: 1.6; 
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
        }

        .button-premium-outline {
          background: var(--bg-main);
          border: 2px solid var(--brand-black);
          color: var(--brand-black);
          padding: 0.8rem 2.5rem;
          border-radius: var(--radius-pro-sm);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: all 0.2s;
        }
        .button-premium-outline:hover {
          background: var(--brand-black);
          color: var(--text-white);
        }

        @keyframes popupZoomIn {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .animate-popup {
          animation: popupZoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .load-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: var(--text-white);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .popup-inner { padding: 2rem 1.5rem; }
          .form-groups-row { grid-template-columns: 1fr; }
          .popup-header h3 { font-size: 1.6rem; }
        }
      `}</style>
    </div>
  );
};

export default CallPopup;
