import React from "react";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-cinematic-overlay"></div>

      <div className="hero-container">
        <div className="hero-content">

          {/* BADGE: Standardized Pro Style */}
          <div className="hero-badge-pro" data-aos="fade-down" data-aos-duration="1000">
            <span className="dot-red pulse"></span>
            TRUSTED BUILDER SINCE 2005
          </div>

          {/* TITLE: Outfit Bold High-Contrast */}
          <h1 className="hero-title-pro" data-aos="fade-up" data-aos-delay="200">
            Crafting Premium Living Spaces in Jabalpur
            <br />
            <span className="text-accent-pro">
              Luxury Villas, Modern Flats & Prime Plots
            </span>
          </h1>

          {/* SUBTITLE: Refined Inter spacing */}
          <p className="hero-subtitle-pro" data-aos="fade-up" data-aos-delay="400">
            We are a trusted builder in Jabalpur creating modern flats, villas, and plots with quality construction and thoughtful design.
          </p>

          {/* STATS: Outfit Semibold */}
          <div className="hero-stats-pro" data-aos="fade-up" data-aos-delay="600">
            <div className="stat-item-pro">
              <h3>150+</h3>
              <p>PROJECTS</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item-pro">
              <h3>18+</h3>
              <p>YEARS</p>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item-pro">
              <h3>500+</h3>
              <p>FAMILIES</p>
            </div>
          </div>

          {/* ACTIONS: Synced with Header Pro Button */}
          <div className="hero-actions-pro" data-aos="fade-up" data-aos-delay="800">
            <a href="#projects" className="btn-pro primary">
              VIEW PROJECTS →
            </a>
            <a href="#contact" className="btn-pro outline">
              CONTACT ME
            </a>
          </div>

        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-white);
          background: url("https://images.unsplash.com/photo-1576577610667-c9ea0ac983fd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          padding-top: var(--header-height);
        }

        .hero-cinematic-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(var(--p-color-rgb), 0.4) 0%,
            rgba(var(--p-color-rgb), 0.85) 100%
          );
          z-index: 1;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: var(--container-max);
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          padding-top: 2rem; /* Added space above the glass pill badge */
        }

        /* BADGE PRO */
        .hero-badge-pro {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.6rem 1.4rem;
          background: rgba(var(--s-color-rgb), 0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(var(--s-color-rgb), 0.1);
          border-radius: var(--radius-pill);
          color: var(--text-white);
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          margin-bottom: 1.5rem; /* Reduced from 2.5rem */
        }

        .dot-red {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
          box-shadow: 0 0 12px var(--accent-glow);
        }

        .pulse { animation: heroPulse 1.5s infinite ease-in-out; }
        @keyframes heroPulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }

        /* TITLE PRO */
        .hero-title-pro {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(3rem, 7vw, 5.2rem);
          font-weight: 700;
          line-height: 1.2;
          letter-spacing: -0.5px;
          margin-bottom: 1rem; /* Reduced from 1.5rem */
          color: var(--text-white);
        }

        .text-accent-pro {
          color: var(--accent);
          position: relative;
          font-weight: 600;
          font-size: 0.82em;
          opacity: 0.92;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        /* SUBTITLE PRO */
        .hero-subtitle-pro {
          font-size: 1.25rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.65);
          max-width: 680px;
          margin: 0 auto 2.5rem; /* Reduced from 3.5rem */
          font-weight: 400;
          letter-spacing: 0.2px;
        }

        .hero-subtitle-pro strong {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        .hero-actions-pro {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .hero-actions-pro .btn-pro.primary:hover {
          background: var(--text-white);
          color: var(--p-color);
          box-shadow: 0 15px 40px rgba(255, 255, 255, 0.2);
        }

        /* STATS PRO */
        .hero-stats-pro {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3.5rem;
          margin-bottom: 2.8rem; /* Reduced from 3.5rem */
        }

        .stat-item-pro h3 {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--text-white);
          margin-bottom: 0.2rem;
          line-height: 1;
        }

        .stat-item-pro p {
          font-size: 0.75rem;
          font-weight: 850;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.4);
          margin: 0;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.15);
        }

        @media (max-width: 768px) {
          .hero-stats-pro {
            flex-direction: column;
            gap: 2rem;
          }
          .stat-divider { display: none; }
          .hero-actions-pro {
            flex-direction: column;
            gap: 1rem;
          }
          .hero-title-pro { font-size: 3.2rem; }
        }
      `}</style>
    </section>
  );
};

export default Hero;