import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content" data-aos="fade-up">
          <h1 className="hero-title">
            Building Excellence, <br />
            <span>Redefining Jabalpur's Skyline</span>
          </h1>
          <p className="hero-subtitle">
            Expert Builder, Promoter, and Civil Contractor dedicated to delivering premium residential and commercial spaces.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="cta-button button-primary">View Portfolio</a>
            <a href="#contact" className="cta-button button-outline">Contact Me</a>
          </div>
        </div>
        
        <div className="hero-image-wrap" data-aos="fade-left">
          <div 
            className="hero-placeholder-image" 
            role="img" 
            aria-label="Illustration of a major construction site in Jabalpur"
          >
             {/* Phase 2 Requirement: Solid black placeholder */}
          </div>
        </div>
      </div>

      <style>{`
        .hero {
          padding: 10rem 0 6rem;
          background: radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
        }

        .hero-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .hero-title span {
          color: var(--accent);
        }

        .hero-subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 500px;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
        }

        .hero-image-wrap {
          position: relative;
        }

        .hero-placeholder-image {
          width: 100%;
          aspect-ratio: 4/5;
          background-color: var(--primary);
          border-radius: var(--radius-lg);
          box-shadow: 20px 20px 60px rgba(0,0,0,0.1);
          transform: rotate(2deg);
        }

        .hero-placeholder-image::after {
          content: '';
          position: absolute;
          inset: -10px;
          border: 2px solid var(--accent);
          border-radius: var(--radius-lg);
          z-index: -1;
          transform: rotate(-4deg);
          opacity: 0.3;
        }

        @media (max-width: 992px) {
          .hero-container {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-subtitle {
            margin: 0 auto 2.5rem;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-placeholder-image {
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
