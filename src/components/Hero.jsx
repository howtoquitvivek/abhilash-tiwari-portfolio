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
      </div>

      <style>{`
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: var(--header-height) 1rem 4rem;
          background: radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
          text-align: center;
          position: relative;
        }


        .hero-container {
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }


        .hero-title {
          font-size: clamp(2.8rem, 6vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .hero-title span {
          color: var(--brand-red);
        }

        .hero-subtitle {
          font-size: 1.35rem;
          color: var(--text-muted);
          max-width: 700px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .hero {
            padding: 10rem 1rem 5rem;
          }
          .hero-title {
            font-size: 2.2rem;
          }
          .hero-subtitle {
            font-size: 1.1rem;
          }
          .hero-actions {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .cta-button {
            width: 100%;
            max-width: 300px;
          }
        }

      `}</style>
    </section>
  );
};

export default Hero;
