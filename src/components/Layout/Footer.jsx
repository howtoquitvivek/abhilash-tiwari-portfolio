import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const year = new Date().getFullYear();

  if (location.pathname === '/admin') return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo mb-1">
              <span className="logo-text">AT</span>
              <span className="logo-brand">Construction</span>
            </div>
            <p className="footer-desc">
              Professional Builder & Promoter providing high-quality civil and construction services in Jabalpur.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <nav>
              <a href="#services">Services</a>
              <a href="#projects">Portfolio</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>

          <div className="footer-contact">
            <h4>Contact Info</h4>
            <p>Sobhapur Greens, Jabalpur</p>
            <p>Madhya Pradesh, India</p>
            <p className="mt-1">abhilash1919@gmail.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {year} Abhilash Tiwari Construction. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--primary);
          color: white;
          padding: 4rem 0 2rem;
        }

        .footer p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }

        .footer h4 {
          color: white;
          margin-bottom: 1.5rem;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr;
          gap: 4rem;
          margin-bottom: 3rem;
        }

        .footer-brand .logo-text {
          background: white;
          color: var(--primary);
        }

        .footer-brand .logo-brand {
          color: white;
        }

        .footer-links nav {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .footer-links a:hover {
          color: var(--accent);
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          text-align: center;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
