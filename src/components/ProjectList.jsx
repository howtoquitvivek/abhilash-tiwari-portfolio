import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner mb-1"></div>
        <p>Loading our portfolio...</p>
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #e5e7eb;
            border-top: 3px solid #ef4444;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center py-5" role="alert">
        <p className="error-message">{error}</p>
        <style jsx>{`
          .error-message { color: #ef4444; font-weight: 500; }
        `}</style>
      </div>
    );
  }

  return (
    <section id="projects" className="projects-section">
      <div className="container-full">
        <div className="section-header-wrapper" data-aos="fade-up">
          <div className="section-header text-center mb-5">
            <span className="subtitle-premium">OUR PROJECTS —</span>
            <h2 className="title-premium">We Provide Effective Solution in Construction</h2>
          </div>
        </div>


        {projects.length === 0 ? (
          <p className="text-center text-muted py-5">No projects found. Check back soon!</p>
        ) : (
          <div className="carousel-wrapper" data-aos="fade-up">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={50}
              slidesPerView={1.2}
              centeredSlides={true}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                768: { slidesPerView: 1.5, spaceBetween: 40 },
                1200: { slidesPerView: 1.8, spaceBetween: 60 },
              }}



              className="projects-swiper"
            >
              {projects.map((project) => (
                <SwiperSlide key={project.id}>
                  <div className="project-slide-card">
                    <Link to={`/project/${project.id}`} className="slide-image-container">
                      {project.imageUrl ? (
                        <img src={project.imageUrl} alt={project.title} className="slide-image" />
                      ) : (
                        <div className="slide-placeholder"></div>
                      )}
                    </Link>

                    <div className="slide-content-card">
                      <div className="card-top-row">
                        <div className="card-meta-left">
                          <h3 className="card-title-main">{project.title}</h3>
                          <div className="card-metadata">
                            <span className="meta-item">Client: <strong>{project.client || 'Simbuilt'}</strong></span>
                            <span className="meta-divider">|</span>
                            <span className="meta-item">Location: <strong>{project.location || 'Bhopal, Victoria'}</strong></span>
                          </div>
                        </div>
                        <Link to={`/project/${project.id}`} className="read-more-pill">Read More</Link>
                      </div>

                      <p className="card-description-main">
                        {project.description || 'This structural renovation project included installing technology and study pods, a custom-built stage made of Tasmanian oak, community spaces and an outdoor deck.'}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows - Positioned Over Images */}
            <button className="swiper-button-prev-custom">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <button className="swiper-button-next-custom">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

          </div>
        )}

        {/* Section Footer Buttons */}
        <div className="projects-footer" data-aos="fade-up">
          <button className="footer-btn btn-all">All Project</button>
          <button className="footer-btn btn-contact">Contact Us</button>
        </div>
      </div>

      <style>{`
        .projects-section {
          padding: 8rem 0;
          background-color: #ffffff;
          overflow: hidden;
        }

        .container-full {
          width: 100%;
          max-width: 100%;
          margin: 0;
          position: relative;
        }


        .section-header-wrapper {
          width: 90%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .subtitle-premium {
          color: #ef4444; 
          font-weight: 800;
          letter-spacing: 0.1em;
          font-size: 0.85rem;
          display: block;
          margin-bottom: 1rem;
        }

        .title-premium {
          font-size: 3.5rem;
          line-height: 1.1;
          color: #111827;
          max-width: 800px;
          margin: 0 auto;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .carousel-wrapper {
          position: relative;
          margin-top: 5rem;
          padding: 0; /* Full edge-to-edge */
        }


        .project-slide-card {
          position: relative;
          padding-bottom: 8rem; /* Space for the overlapping card */
        }

        .slide-image-container {
          width: 100%;
          height: 620px; /* Consistent tall height from reference */
          border-radius: 12px;
          overflow: hidden;
          background: #f3f4f6;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
          display: block;
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .project-slide-card:hover .slide-image {
          transform: scale(1.05);
        }

        .slide-content-card {
          position: absolute;
          bottom: 2rem; /* Adjusted for better overlap */
          left: 8%;
          right: 8%;
          background: #ffffff;
          padding: 3rem; /* Generous padding as per reference */
          border-radius: 16px;
          box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.12);
          z-index: 2;
          border: 1px solid rgba(0,0,0,0.03);
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 2rem;
        }

        .card-title-main {
          font-size: 2rem;
          font-weight: 900;
          color: #111827;
          margin-bottom: 0.6rem;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .card-metadata {
          font-size: 0.95rem;
          color: #3b82f6; /* Soft blue metadata from reference */
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .card-metadata strong {
          color: #3b82f6;
          font-weight: 700;
        }

        .meta-divider {
          color: #e5e7eb;
          font-weight: 300;
        }

        .read-more-pill {
          padding: 0.8rem 2.5rem;
          border-radius: 100px;
          border: 1.5px solid #111827;
          color: #111827;
          font-weight: 900;
          text-decoration: none;
          font-size: 0.9rem;
          white-space: nowrap;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .read-more-pill:hover {
          background: #111827;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .card-description-main {
          color: #6b7280;
          font-size: 1.05rem;
          line-height: 1.8;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom Arrows - Vertical Center of the Slide */
        .swiper-button-prev-custom, .swiper-button-next-custom {
          position: absolute;
          top: 45%; 
          transform: translateY(-50%);
          width: 54px;
          height: 54px;
          background: #ffffff;
          border-radius: 50%;
          border: none;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          color: #111827;
        }

        .swiper-button-prev-custom { left: 2rem; }
        .swiper-button-next-custom { right: 2rem; }


        .swiper-button-prev-custom:hover, .swiper-button-next-custom:hover {
          background: #111827;
          color: #ffffff;
          transform: translateY(-50%) scale(1.1);
        }

        /* Section Footer */
        .projects-footer {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 6rem;
        }

        .footer-btn {
          padding: 1.5rem 5rem;
          border-radius: 100px;
          font-weight: 950;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.02em;
        }

        .btn-all {
          background: #2563eb;
          color: #ffffff;
          border: none;
        }

        .btn-all:hover {
          background: #1d4ed8;
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.25);
        }

        .btn-contact {
          background: #f3f4f6;
          color: #111827;
          border: 1px solid #e5e7eb;
        }

        .btn-contact:hover {
          background: #e5e7eb;
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }

        @media (max-width: 1200px) {
          .slide-content-card { padding: 2.5rem; left: 5%; right: 5%; }
          .card-title-main { font-size: 1.7rem; }
          .slide-image-container { height: 520px; }
        }

        @media (max-width: 768px) {
          .title-premium { font-size: 2.5rem; }
          .carousel-wrapper { padding: 0 1rem; }
          .slide-image-container { height: 450px; }
          .card-top-row { flex-direction: column; align-items: flex-start; gap: 1.2rem; }
          .read-more-pill { width: 100%; text-align: center; }
          .slide-content-card { padding: 2rem; bottom: 1rem; }
          .projects-footer { flex-direction: column; padding: 0 1.5rem; }
          .footer-btn { width: 100%; padding: 1.2rem; }
          .swiper-button-prev-custom, .swiper-button-next-custom { width: 44px; height: 44px; }
        }
      `}</style>

    </section>
  );
};

export default ProjectList;
