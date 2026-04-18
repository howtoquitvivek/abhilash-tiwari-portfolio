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

    // Delay before showing (set to 2 minutes for high-intent visitors)
    const SHOW_DELAY = import.meta.env.DEV ? 10000 : 10000; // 10s in dev, 10s in prod

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, SHOW_DELAY);

    return () => clearTimeout(timer);
  }, [isAdminPage]);

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

  if (!isVisible || isAdminPage) return null;

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
          background: rgba(2, 6, 23, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 1rem;
        }

        .popup-content {
          max-width: 440px;
          width: 100%;
          position: relative;
          background: var(--bg-main);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-pro);
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          margin: auto;
        }


        .popup-inner { padding: 1.5rem 2.2rem; }

        .popup-header { text-align: center; margin-bottom: 1rem; }
        
        .icon-badge-premium {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dark));
          color: white;
          border-radius: var(--radius-pro-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.8rem;
          box-shadow: 0 10px 20px -5px var(--accent-gold-glow);
          transform: rotate(-3deg);
        }


        .popup-header h3 { 
          font-size: 1.5rem; 
          margin-bottom: 0.3rem; 
          color: var(--text-main); 
          letter-spacing: -0.02em;
          font-weight: 800;
        }

        .popup-header p { 
          font-size: 0.85rem; 
          color: #64748b; 
          line-height: 1.4; 
          max-width: 280px;
          margin: 0 auto;
        }

        .close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(15, 23, 42, 0.05);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: var(--radius-pro-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
        }

        .close-btn:hover { 
          background: #ef4444; 
          color: white; 
          transform: rotate(90deg) scale(1.1); 
        }

        .popup-form { display: flex; flex-direction: column; gap: 0.75rem; }
        
        .form-groups-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .form-group-premium { position: relative; }

        .premium-input, .premium-textarea {
          width: 100%;
          padding: 0.8rem 1.1rem;
          border-radius: var(--radius-pro-inner);
          border: 2px solid var(--border-subtle);
          background: var(--bg-soft);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-main);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }


        .premium-input::placeholder, .premium-textarea::placeholder {
          color: #94a3b8;
        }

        .premium-input:focus, .premium-textarea:focus {
          outline: none;
          background: var(--bg-main);
          border-color: var(--accent-gold);
          box-shadow: 0 10px 20px -10px var(--accent-gold-glow);
        }


        .submit-btn-premium {
          background: linear-gradient(135deg, var(--accent-gold), #fbbf24);
          color: #451a03;
          border: none;
          border-radius: var(--radius-pro-inner);
          padding: 1rem;

          font-weight: 800;
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          min-height: 56px;
          box-shadow: 0 10px 25px -5px var(--accent-gold-glow);
        }


        .submit-btn-premium:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 20px 35px -8px var(--accent-gold-glow);
          filter: brightness(1.05);
        }


        .submit-btn-premium:active { transform: translateY(-1px); }

        .submit-btn-premium:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .dismiss-btn-premium {
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .dismiss-btn-premium:hover { color: var(--text-main); }


        .success-message-premium { 
          padding: 4rem 2.5rem; 
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon-wrap {
          width: 80px;
          height: 80px;
          background: #f0fdf4;
          color: #16a34a;
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
          border: 4px solid #16a34a;
          border-radius: 50%;
          animation: success-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes success-ping {
          75%, 100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .success-message-premium h3 { 
          font-size: 2rem; 
          color: #0d9488; 
          margin-bottom: 0.75rem; 
          font-weight: 800;
        }
        .success-message-premium p { 
          color: #64748b; 
          line-height: 1.6; 
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .button-premium-outline {
          background: var(--bg-main);
          border: 2px solid var(--border-subtle);
          color: var(--text-muted);
          padding: 0.8rem 2rem;
          border-radius: var(--radius-pro-sm);

          font-weight: 700;
          transition: all 0.2s;
        }
        .button-premium-outline:hover {
          border-color: #16a34a;
          color: #16a34a;
        }

        @keyframes popupZoomIn {
          0% { transform: scale(0.8) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .animate-popup {
          animation: popupZoomIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .load-spinner {
          width: 28px;
          height: 28px;
          border: 4px solid rgba(69, 26, 3, 0.2);
          border-radius: 50%;
          border-top-color: #451a03;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .popup-inner { padding: 2.5rem 1.5rem; }
          .form-groups-row { grid-template-columns: 1fr; gap: 1.25rem; }
          .popup-header h3 { font-size: 1.5rem; }
          .submit-btn-premium { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default CallPopup;
