import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Abhilash Construction</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="not-found-container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', fontFamily: "'Outfit', sans-serif", color: 'var(--p-color)', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', fontFamily: "'Outfit', sans-serif", color: 'var(--text-main)', marginBottom: '2rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '400px' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn-pro primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.8rem', borderRadius: 'var(--radius-btn)', background: 'var(--p-color)', color: 'var(--text-white)', textDecoration: 'none', fontWeight: '600' }}>
          Go Back Home
        </Link>
      </div>
    </>
  );
};

export default NotFound;
