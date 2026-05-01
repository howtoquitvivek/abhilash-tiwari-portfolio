import React from "react";
import { Building2, Handshake, Wrench, ClipboardList } from "lucide-react";

const services = [
  {
    title: "Premium Residential Projects",
    desc: "We offer real estate services in Jabalpur including modern luxury villas and affordable flats tailored to your lifestyle.",
    icon: <Building2 size={22} />
  },
  {
    title: "Property Investment",
    desc: "Secure your future with prime plots in Jabalpur and high-yield commercial spaces designed for excellent returns.",
    icon: <Handshake size={22} />
  },
  {
    title: "Civil Construction Services",
    desc: "Expert civil contractors dedicated to building your dream house with top-tier quality and budget-friendly solutions.",
    icon: <Wrench size={22} />
  },
  {
    title: "Real Estate Development",
    desc: "Seamless project management for expansive villas and premium flats, balancing luxury living with smart property investment.",
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
      <h2 className="title-brand">
  Complete Real Estate & Construction Solutions <span className="title-accent-gold">in Jabalpur</span>
</h2>
          <div className="brand-accent-line mx-auto"></div>
        </div>

        <div className="services-content-grid" data-aos="fade-up" data-aos-delay="200">

          {/* LEFT: Service Cards Grid */}
          <div className="services-grid-wrapper">
            <div className="services-inner-grid">
              {services.map((item, i) => (
                <div key={i} className="service-card-pro" data-aos="fade-up" data-aos-delay={(i + 1) * 100} data-aos-duration="800" data-aos-easing="ease-in-out">
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
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&fm=webp"
                alt="Real estate and construction services in Jabalpur MP"
                className="editorial-image"
                width="800"
                height="600"
                loading="lazy"
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
          padding: 8rem 0;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .services-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: stretch;
          margin-top: 3.5rem;
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
          transition: transform 0.4s ease-in-out, box-shadow 0.4s ease-in-out;
          position: relative;
          overflow: hidden;
          height: 220px;
          display: flex;
          flex-direction: column;
        }

        .service-card-pro:hover {
          transform: translateY(-5px) scale(1.03);
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
          height: 462px;
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

        /* ── NEW: golden italic accent on heading word ── */
        .title-accent-gold {
          color: var(--accent);
          font-style: italic;
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