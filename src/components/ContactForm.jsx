import React, { useState, useEffect } from 'react';
import { addQuery } from '../services/projectService';
import { sendContactEmail } from '../services/emailService';
import { getSettings } from '../services/settingsService';
import { Clock, CheckCircle, ShieldCheck } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    honeypot: ''
  });
  const [mapData, setMapData] = useState({
    url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14670.33441544431!2d79.9912773!3d23.18536!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3981ae1767070707%3A0x123456789abcdef!2sSobhapur%20Greens!5e0!3m2!1sen!2sin!4v1713254400000!5m2!1sen!2sin",
    address: "Sobhapur Greens, Near Chhawani, Jabalpur, MP 482011"
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMapSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings.mapUrl && settings.mapAddress) {
          setMapData({
            url: settings.mapUrl,
            address: settings.mapAddress
          });
        }
      } catch (err) {
        console.error('Error fetching map settings:', err);
      }
    };
    fetchMapSettings();
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
    <section id="contact" className="contact-section">
      <div className="container">

        {/* PREMIUM MASTER CONTACT CARD */}
        <div className="master-contact-card" data-aos="zoom-in" data-aos-duration="1200">

          {/* Left Panel: High-Impact Editorial Branding */}
          <div className="contact-brand-panel">
            {/* Architectural Blueprint Pattern Overlay */}
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
                  rows="4"
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

        {/* MAP SECTION: FULL-WIDTH ROUNDED */}
        <div className="map-card-wrapper" data-aos="fade-up" data-aos-duration="1000">
          <div className="map-header-inner">
            <span className="location-tag">VISIT OUR STUDIO</span>
            <h3>Technical HQ – Jabalpur</h3>
            <div className="map-meta-strip mt-1">
              <p>📍 {mapData.address}</p>
              <span className="strip-divider">|</span>
              <p>⌚ Mon - Sat: 10:00 - 18:00</p>
            </div>
          </div>
          <div className="google-map-pro">
            <iframe
              title="Office Location"
              src={mapData.url}
              width="100%"
              height="400"

              style={{ border: 0, filter: 'grayscale(10%) contrast(110%)' }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section {
          padding: 5rem 0;
          background-color: var(--bg-soft);
          font-family: 'Outfit', 'Inter', sans-serif;
        }




        .container {
          max-width: 1240px;
          margin: 0 auto;
          width: 90%;
        }

        /* MASTER CARD LAYOUT */
        .master-contact-card {
          display: grid;
          grid-template-columns: 1.1fr 1.3fr;
          background: var(--bg-main);
          border-radius: var(--radius-pro);
          overflow: hidden;

          box-shadow: 0 50px 120px -20px rgba(0, 0, 0, 0.12);
          margin-bottom: 4rem;
          position: relative;
        }


        /* LEFT PANEL: BLACK REDEFINED */
        .contact-brand-panel {
          background-color: var(--brand-black-panel);
          padding: 3rem 3rem;
          color: var(--text-white);

          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center; /* Centered content for better balance */
          overflow: hidden;
        }



        /* Blueprint Grid Effect */
        .blueprint-overlay {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background-image: 
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .panel-content-pro { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.6rem 1.2rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 3rem;
          width: fit-content;
        }

        .brand-header {
          font-size: 2.2rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 2rem;
          color: var(--text-white);
        }





        .text-glow-red {
          color: var(--brand-red);
          text-shadow: 0 0 20px var(--brand-red-glow);
        }


        .text-italic { font-style: italic; font-family: serif; font-weight: 400; opacity: 0.9; }

        .brand-subtext {
          font-size: 1.1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.55);
          max-width: 90%;
          font-weight: 400;
        }


        /* Feature Info Grid */
        .info-feature-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-top: 3rem; 
        }


        .feature-item-pro {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .feature-icon-glass {
          width: 52px;
          height: 52px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-red);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }


        .feature-text strong { display: block; font-size: 1rem; color: var(--text-white); margin-bottom: 0.2rem; }
        .feature-text p { font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); margin: 0; }


        /* RIGHT PANEL: FORM REDEFINED */
        .contact-form-panel {
          padding: 3rem 3rem; /* Increased bottom padding for the button */
          background: var(--bg-main);
          position: relative;
        }





        .form-sub-title {
          font-size: 0.75rem;
          font-weight: 850;
          letter-spacing: 0.2em;
          color: var(--brand-red);
          text-transform: uppercase;
        }


        .form-row { display: flex; gap: 1.5rem; }
        .flex-1 { flex: 1; }

        .form-group { margin-bottom: 1.8rem; }

        .label-pro {
          display: block;
          font-size: 0.7rem;
          font-weight: 850;
          color: var(--text-main);
          margin-bottom: 0.8rem;
          letter-spacing: 0.05em;
        }


        .input-pro {
          width: 100%;
          padding: 1.1rem 1.4rem;
          border-radius: var(--radius-pro-inner);
          border: 2px solid var(--border-subtle);
          font-size: 1rem;
          transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
          background: var(--bg-soft);
          font-family: inherit;
        }



        .input-pro::placeholder { color: #9ca3af; }

        .input-pro:focus {
          outline: none;
          border-color: var(--brand-red);
          background: var(--bg-main);
          box-shadow: 0 10px 30px var(--brand-red-glow);
          transform: translateY(-2px);
        }


        .h-auto { height: auto; min-height: 80px; resize: none; }



        /* BUTTON STYLE */
        .submit-btn-pro {
          width: 100%;
          padding: 1.25rem;
          background-color: var(--brand-red);
          color: var(--text-white);
          border: none;
          border-radius: var(--radius-pro-inner);

          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          margin-top: 1rem;
          position: relative;
          overflow: hidden;
        }

        .submit-btn-pro:hover:not(:disabled) {
          background-color: var(--brand-black);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }


        .spinner-loader {
          width: 16px; height: 16px; border: 2px solid #ffffff55; border-top-color: #fff;
          border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* MAP CARD */
        .map-card-wrapper {
          background: var(--bg-main);
          border-radius: var(--radius-pro);
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.06);
        }


        .map-header-inner { padding: 3rem 2rem; text-align: center; background: linear-gradient(to bottom, var(--bg-main), var(--bg-soft)); }


        .location-tag { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.2em; color: var(--brand-red); margin-bottom: 0.8rem; display: block; }
        .map-header-inner h3 { font-size: 2.6rem; font-weight: 900; letter-spacing: -0.02em; margin: 0; color: var(--brand-black); }

        
        .map-meta-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          color: #6b7280;
          font-weight: 500;
          font-size: 1rem;
        }
        .strip-divider { opacity: 0.3; }

        .google-map-pro { line-height: 0; }

        @media (max-width: 1100px) {
          .master-contact-card { grid-template-columns: 1fr; }
          .brand-header { font-size: 3rem; }
          .contact-brand-panel { padding: 5rem 3rem; }
          .contact-form-panel { padding: 4rem 3rem; }
        }

        @media (max-width: 640px) {
          .contact-section { padding: 6rem 0; }
          .form-row { flex-direction: column; gap: 0; }
          .master-contact-card { border-radius: 32px; }
          .brand-header { font-size: 2.2rem; }
          .map-card-wrapper { border-radius: 32px; }
          .map-meta-strip { flex-direction: column; gap: 0.5rem; }
          .strip-divider { display: none; }
        }
      `}</style>
    </section>
  );
};

export default ContactForm;
