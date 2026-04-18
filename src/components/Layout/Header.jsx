import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { Facebook, Twitter, Instagram, Linkedin } from '../Shared/Icons';
import { getSettings } from '../../services/settingsService';


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [settings, setSettings] = useState(null);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Fetch settings for dynamic top bar
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Header settings fetch failed:', err);
      }
    };
    fetchSettings();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPath) return null;

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* PROFESSIONAL TOP BAR */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-info-left">
            <div className="top-item">
              <Phone size={13} className="mr-sm" />
              <span>{settings?.sitePhone || "+91 99812 34567"}</span>
            </div>
            <div className="top-item ml-4">
              <Mail size={13} className="mr-sm" />
              <span>{settings?.siteEmail || "info@abhilashtiwari.com"}</span>
            </div>
          </div>
          <div className="top-socials-right">
            <span className="social-label">Follow Us On:</span>
            <div className="social-icons">
              <a href={settings?.socialFb || "#"} aria-label="Facebook" target="_blank" rel="noreferrer"><Facebook size={14} /></a>
              <a href={settings?.socialTw || "#"} aria-label="X" target="_blank" rel="noreferrer"><Twitter size={14} /></a>
              <a href={settings?.socialInsta || "#"} aria-label="Instagram" target="_blank" rel="noreferrer"><Instagram size={14} /></a>
              <a href={settings?.socialLinked || "#"} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={14} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION */}
      <nav className="navbar glass">
        <div className="container nav-container">
          <div className="logo">
            <Link to="/">
              <div className="logo-icon-box">AT</div>
              <div className="logo-text-stack">
                <span className="logo-brand-main">ABHILASH</span>
                <span className="logo-brand-sub">CONSTRUCTION</span>
              </div>
            </Link>
          </div>

          <div className="nav-right-cluster">
            <div className="desktop-links">
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  window.history.pushState(null, '', '/');
                }}
                className={location.pathname === '/' && !location.hash ? 'active' : ''}
              >
                Home
              </a>
              <a href="/#services">Services</a>

              <a href="/#projects">Our Work</a>
              <a href="/#map-location">Visit Us</a>
            </div>

            <a href="/#contact" className="quote-btn-pro">
              GET A QUOTE
            </a>
          </div>
        </div>
      </nav>

      <style>{`
        .main-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        /* TOP BAR STYLING */
        .top-bar {
          background-color: var(--brand-red);
          color: var(--text-white);
          padding: 0.6rem 0;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .top-bar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .top-info-left { display: flex; align-items: center; }
        .top-item { display: flex; align-items: center; }
        .mr-sm { margin-right: 0.5rem; }
        .ml-4 { margin-left: 2rem; }

        .top-socials-right { display: flex; align-items: center; gap: 1rem; }
        .social-label { color: rgba(255, 255, 255, 0.8); font-size: 0.75rem; font-weight: 700; }
        .social-icons { display: flex; gap: 0.8rem; align-items: center; }
        .social-icons a { color: white; opacity: 0.9; transition: opacity 0.2s; display: flex; }
        .social-icons a:hover { opacity: 1; transform: scale(1.1); }

        /* NAVBAR STYLING */
        .navbar {
          padding: 1rem 0;
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid var(--border-subtle);
          transition: all 0.3s ease;
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* LOGO STYLING */
        .logo a { display: flex; align-items: center; gap: 0.8rem; }
        
        .logo-icon-box {
          background: var(--brand-black);
          color: white;
          padding: 0.4rem 0.6rem;
          border-radius: var(--radius-pro-sm);
          font-weight: 900;
          font-size: 1.2rem;
          line-height: 1;
        }

        .logo-text-stack { display: flex; flex-direction: column; line-height: 1; }
        .logo-brand-main { font-size: 1.4rem; font-weight: 900; color: var(--brand-black); letter-spacing: -0.02em; }
        .logo-brand-sub { font-size: 0.65rem; font-weight: 800; color: var(--brand-red); letter-spacing: 0.2em; margin-top: 0.1rem; }

        /* NAVIGATION LINKS */
        .nav-right-cluster { display: flex; align-items: center; gap: 3rem; }
        .desktop-links { display: flex; align-items: center; gap: 2rem; }
        .desktop-links a {
          color: var(--text-main);
          font-weight: 700;
          font-size: 0.95rem;
          position: relative;
          padding: 0.5rem 0;
        }

        .desktop-links a:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: var(--brand-red);
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .desktop-links a:hover:after, .desktop-links a.active:after { 
          transform: scaleX(1); 
        }


        /* QUOTE BUTTON */
        .quote-btn-pro {
          background-color: transparent;
          color: var(--brand-red);
          padding: 0.5rem 1.6rem;
          border-radius: var(--radius-pill);

          border: 2px solid var(--brand-red);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 0.03em;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .quote-btn-pro:hover {
          background-color: var(--brand-red);
          color: var(--text-white);
          box-shadow: 0 8px 20px var(--brand-red-glow);
        }


        /* SCROLLED STATE */
        .scrolled {
          transform: translateY(-38px); /* Height of the top bar */
        }
        .scrolled .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }


        @media (max-width: 1024px) {
          .nav-right-cluster { gap: 1.5rem; }
          .desktop-links { gap: 1rem; }
          .ml-4 { margin-left: 1rem; }
        }

        @media (max-width: 768px) {
          .top-bar { display: none; }
          .desktop-links { display: none; }
          .logo-brand-main { font-size: 1.2rem; }
          .quote-btn-pro { padding: 0.6rem 1.2rem; font-size: 0.8rem; }
        }
      `}</style>
    </header>
  );
};

export default Header;

