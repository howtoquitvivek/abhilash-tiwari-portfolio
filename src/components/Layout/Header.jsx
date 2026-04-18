import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname === '/admin';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`glass sticky-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <Link to="/">
            <span className="logo-text">AT</span>
            <span className="logo-brand">Construction</span>
          </Link>
        </div>
        
        {!isAdminPath && (
          <nav className="desktop-nav">
            <a href="/#services">Services</a>
            <a href="/#projects">Projects</a>
            <a href="/#contact">Contact</a>
            <a href="/#contact" className="cta-button button-primary small">Let's Talk</a>
          </nav>

        )}
      </div>

      <style>{`
        .sticky-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.5rem 0;
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }

        .sticky-nav.scrolled {
          padding: 0.8rem 0;
          background: rgba(255, 255, 255, 0.85);
          border-bottom-color: var(--border);
        }

        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1.25rem;
          line-height: 1;
        }

        .logo-text {
          background: var(--primary);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-sm);
        }

        .logo-brand {
          color: var(--primary);
          letter-spacing: -0.01em;
        }


        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }

        .desktop-nav a {
          font-weight: 500;
          color: var(--primary-light);
          font-size: 0.95rem;
        }

        .desktop-nav a:hover {
          color: var(--accent);
        }

        .cta-button.small {
          padding: 0.5rem 1.2rem;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
