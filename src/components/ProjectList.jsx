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
            border: 3px solid var(--neutral-200);
            border-top: 3px solid var(--brand-red);
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
          .error-message { color: var(--brand-error); font-weight: 500; }
        `}</style>
      </div>
    );
  }

  return (
    <section id="projects" className="projects-section section-pro">
      <div className="container-full">
        <div className="section-header-pro" data-aos="fade-up">
          <span className="subtitle-brand">OUR PROJECTS</span>
          <h2 className="title-brand">Effective Solutions in Construction</h2>
          <div className="brand-accent-line mx-auto"></div>
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
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="12" x2="2" y2="12"></line>
                <polyline points="9 19 2 12 9 5"></polyline>
              </svg>
            </button>
            <button className="swiper-button-next-custom">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <polyline points="15 5 22 12 15 19"></polyline>
              </svg>
            </button>






          </div>
        )}


      </div>

      <style>{`
        .projects-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 8rem 0;
          background-color: var(--bg-main);
          overflow: hidden;
        }




        .container-full {
          width: 100%;
          max-width: 100%;
          margin: 0;
          position: relative;
        }


        .section-header-pro {
          margin-bottom: 2rem;
        }
        .subtitle-brand {
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: var(--brand-red);
          text-transform: uppercase;
          display: block;
          margin-bottom: 0.25rem;
        }
        .title-brand {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--brand-black);
          letter-spacing: -0.02em;
        }
        .brand-accent-line {
          width: 40px;
          height: 3px;
          background: var(--brand-red);
          margin-top: 1rem;
        }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .text-center { text-align: center; }



        .carousel-wrapper {
          position: relative;
          margin-top: 1.5rem; /* Reduced from 5rem to match other sections */
          padding: 0; 
        }

        /* Essential for preventing shadow clipping */
        .projects-swiper {
          overflow: visible !important;
          padding-bottom: 4rem !important;
        }

        .project-slide-card {
          position: relative;
          padding-bottom: 10rem; /* Increased space for shadow and overlap */
        }


        .slide-image-container {
          width: 100%;
          height: 520px; /* Increased from 480px for a taller, more editorial look */
          border-radius: var(--radius-pro-inner);
          overflow: hidden;
          background: var(--bg-soft);
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
          bottom: 4.2rem; 
          left: 3%;
          right: 3%;
          background: var(--bg-main);
          padding: 2rem; 
          border-radius: var(--radius-pro-inner);

          box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.12);
          z-index: 2;
          border: 1px solid rgba(0,0,0,0.03);
          
          /* Fixed height and layout for uniform size */
          height: 220px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow: hidden;
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
          color: var(--text-main);

          margin-bottom: 0.6rem;
          letter-spacing: -0.01em;
          line-height: 1.2;
          text-transform: capitalize; /* Auto-correct casing */
        }


        .card-metadata {
          font-size: 0.95rem;
          color: var(--brand-info); /* Centralized Info color */
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .card-metadata strong {
          color: var(--brand-info);
          font-weight: 700;
          text-transform: capitalize; /* Auto-correct casing */
        }


        .meta-divider {
          color: var(--neutral-200);
          font-weight: 300;
        }

        .read-more-pill {
          padding: 0.8rem 2.5rem;
          border-radius: var(--radius-pill);
          border: 1.5px solid var(--brand-black);
          color: var(--brand-black);

          font-weight: 900;
          text-decoration: none;
          font-size: 0.9rem;
          white-space: nowrap;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .read-more-pill:hover {
          background: var(--brand-black);
          color: var(--text-white);
          transform: translateY(-2px);
        }


        .card-description-main {
          color: var(--text-muted);

          font-size: 1.05rem;
          line-height: 1.8;
          display: -webkit-box;
          -webkit-line-clamp: 3; /* Increased slightly */
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: auto; /* Push to bottom of content area but above pill */
        }


        /* Custom Arrows - Vertical Center of the Slide */
        .swiper-button-prev-custom, .swiper-button-next-custom {
          position: absolute;
          top: 45%; 
          transform: translateY(-6.5rem);
          width: 55px;
          height: 55px;
          background: var(--bg-main);
          border-radius: 50%;
          border: none;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 100;
          transition: all 0.3s ease;
          color: var(--brand-black);
        }


        .swiper-button-prev-custom { left: 12rem; }
        .swiper-button-next-custom { right: 12rem; }



        .swiper-button-prev-custom:hover, .swiper-button-next-custom:hover {
          background: var(--brand-black);
          color: var(--text-white);
          transform: translateY(-150%) scale(1.1);
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

          .swiper-button-prev-custom, .swiper-button-next-custom { width: 44px; height: 44px; }
        }
      `}</style>

    </section>
  );
};

export default ProjectList;
