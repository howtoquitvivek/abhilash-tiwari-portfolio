import React, { useState, useEffect } from 'react';
import { addQuery } from '../services/projectService';
import { sendContactEmail } from '../services/emailService';
import { getSettings } from '../services/settingsService';
import { Clock, CheckCircle, ShieldCheck, MapPin, Navigation } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    honeypot: ''
  });
  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching site settings:', err);
      }
    };
    fetchSiteSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.firstName.trim()) return 'First name is required.';
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) return 'Email is invalid.';
    if (!formData.phone || !formData.phone.trim()) return 'Phone number is required for follow-up.';
    if (!formData.message.trim()) return 'Message is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.honeypot) {
      setStatus('success');
      return;
    }

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      await addQuery({
        name: fullName,
        email: formData.email,
        phone: formData.phone || '',
        message: formData.message,
        source: 'form'
      });

      await sendContactEmail({
        name: fullName,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        message: fullName + ' sent a new message.'
      });

      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', honeypot: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Something went wrong. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <>
      <section id="contact" className="contact-section section-pro">
        <div className="container">
          {/* SECTION HEADER */}
          <div className="section-header-pro" data-aos="fade-up">
            <span className="subtitle-brand">GET IN TOUCH</span>
            <h2 className="title-brand">Contact Us</h2>
            <div className="brand-accent-line mx-auto"></div>
          </div>

          {/* PREMIUM MASTER CONTACT CARD */}
          <div className="master-contact-card" data-aos="zoom-in" data-aos-duration="1200">
            {/* Left Panel: High-Impact Editorial Branding */}
            <div className="contact-brand-panel">
              <div className="blueprint-overlay"></div>
              <div className="panel-content-pro">
                <div className="status-badge" data-aos="fade-right" data-aos-delay="400">
                  <ShieldCheck size={14} className="mr-min" />
                  TRUSTED BY 200+ CLIENTS
                </div>
                <h2 className="brand-header">
                  Take the <span className="text-glow-red">first step</span> today, and we'll <span className="text-italic">deliver</span> a day earlier!
                </h2>
                <p className="brand-subtext">
                  Contact us today for a free consultation or quote. Our technical team is ready to answer all your structural questions and get started on your vision.
                </p>
                <div className="info-feature-grid mt-4">
                  <div className="feature-item-pro">
                    <div className="feature-icon-glass"><Clock size={20} /></div>
                    <div className="feature-text">
                      <strong>24h Response</strong>
                      <p>Guaranteed feedback</p>
                    </div>
                  </div>
                  <div className="feature-item-pro">
                    <div className="feature-icon-glass"><CheckCircle size={20} /></div>
                    <div className="feature-text">
                      <strong>Free Consultation</strong>
                      <p>On-site expert visit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Sophisticated Form */}
            <div className="contact-form-panel">
              <form onSubmit={handleSubmit} className="premium-form">
                <div style={{ display: 'none' }}>
                  <input type="text" name="honeypot" value={formData.honeypot} onChange={handleChange} tabIndex="-1" />
                </div>
                <div className="form-row">
                  <div className="form-group flex-1">
                    <label className="label-pro">FIRST NAME</label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      className="input-pro"
                    />
                  </div>
                  <div className="form-group flex-1">
                    <label className="label-pro">LAST NAME</label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      className="input-pro"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="label-pro">BUSINESS EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    className="input-pro"
                  />
                </div>
                <div className="form-group">
                  <label className="label-pro">PHONE NUMBER</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    className="input-pro"
                  />
                </div>
                <div className="form-group">
                  <label className="label-pro">PROJECT DETAILS</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Tell us about your project or vision..."
                    value={formData.message}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    className="input-pro h-auto"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="submit-btn-pro"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center justify-center gap-1">
                      <div className="spinner-loader"></div> PROCESSING...
                    </span>
                  ) : 'SEND ENQUIRY'}
                </button>
                {status === 'success' && (
                  <div className="alert success-alert mt-2 animate-bounce-in">
                    ✓ Success! We'll be in touch within 24 hours.
                  </div>
                )}
                {status === 'error' && (
                  <div className="alert error-alert mt-2">
                    ✕ {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section id="map-location" className="map-section-dedicated section-pro">
        <div className="container">
          <div className="section-header-pro" data-aos="fade-up">
            <span className="subtitle-brand">VISIT OUR OFFICE</span>
            <h2 className="title-brand">We are located in Jabalpur</h2>
            <div className="brand-accent-line mx-auto"></div>
          </div>

          <div className="map-card-wrapper" data-aos="fade-up" data-aos-duration="1000">
            <div className="map-grid-pro">
              {/* Left Side: Editorial Location Info */}
              <div className="map-info-panel">
                <div className="blueprint-overlay"></div>
                <div className="panel-content-pro">
                  <div className="location-detail-group">
                    <div className="feature-icon-glass"><MapPin size={22} /></div>
                    <div className="loc-text-pro">
                      <h3>Office Address</h3>
                      <p>{settings?.siteAddress || "Sobhapur Greens, Jabalpur, MP 482011"}</p>
                    </div>
                  </div>

                  <div className="location-detail-group mt-3">
                    <div className="feature-icon-glass"><Clock size={22} /></div>
                    <div className="loc-text-pro">
                      <h3>Working Hours</h3>
                      <p>{settings?.workingHours || "Mon - Sat: 10:00 AM - 6:00 PM"}</p>
                      {settings?.isStudioOpen && <span className="availability-tag">Studio Open</span>}
                    </div>
                  </div>

                  <div className="map-header-inner mt-4">
                    <h4 className="loc-header-small">Join us for a <span className="text-glow-red">live discussion</span> about your building vision.</h4>
                  </div>

                  <div className="map-action-footer mt-4">
                    <a
                      href={settings?.mapUrl ? settings.mapUrl.replace('/embed', '/viewer') : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.siteAddress || "Sobhapur Greens")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="directions-btn-pro"
                    >
                      <Navigation size={18} className="mr-min" />
                      GET DIRECTIONS
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side: The Map itself */}
              <div className="map-frame-panel">
                <div className="google-map-pro">
                  <iframe
                    title="Office Location"
                    src={settings?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14670.33441544431!2d79.9912773!3d23.18536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1767070707%3A0x123456789abcdef!2sSobhapur%20Greens!5e0!3m2!1sen!2sin!4v1713254400000!5m2!1sen!2sin"}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(15%) contrast(110%) brightness(95%)' }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .contact-section {
          background-color: var(--bg-main);
        }

        .map-section-dedicated {
          background-color: var(--bg-main);
        }

        .master-contact-card {
          display: grid;
          grid-template-columns: 1fr 1.3fr; /* Synced with Map Card */
          background: var(--bg-main);
          border-radius: var(--radius-pro);
          overflow: hidden;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--border-subtle);
          max-width: 1100px; /* Synced with Map Card */
          margin: 1rem auto 0; /* Tightened from 1.5rem */
          position: relative;
          min-height: 480px; /* Reduced to fit better in viewport */
        }

        .contact-brand-panel, .map-info-panel {
          background-color: var(--p-color);
          padding: 2.5rem;
          color: var(--text-white);
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }

        .blueprint-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image: 
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .panel-content-pro { position: relative; z-index: 2; display: flex; flex-direction: column; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.4rem 0.8rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 99px;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
          width: fit-content;
        }

        .brand-header {
          font-size: 1.6rem;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          color: var(--text-white);
        }

        .text-glow-red {
          color: var(--accent);
          text-shadow: 0 0 15px var(--accent-glow);
        }

        .text-italic { font-style: italic; font-family: serif; font-weight: 400; opacity: 0.9; }

        .brand-subtext, .loc-text-pro p {
          font-size: 0.95rem;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.5);
          max-width: 95%;
          font-weight: 400;
          margin: 0;
        }

        .info-feature-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 1.5rem; 
        }

        .feature-item-pro, .location-detail-group {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 2.2rem; /* Increased for breathing room */
        }

        .feature-icon-glass {
          width: 42px;
          height: 42px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          flex-shrink: 0;
        }

        .feature-text strong, .loc-text-pro h3 { 
          display: block; 
          font-size: 0.8rem; 
          font-weight: 850;
          color: var(--text-white); 
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          opacity: 1;
        }

        .brand-subtext, .loc-text-pro p {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.55);
          max-width: 100%;
          font-weight: 400;
          margin: 0;
        }

        .feature-text p { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); margin: 0; }

        .contact-form-panel {
          padding: 2.5rem;
          background: var(--bg-main);
          position: relative;
        }

        .form-row { display: flex; gap: 1rem; }
        .flex-1 { flex: 1; }

        .form-group { margin-bottom: 1rem; }

        .label-pro {
          display: block;
          font-size: 0.6rem;
          font-weight: 850;
          color: var(--text-main);
          margin-bottom: 0.5rem;
          letter-spacing: 0.05em;
        }

        .input-pro {
          width: 100%;
          padding: 0.75rem 1.1rem;
          border-radius: var(--radius-pro-inner);
          border: 2px solid var(--border-subtle);
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: var(--bg-soft);
          font-family: inherit;
        }

        .input-pro:focus {
          outline: none;
          border-color: var(--accent);
          background: var(--bg-main);
          box-shadow: 0 8px 20px var(--accent-glow);
          transform: translateY(-1px);
        }

        .h-auto { height: auto; min-height: 70px; resize: none; }

        .submit-btn-pro {
          width: 100%;
          padding: 1rem;
          background-color: var(--accent);
          color: var(--text-white);
          border: none;
          border-radius: var(--radius-btn);
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 0.5rem;
          text-transform: uppercase;
        }

        .submit-btn-pro:hover:not(:disabled) {
          background-color: var(--p-color);
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        /* MULTI-COLUMN MAP SYSTEM - REFINED */
        .map-card-wrapper {
          background: var(--bg-main);
          border-radius: var(--radius-pro);
          overflow: hidden;
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.1);
          max-width: 1100px;
          margin: 1rem auto 0; /* Tightened from 1.5rem */
          position: relative;
        }

        .map-grid-pro {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          min-height: 480px; /* Synchronized reduction */
        }

        .availability-tag {
          display: inline-block;
          margin-top: 0.8rem;
          font-size: 0.6rem;
          font-weight: 900;
          color: var(--brand-success);
          background: var(--brand-success-bg);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .loc-header-small {
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.6;
          color: var(--text-white);
          opacity: 0.85;
          margin-bottom: 0.5rem;
        }

        .directions-btn-pro {
          display: inline-flex;
          align-items: center;
          padding: 1rem 2rem;
          background: var(--accent);
          color: var(--text-white);
          font-weight: 900;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          border-radius: var(--radius-btn);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          width: fit-content;
        }

        .directions-btn-pro:hover {
          background: var(--text-white);
          color: var(--brand-black);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        .map-frame-panel {
          position: relative;
          background: var(--neutral-100);
        }

        .google-map-pro { height: 100%; width: 100%; }

        @media (max-width: 1100px) {
          .master-contact-card { grid-template-columns: 1fr; }
          .map-grid-pro { grid-template-columns: 1fr; }
          .contact-brand-panel, .map-info-panel { padding: 4rem 3rem; }
        }

        @media (max-width: 768px) {
          .map-info-panel {
            padding: 3rem 2rem;
          }
          .google-map-pro {
            height: 400px;
          }
        }

        @media (max-width: 640px) {
          .form-row { flex-direction: column; gap: 0; }
          .master-contact-card, .map-card-wrapper { border-radius: 32px; }
        }

        .spinner-loader {
          width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: var(--text-white);
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default ContactForm;
