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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProjects();
        setProjects(data);
        // Correctly calculate middle index within [1, data.length]
        const midIdx = Math.floor((data.length - 1) / 2) + 1;
        setActiveIndex(midIdx);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Sync scroll on hash load
  useEffect(() => {
    if (!isLoading && window.location.hash === '#projects') {
      const el = document.getElementById('projects');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [isLoading]);

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
            border-top: 3px solid var(--accent);
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
            <div className="item-counter-subtle">
              {activeIndex >= 1 && activeIndex <= projects.length ? (
                `${activeIndex} / ${projects.length}`
              ) : (
                <span className="info-tag">{activeIndex < 1 ? 'START' : 'END'}</span>
              )}
            </div>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={50}
              slidesPerView={1.2}
              centeredSlides={true}
              initialSlide={Math.floor((projects.length - 1) / 2) + 1}
              navigation={{
                prevEl: '.swiper-button-prev-custom',
                nextEl: '.swiper-button-next-custom',
              }}
              loop={false}
              onSlideChange={(swiper) => {
                // Prevent navigating to intro/outro slides
                if (swiper.activeIndex < 1) {
                  swiper.slideTo(1);
                } else if (swiper.activeIndex > projects.length) {
                  swiper.slideTo(projects.length);
                }
                setActiveIndex(swiper.activeIndex);
              }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              breakpoints={{
                768: { slidesPerView: 1.5, spaceBetween: 40 },
                1200: { slidesPerView: 1.8, spaceBetween: 60 },
              }}



              className="projects-swiper"
            >
              {/* INTRO TYPOGRAPHY SLIDE */}
              <SwiperSlide>
                <div className="typography-slide intro">
                  <div className="typo-glass-shine"></div>
                  <div className="typo-card-chip">
                    <svg width="50" height="40" viewBox="0 0 40 30" fill="none">
                      <rect width="50" height="40" rx="4" fill="rgba(255,255,255,0.1)" />
                      <path d="M10 0V30M20 0V30M30 0V30M0 10H40M0 20H40" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                    </svg>
                  </div>
                  <div className="typo-content-wrapper inward">
                    <span className="typo-subtitle">ESTABLISHED 2005</span>
                    <h2 className="typo-title">Building<br />Future</h2>
                    <div className="typo-accent-line intro-line"></div>
                  </div>
                  <div className="typo-card-number">EST. 2005 . JBP . IN</div>
                </div>
              </SwiperSlide>

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

              {/* OUTRO TYPOGRAPHY SLIDE */}
              <SwiperSlide>
                <div className="typography-slide outro">
                  <div className="typo-glass-shine"></div>
                  <div className="typo-card-chip">
                  </div>
                  <div className="typo-content-wrapper inward">
                    <span className="typo-subtitle">CONTACT US</span>
                    <h2 className="typo-title">Ready To<br />Build?</h2>
                    <div className="typo-accent-line"></div>
                    <a href="#contact" className="typo-cta">QUOTE</a>
                  </div>
                  <div className="typo-card-number">ABH . CONST . 2024</div>
                </div>
              </SwiperSlide>
            </Swiper>

            {/* Custom Navigation Arrows - Positioned Over Images */}
            <button
              className={`swiper-button-prev-custom ${activeIndex <= 1 ? 'nav-locked' : ''}`}
              onClick={(e) => activeIndex <= 1 && e.preventDefault()}
            >
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="12" x2="2" y2="12"></line>
                <polyline points="9 19 2 12 9 5"></polyline>
              </svg>
            </button>
            <button
              className={`swiper-button-next-custom ${activeIndex >= projects.length ? 'nav-locked' : ''}`}
              onClick={(e) => activeIndex >= projects.length && e.preventDefault()}
            >
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
          min-height: auto;
          padding: 8rem 0;
          background-color: var(--bg-main);
          overflow: hidden;
          position: relative;
        }

        .item-counter-subtle {
          position: absolute;
          top: -2.5rem;
          right: 3%;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-muted);
          opacity: 0.35;
          letter-spacing: 0.15em;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .info-tag {
          font-size: 0.75rem;
          background: rgba(var(--accent-rgb), 0.1);
          color: var(--accent);
          padding: 0.2rem 0.6rem;
          letter-spacing: 0.2em;
          font-weight: 850;
        }

        /* ULTRA-PREMIUM TYPOGRAPHY SLIDES (VIBRANT CARD DESIGN) */
        .typography-slide {
          height: 520px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem;
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: var(--radius-pro-inner);
          position: relative;
          overflow: hidden;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5);
          transition: all 0.5s ease;
        }

        /* The "Noise" and "Mesh" background layer */
        .typography-slide::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(var(--accent-rgb), 0.2) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(var(--accent-rgb), 0.15) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.4;
          mix-blend-mode: overlay;
          z-index: 1;
        }

        .typography-slide.intro {
          background: linear-gradient(135deg, #050505 0%, #1a0505 100%);
          align-items: flex-end;
          text-align: right;
        }

        .typography-slide.outro {
          background: linear-gradient(135deg, #1a0505 0%, #050505 100%);
          align-items: flex-start;
          text-align: left;
        }

        /* Glass Shine Effect */
        .typo-glass-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.05),
            transparent
          );
          transform: skewX(-25deg);
          transition: 0.75s;
          pointer-events: none;
          z-index: 2;
        }

        .typography-slide:hover .typo-glass-shine {
          left: 150%;
        }

        /* Card Chip Detail */
        .typo-card-chip {
          position: absolute;
          top: 2rem;
          left: 2rem;
          opacity: 0.5;
          z-index: 2;
          filter: grayscale(1) brightness(2);
        }

        .typography-slide.intro .typo-card-chip { left: auto; right: 2rem; }

        .typo-card-number {
          position: absolute;
          bottom: 2rem;
          left: 2.5rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.4em;
          z-index: 2;
        }

        .typography-slide.intro .typo-card-number { left: auto; right: 2.5rem; }

        .typo-content-wrapper.inward {
          max-width: 240px; 
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          position: relative;
          z-index: 5;
        }

        .typo-title {
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 900;
          line-height: 1;
          color: #ffffff; /* White for dark cards */
          margin: 0;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          text-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        .typo-subtitle {
          font-size: 0.7rem;
          font-weight: 850;
          color: var(--accent);
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }

        .typo-accent-line {
          width: 60px;
          height: 5px;
          background: var(--accent);
          box-shadow: 0 0 20px var(--accent-glow);
        }

        .intro-line {
          margin-left: auto;
        }

        .typo-cta {
          display: inline-flex;
          padding: 1.1rem 2.8rem;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          font-size: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .typo-cta::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transform: skewX(-25deg);
          transition: 0.5s;
        }

        .typo-cta:hover::before {
          left: 150%;
        }

        .typo-cta:hover {
          background: var(--accent);
          border-color: var(--accent);
          color: #ffffff;
          transform: translateY(-5px);
          box-shadow: 0 20px 40px var(--accent-glow);
        }

        /* MASTER SECTION HEADER */
        .section-header-pro {
          text-align: center;
          margin-bottom: 2.5rem; /* Reduced from 3.5rem to push content closer */
          width: 100%;
        }

        .brand-accent-line {
          width: 60px;
          height: 4px;
          background: var(--accent);
          margin: 1.2rem auto 0; /* Reduced from 1.5rem */
        }

        .container-full {
          width: 100%;
          max-width: 100%;
          margin: 0;
          position: relative;
        }


        .carousel-wrapper {
          margin-top: 2.5rem; /* Reduced from 3.5rem to push content closer */
          position: relative;
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
          padding: 0.8rem 1.8rem;
          border-radius: var(--radius-pill);
          border: 1px solid var(--p-color);
          color: var(--text-grey);

          font-weight: 400;
          text-decoration: none;
          font-size: 0.85rem;
          white-space: nowrap;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .read-more-pill:hover {
          background: var(--p-color);
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
          color: var(--p-color);
        }


        .swiper-button-prev-custom { left: 12rem; }
        .swiper-button-next-custom { right: 12rem; }



        .swiper-button-prev-custom:hover, .swiper-button-next-custom:hover {
          background: var(--p-color);
          color: var(--text-white);
          transform: translateY(-150%) scale(1.1);
        }

        .swiper-button-disabled,
        .swiper-button-prev-custom[disabled],
        .swiper-button-next-custom[disabled] {
          opacity: 0 !important;
          cursor: not-allowed !important;
          pointer-events: none;
          visibility: hidden;
        }

        /* Override for our custom boundary logic */
        .nav-locked {
          opacity: 0 !important;
          cursor: not-allowed !important;
          pointer-events: none;
          visibility: hidden;
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
