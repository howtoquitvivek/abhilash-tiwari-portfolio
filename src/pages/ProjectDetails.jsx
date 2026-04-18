import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProject } from '../services/projectService';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { useAOS } from '../hooks/useAOS';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProjectDetails = () => {
  useAOS();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const data = await getProject(projectId);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Project not found or failed to load.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>REFINING DETAILS...</p>
        <style>{`

          .loading-screen {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--bg-main);
            color: var(--text-main);

          }
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid var(--border-subtle);
            border-top: 3px solid var(--brand-red);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="error-screen container py-5 text-center">
        <h2>Oops!</h2>
        <p>{error || 'Project not found.'}</p>
        <Link to="/" className="button-primary mt-2">Back to Portfolio</Link>
        <style>{`

          .error-screen { height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        `}</style>
      </div>
    );
  }

  // Helper to render map
  const renderMap = () => {
    if (!project.mapEmbedUrl) return null;

    // If it's an iframe string, we need to extract the src or just dangerously set it
    // For safety, we'll try to extract the src if it's a full iframe tag
    let mapSrc = project.mapEmbedUrl;
    if (project.mapEmbedUrl.includes('<iframe')) {
      const match = project.mapEmbedUrl.match(/src="([^"]+)"/);
      if (match) mapSrc = match[1];
    }

    return (
      <div className="map-container mt-4" data-aos="fade-up">
        <h3 className="section-title-sm mb-2">PROJECT LOCATION</h3>
        <div className="map-wrapper">
          <iframe
            src={mapSrc}
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: 'var(--radius-pro-inner)' }}

            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Project Location"
          ></iframe>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>{project.title} | Projects | Abhilash Tiwari</title>
        <meta name="description" content={project.description?.substring(0, 160)} />
      </Helmet>
      
      <Header />

      <main className="project-details-page">
        {/* Editorial Gallery Section */}
        <section className="project-gallery-section" data-aos="fade-in">
          <div className="container-full">
            <div className="gallery-masonry">
              {project.media && project.media.length > 0 ? (
                project.media.map((item, index) => (
                  <div key={index} className={`gallery-item item-${(index % 5) + 1}`}>
                    <img src={item.url} alt={`${project.title} - ${index}`} className="gallery-image" />
                    <div className="gallery-overlay">
                      <div className="glass-label">
                        <span className="label-text">VIEW FULL</span>
                        <span className="label-arrow">→</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="gallery-item item-1">
                  <img src={project.imageUrl} alt={project.title} className="gallery-image" />
                </div>
              )}
            </div>
          </div>
        </section>


        {/* Info Section */}
        <section className="project-info-section py-5">
          <div className="container">
            <div className="info-grid">
              <div className="info-main" data-aos="fade-right">
                <span className="category-tag">{project.category || 'Construction'}</span>
                <h1 className="project-title-large">{project.title}</h1>
                <div className="project-meta-strip mt-2">
                  <div className="meta-block">
                    <span className="meta-label">LOCATION</span>
                    <span className="meta-value">{project.location || 'N/A'}</span>
                  </div>

                  {project.link && (
                    <div className="meta-block">
                      <span className="meta-label">WEBSITE</span>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="meta-value link">Visit Site</a>
                    </div>
                  )}
                </div>
                
                <div className="description-content mt-4">
                  <h3 className="section-title-sm mb-1">PROJECT OVERVIEW</h3>
                  <p className="large-text">{project.description}</p>
                </div>
              </div>

              <div className="info-sidebar" data-aos="fade-left">
                {renderMap()}
                
                <div className="contact-cta-box mt-3">
                  <h4>Interested in a similar project?</h4>
                  <p>Let's discuss how we can bring your vision to life.</p>
                  <Link to="/" className="button-primary w-100 text-center mt-2">Get in Touch</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`

        .project-details-page {
          background: var(--bg-main);
          padding-top: var(--header-height); /* Dynamic header height */
        }



        .container-full { width: 94%; max-width: 1700px; margin: 0 auto; }

        .gallery-masonry {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 250px;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .gallery-item {
          position: relative;
          border-radius: var(--radius-pro);
          overflow: hidden;
          background: var(--bg-soft);

          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .gallery-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .gallery-item:hover .gallery-image {
          transform: scale(1.08);
        }

        /* Span logic for masonry feel */
        .item-1 { grid-column: span 2; grid-row: span 2; } /* Large featured */
        .item-2 { grid-column: span 1; grid-row: span 2; } /* Tall */
        .item-3 { grid-column: span 1; grid-row: span 1; } /* Small square */
        .item-4 { grid-column: span 2; grid-row: span 1; } /* Wide */
        .item-5 { grid-column: span 1; grid-row: span 2; } /* Tall */

        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 2rem;
          background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .glass-label {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.8rem 1.8rem;
          border-radius: var(--radius-pill);
          display: flex;
          align-items: center;
          gap: 1.2rem;
          color: var(--text-white);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);

          transform: translateY(10px);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .gallery-item:hover .glass-label {
          transform: translateY(0);
        }

        .label-text {
          font-weight: 800;
          letter-spacing: 0.1rem;
          font-size: 0.75rem;
        }

        .label-arrow {
          font-size: 1.2rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 4rem;
          margin-top: 3rem;
        }

        .category-tag {
          color: var(--brand-red);

          font-weight: 800;
          letter-spacing: 0.1em;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .project-title-large {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
          margin: 0.5rem 0 1.5rem;
          color: var(--text-main);
          text-transform: capitalize;
        }


        .project-meta-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 3rem;
          padding: 2rem 0;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }


        .meta-block {
          display: flex;
          flex-direction: column;
        }

        .meta-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);

          margin-bottom: 0.4rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .meta-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          text-transform: capitalize;
        }



        .meta-value.link {
          color: #2563eb;
          text-decoration: underline;
        }

        .large-text {
          font-size: 1.2rem;
          line-height: 1.8;
          color: var(--text-muted);
          white-space: pre-line;
        }


        .section-title-sm {
          font-size: 1rem;
          font-weight: 850;
          color: var(--text-main);
          letter-spacing: 0.02em;
        }


        .map-wrapper {
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          border-radius: var(--radius-pro-inner);
          overflow: hidden;
        }


        .contact-cta-box {
          background: var(--bg-soft);
          padding: 2.5rem;
          border-radius: var(--radius-pro-inner);
          border: 1px solid var(--border-subtle);
        }


        .contact-cta-box h4 {
          font-weight: 800;
          font-size: 1.3rem;
          margin-bottom: 0.8rem;
        }

        .contact-cta-box p {
          color: #4b5563;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 1200px) {
          .gallery-masonry { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 1024px) {
          .gallery-masonry { grid-template-columns: repeat(2, 1fr); padding: 0 1rem; }
          .info-grid { grid-template-columns: 1fr; gap: 3rem; }
          .project-title-large { font-size: 3rem; }
        }

        @media (max-width: 768px) {
          .gallery-masonry { grid-template-columns: 1fr; grid-auto-rows: auto; gap: 1rem; }
          .gallery-item { border-radius: var(--radius-pro-inner); min-height: 250px; }

          .item-1, .item-2, .item-3, .item-4, .item-5 { grid-column: span 1; grid-row: span 1; }
          .project-title-large { font-size: 2.2rem; }
          .project-meta-strip { gap: 1.5rem; }
          .meta-value { font-size: 1rem; }
        }

      `}</style>
    </>
  );
};

export default ProjectDetails;
