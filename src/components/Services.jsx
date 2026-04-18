import React from 'react';

const services = [
  {
    title: 'Professional Builder',
    description: 'Specialized in high-quality residential construction with attention to structural integrity and premium finishes.',
    icon: '🏗️'
  },
  {
    title: 'Real Estate Promoter',
    description: 'Transforming visions into reality through strategic planning and promotion of premium commercial and housing projects.',
    icon: '🤝'
  },
  {
    title: 'Civil Contractor',
    description: 'Reliable civil services including structural development, renovations, and large-scale infrastructure projects.',
    icon: '🛠️'
  }
];

const Services = () => {
  return (
    <section id="services" className="services-section section-pro">
      <div className="container">
        <div className="section-header-pro" data-aos="fade-up">
          <span className="subtitle-brand">WHAT WE DO</span>
          <h2 className="title-brand">Our Specialized Services</h2>
          <div className="brand-accent-line mx-auto"></div>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="service-card" 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
            >
              <div className="service-icon" aria-hidden="true">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .services-section {
          background-color: var(--surface);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1.5rem; /* Standardized spacing */
        }

        .service-card {
          background: var(--bg-main);
          padding: 3rem 2rem;
          border-radius: var(--radius-pro-inner);
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          text-align: center;
        }

        .service-card:hover {
          transform: translateY(-10px);
          border-bottom-color: var(--accent);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        .service-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          background: var(--surface);
          width: 80px;
          height: 80px;
          line-height: 80px;
          border-radius: 50%;
        }

        .service-card h3 {
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .service-card p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .mx-auto { margin-left: auto; margin-right: auto; }
      `}</style>
    </section>
  );
};

export default Services;
