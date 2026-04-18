import React from "react";
import { Building2, Handshake, Wrench, ClipboardList } from "lucide-react";

const services = [
  {
    title: "Professional Builder",
    desc: "Specialized in high-quality residential construction with attention to structural integrity and premium finishes.",
    icon: <Building2 size={22} />
  },
  {
    title: "Real Estate Promoter",
    desc: "Transforming visions into reality through strategic planning and promotion of premium commercial and housing projects.",
    icon: <Handshake size={22} />
  },
  {
    title: "Civil Contractor",
    desc: "Reliable civil services including structural development, renovations, and large-scale infrastructure projects.",
    icon: <Wrench size={22} />
  },
  {
    title: "Project Management",
    desc: "Seamless coordination from start to finish – ensuring timely delivery and budget control.",
    icon: <ClipboardList size={22} />
  }
];

const Services = () => {
  return (
    <section id="services" className="services-section">
      <div className="container">

        {/* STANDARDIZED PRO HEADER */}
        <div className="section-header-pro" data-aos="fade-up">
          <span className="subtitle-brand">WHAT WE DO</span>
          <h2 className="title-brand">Our Specialized Services</h2>
          <div className="brand-accent-line mx-auto"></div>
        </div>

        <div className="services-content-grid" data-aos="fade-up" data-aos-delay="200">

          {/* LEFT: Service Cards Grid */}
          <div className="services-grid-wrapper">
            <div className="services-inner-grid">
              {services.map((item, i) => (
                <div key={i} className="service-card-pro">
                  <div className="service-icon-box">{item.icon}</div>
                  <h3 className="service-card-title">{item.title}</h3>
                  <p className="service-card-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: High-Impact Image */}
          <div className="services-image-panel">
            <div className="image-frame-pro">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5"
                alt="Professional Construction Jabalpur"
                className="editorial-image"
              />
              {/* Optional Decoration */}
              <div className="image-decorator-pro"></div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .services-section {
          background-color: var(--bg-main);
          min-height: auto;
          padding: 8rem 0; /* Synced with ProjectList padding */
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .services-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem; /* Increased for professional breathing room */
          align-items: stretch;
          margin-top: 3.5rem; /* Synced with standardized header spacing */
          max-width: 1200px;
          width: 90%;
          margin-left: auto;
          margin-right: auto;
        }

        .services-inner-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        /* SERVICE CARD PRO */
        .service-card-pro {
          background: var(--bg-soft);
          padding: 1.5rem;
          border-radius: var(--radius-pro-inner);
          border: 1px solid var(--border-subtle);
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
          height: 220px; /* Reduced from 230px */
          display: flex;
          flex-direction: column;
        }

        .service-card-pro:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        .service-icon-box {
          width: 48px;
          height: 48px;
          background: rgba(var(--accent-rgb), 0.08); 
          color: var(--accent);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .service-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--p-color);
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }

        .service-card-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
        }

        /* IMAGE PANEL */
        .services-image-panel {
          position: relative;
          height: 462px; /* Perfectly synced with 2 rows of 220px cards + 1.5rem gap */
        }

        .image-frame-pro {
          position: relative;
          border-radius: var(--radius-pro);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          height: 100%; 
        }

        .editorial-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-decorator-pro {
          position: absolute;
          bottom: 25px;
          right: 25px;
          width: 100px;
          height: 100px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-radius: 15px;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .services-content-grid {
            grid-template-columns: 1fr;
            max-width: 700px;
          }
          .services-image-panel {
            height: 400px;
          }
        }

        @media (max-width: 640px) {
          .services-inner-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;