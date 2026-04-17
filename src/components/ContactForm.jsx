import React, { useState, useEffect } from 'react';
import { addQuery } from '../services/projectService';
import { sendContactEmail } from '../services/emailService';
import { getSettings } from '../services/settingsService';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
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
    if (!formData.name.trim()) return 'Name is required.';
    // Email is now optional, but must be valid if provided
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
      await addQuery({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '', 
        message: formData.message,
        source: 'form'
      });

      await sendContactEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || 'Not provided',
        message: formData.message
      });

      setStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '', honeypot: '' });
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
        <div className="section-header text-center mb-2" data-aos="fade-up">
          <span className="subtitle">Get In Touch</span>
          <h2 className="title">Contact Us</h2>
          <div className="accent-bar mx-auto"></div>
        </div>

        <div className="contact-grid">
          <div className="contact-card form-container" data-aos="fade-right">
            <h3>Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'none' }}>
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex="-1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="button-primary w-full" 
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="status-msg success">Thank you! Your message has been sent successfully.</p>
              )}
              {status === 'error' && (
                <p className="status-msg error">{errorMessage}</p>
              )}
            </form>
          </div>

          <div className="contact-card map-container" data-aos="fade-left">
            <div className="map-info">
              <h3>Our Location</h3>
              <p>{mapData.address}</p>
            </div>
            <div className="google-map">
              <iframe
                title="Office Location"
                src={mapData.url}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .contact-section { background-color: var(--surface); }
        .subtitle { color: var(--accent); text-transform: uppercase; font-weight: 600; letter-spacing: 2px; font-size: 0.8rem; display: block; margin-bottom: 0.5rem; }
        .title { font-size: 2.5rem; }
        .accent-bar { width: 60px; height: 4px; background: var(--accent); margin: 1.5rem auto; }

        .contact-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .contact-card { background: white; border-radius: var(--radius-md); box-shadow: 0 10px 30px rgba(0,0,0,0.03); overflow: hidden; }
        .form-container { padding: 2.5rem; }
        .map-container { display: flex; flex-direction: column; }
        .map-info { padding: 2rem; border-bottom: 1px solid var(--border); }
        .map-info h3 { font-size: 1.3rem; margin-bottom: 0.5rem; }
        .google-map { flex-grow: 1; min-height: 300px; padding: 1rem; }

        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-size: 0.9rem; font-weight: 500; margin-bottom: 0.5rem; color: var(--primary); }
        .form-group input, .form-group textarea {
          width: 100%; padding: 0.8rem; border-radius: var(--radius-sm); border: 1.5px solid var(--border);
          font-family: inherit; transition: border-color 0.2s ease;
        }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: var(--accent); }
        .w-full { width: 100%; }
        .status-msg { margin-top: 1rem; font-size: 0.9rem; font-weight: 500; text-align: center; }
        .status-msg.success { color: #10b981; }
        .status-msg.error { color: #ef4444; }

        @media (max-width: 992px) {
          .contact-grid { grid-template-columns: 1fr; }
        }
        .mx-auto { margin-left: auto; margin-right: auto; }
      `}</style>
    </section>
  );
};

export default ContactForm;
