import React from "react";

const Hero = () => {
  return (
    <section className="hero">
      
     
      <div className="overlay"></div>

      <div className="hero-container">
        <div className="hero-content">

          {/* Badge */}
          <div className="hero-badge">
            <span className="dot"></span>
            Trusted Builder Since 2005
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Building Excellence,
            <br />
            <span className="highlight">
              Redefining Jabalpur's Skyline
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Expert Builder, Promoter, and Civil Contractor dedicated to delivering{" "}
            <strong>premium residential</strong> and{" "}
            <strong>commercial spaces</strong>.
          </p>

          {/* Stats */}
          <div className="hero-stats">
            <div>
              <h3>150+</h3>
              <p>Projects</p>
            </div>
            <div>
              <h3>18+</h3>
              <p>Years</p>
            </div>
            <div>
              <h3>500+</h3>
              <p>Happy Families</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="hero-actions">
            <a href="#projects" className="btn primary">
              View Portfolio →
            </a>
            <a href="#contact" className="btn secondary">
              Contact Me
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
          color: white;

          background: url("https://images.unsplash.com/photo-1503387762-592deb58ef4e");
          background-size: cover;
          background-position: center;
        }

        /* DARK OVERLAY */
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            rgba(0,0,0,0.7),
            rgba(0,0,0,0.85)
          );
        }

        /* CENTER CONTAINER */
        .hero-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        /* CONTENT */
        .hero-content {
          text-align: center;
        }

        /* TITLE */
        .hero-title {
          font-size: clamp(2.8rem, 5vw, 4.5rem);
          font-weight: 700;
          line-height: 1.2;
        }

        .highlight {
          color: #f59e0b;
          position: relative;
        }

        .highlight::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 100%;
          height: 5px;
          background: #f59e0b;
          border-radius: 10px;
          opacity: 0.6;
        }

        /* SUBTITLE */
        .hero-subtitle {
          margin: 1.5rem auto;
          max-width: 650px;
          font-size: 1.2rem;
          color: #cbd5e1;
        }

        /* BADGE */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 50px;
          background: rgba(245,158,11,0.15);
          color: #f59e0b;
          font-size: 0.85rem;
          margin-bottom: 25px;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #f59e0b;
          border-radius: 50%;
        }

        /* STATS */
        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 2rem 0;
        }

        .hero-stats h3 {
          color: #f59e0b;
          font-size: 2rem;
        }

        .hero-stats p {
          color: #cbd5e1;
        }

        /* BUTTONS */
        .btn {
          padding: 12px 26px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: 0.3s;
        }

        .primary {
          background: linear-gradient(135deg, #f59e0b, #fbbf24);
          color: black;
        }

        .secondary {
          margin-left: 15px;
          color: white;
          border: 1px solid rgba(255,255,255,0.4);
        }

        @media(max-width:768px){
          .hero-stats{
            flex-direction: column;
            gap: 1rem;
          }
        }

      `}</style>
    </section>
  );
};

export default Hero;