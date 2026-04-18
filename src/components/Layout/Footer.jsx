import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Send, Globe, Phone, Mail, MapPin } from 'lucide-react';

// Custom Brand SVGs to match high-end style (Lucide removed them in latest versions)
const Facebook = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Twitter = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Instagram = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Linkedin = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Footer = () => {
  const location = useLocation();
  const year = new Date().getFullYear();

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Column 1: Brand & Socials */}
          <div className="footer-section brand-col" data-aos="fade-up">
            <div className="footer-logo mb-2">
              <span className="logo-accent"></span>
              <div className="logo-text-group">
                <h2 className="logo-title">ABHILASH</h2>
                <p className="logo-subtitle">CONSTRUCTION & DEVELOPMENT</p>
              </div>
            </div>
            <p className="footer-description">
              Professional Builder & Promoter providing high-quality civil and construction services. Dedicated to structural excellence and high-end residential development in Jabalpur.
            </p>
            <div className="social-icon-row mt-2">
              <a href="#" className="social-pill"><Facebook size={18} strokeWidth={2.5} /></a>
              <a href="#" className="social-pill"><Twitter size={18} strokeWidth={2.5} /></a>
              <a href="#" className="social-pill"><Instagram size={18} strokeWidth={2.5} /></a>
              <a href="#" className="social-pill"><Send size={18} strokeWidth={2.5} /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-section" data-aos="fade-up" data-aos-delay="100">
            <h4 className="section-header">SOCIAL LINKS</h4>
            <ul className="footer-links-list">
              <li><a href="#"><Instagram size={14} className="inline-icon" /> Instagram</a></li>
              <li><a href="#"><Linkedin size={14} className="inline-icon" /> LinkedIn</a></li>
              <li><a href="#"><Globe size={14} className="inline-icon" /> Website</a></li>
              <li><a href="#"><Send size={14} className="inline-icon" /> WhatsApp</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-section" data-aos="fade-up" data-aos-delay="200">
            <h4 className="section-header">CONTACT US</h4>
            <div className="contact-info-stack">
              <div className="contact-item">
                <MapPin size={16} className="contact-icon" />
                <p>Sobhapur Greens, Jabalpur<br />Madhya Pradesh, 482002</p>
              </div>
              <div className="contact-item">
                <Phone size={16} className="contact-icon" />
                <p>+91 (998) 123-4567</p>
              </div>
              <div className="contact-item">
                <Mail size={16} className="contact-icon" />
                <p>abhilash1919@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom mt-5">
          <p className="copyright-text">© Copyright Abhilash Construction {year}. All rights reserved.</p>
        </div>
      </div>

      <style>{`
        .footer {
          background-color: var(--brand-black);
          color: var(--text-white);

          padding: 4.5rem 0 3rem;
          font-family: 'Inter', sans-serif;
        }


        .container {
          width: 90%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 6rem;
        }

        /* Logo Area */
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .logo-accent {
          width: 6px;
          height: 38px;
          background-color: var(--brand-red); /* Construction Red */
          border-radius: 2px;

        }

        .logo-title {
          font-size: 1.8rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          line-height: 1;
          margin: 0;
          color: var(--text-white);
        }


        .logo-subtitle {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: var(--brand-red);
          margin: 0.2rem 0 0;

          text-transform: uppercase;
        }

        .footer-description {
          font-size: 0.95rem;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 1.5rem;
          max-width: 400px;
        }

        /* Social Icon Row */
        .social-icon-row {
          display: flex;
          gap: 1.2rem;
        }

        .social-pill {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-white);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }


        .social-pill:hover {
          background: var(--text-white);
          color: var(--brand-black);
          border-color: var(--text-white);
          transform: translateY(-5px);
        }


        /* Links & Headers */
        .section-header {
          font-size: 0.85rem;
          font-weight: 850;
          letter-spacing: 0.15em;
          color: var(--text-white);
          margin-bottom: 2.5rem;

          text-transform: uppercase;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links-list li {
          margin-bottom: 1.2rem;
        }

        .footer-links-list a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          transition: all 0.3s ease;
        }

        .footer-links-list a:hover {
          color: var(--text-white);
          transform: translateX(5px);
        }


        .inline-icon {
          opacity: 0.5;
        }

        /* Contact Stack */
        .contact-info-stack {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .contact-item {
          display: flex;
          gap: 1.2rem;
          align-items: flex-start;
        }

        .contact-icon {
          color: var(--brand-red);
          margin-top: 0.3rem;
          flex-shrink: 0;
        }


        .contact-item p {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }

        /* Footer Bottom */
        .footer-bottom {
          padding-top: 4rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }

        .copyright-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.02em;
        }

        @media (max-width: 1024px) {
          .footer-grid { gap: 3rem; }
        }

        @media (max-width: 768px) {
          .footer { padding: 5rem 0 3rem; }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
          .footer-description { max-width: 100%; }
          .section-header { margin-bottom: 1.5rem; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
