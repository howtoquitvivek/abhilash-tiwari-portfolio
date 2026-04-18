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
      <style>{`
        .project-details-page {
          background: var(--bg-main);
          padding-top: var(--header-height);
          min-height: 100vh;
        }

        .project-hero-header {
          padding: 3.5rem 0 2.5rem;
          background: var(--bg-soft);
          border-bottom: 1px solid var(--border-subtle);
        }

        .hero-split-pro {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 4rem;
          align-items: center;
        }

        .category-pill {
          color: var(--accent);
          font-weight: 850;
          letter-spacing: 0.15em;
          font-size: 0.75rem;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .project-title-xl {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 900;
          color: var(--p-color);
          line-height: 1.1;
          margin: 0;
          letter-spacing: -0.02em;
          text-transform: capitalize;
        }

        .hero-desc-pro {
          font-size: 1.1rem;
          line-height: 1.7;
          color: var(--text-muted);
          margin-top: 0.5rem;
          padding-left: 1.5rem;
          border-left: 2px solid var(--brand-red);
          font-style: italic; /* Added Italic */
          max-width: 600px;
        }

        .title-desc-flex {
          display: flex;
          align-items: center;
          gap: 1.5rem; /* Tightened Gap */
          margin-bottom: 2.5rem;
        }

        .metadata-grid-pro {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          padding: 1.5rem 0 0;
          border-top: 1px solid var(--border-subtle);
        }

        .meta-item-pro {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meta-label-pro {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .meta-value-pro {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--p-color);
          text-transform: capitalize; /* Added for Title Case */
        }

        .meta-value-pro.link {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 1px solid rgba(var(--accent-rgb), 0.3);
          display: inline-block;
          transition: all 0.3s ease;
        }

        .meta-value-pro.link:hover {
          border-bottom-color: var(--accent);
          transform: translateY(-2px);
        }

        .hero-map-wrapper {
          width: 100%;
          height: 220px;
          border-radius: 0;
          overflow: hidden;
          background: var(--bg-main);
          border: 1px solid var(--border-subtle);
          position: relative;
        }

        .hero-map-iframe {
          width: 100%;
          height: 100%;
          border: 0;
          filter: grayscale(1) contrast(1.1) brightness(1.1);
        }

        /* BODY CONTENT */
        .project-body-section {
          padding: 6rem 0;
        }

        .project-body-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 5rem;
          align-items: start;
        }

        .description-editorial {
          font-size: 1.25rem;
          line-height: 1.8;
          color: var(--text-muted);
          white-space: pre-line;
        }

        .editorial-accent-line {
          width: 50px;
          height: 4px;
          background: var(--accent);
          margin-bottom: 2.5rem;
        }

        .section-title-editorial {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--p-color);
          margin-bottom: 1.5rem;
          letter-spacing: -0.01em;
        }

        /* GALLERY SECTION */
        .project-gallery-section {
          padding: 3rem 0 8rem; /* Space after compact header */
          background: var(--bg-main);
        }

        .gallery-container-pro {
          width: 94%;
          max-width: 1600px;
          margin: 0 auto;
        }

        .masonry-grid-pro {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 280px;
          gap: 1.5rem;
        }

        .masonry-item {
          position: relative;
          border-radius: 0; /* Removed rounding */
          overflow: hidden;
          background: var(--bg-soft);
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .masonry-item:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }

        .masonry-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1s ease;
        }

        .masonry-item:hover .masonry-img {
          transform: scale(1.1);
        }

        /* Masonry Spans */
        .span-2-2 { grid-column: span 2; grid-row: span 2; }
        .span-1-2 { grid-column: span 1; grid-row: span 2; }
        .span-1-1 { grid-column: span 1; grid-row: span 1; }
        .span-2-1 { grid-column: span 2; grid-row: span 1; }

        .map-card-pro {
          background: var(--bg-soft);
          border: 1px solid var(--border-subtle);
          border-radius: 0; /* Removed rounding */
          overflow: hidden;
          box-shadow: var(--shadow-pro);
        }

        @media (max-width: 1024px) {
          .masonry-grid-pro { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .masonry-grid-pro { grid-template-columns: 1fr; grid-auto-rows: auto; }
          .span-2-2, .span-1-2, .span-1-1, .span-2-1 { grid-column: span 1; grid-row: span 1; }
          .masonry-item { height: 300px; }
          .project-title-xl { font-size: 2.5rem; }
        }
      `}</style>

      <main className="project-details-page">
        {/* PROJECT HERO HEADER */}
        <header className="project-hero-header">
          <div className="container" data-aos="fade-up">
            <div className="hero-split-pro">
              <div className="hero-info-pro">
                <span className="category-pill">{project.category || 'Portfolio'} Project</span>
                
                <div className="title-desc-flex">
                  <h1 className="project-title-xl">{project.title}</h1>
                  {project.description && (
                    <div className="hero-desc-pro">
                      {project.description}
                    </div>
                  )}
                </div>
                
                <div className="metadata-grid-pro">
                  <div className="meta-item-pro">
                    <span className="meta-label-pro">Client</span>
                    <span className="meta-value-pro">{project.client || 'Private Client'}</span>
                  </div>
                  <div className="meta-item-pro">
                    <span className="meta-label-pro">Project Type</span>
                    <span className="meta-value-pro">{project.category || 'Architecture'}</span>
                  </div>
                  {project.location && (
                    <div className="meta-item-pro">
                      <span className="meta-label-pro">Location</span>
                      <span className="meta-value-pro">{project.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {project.mapEmbedUrl && (
                <div className="hero-map-wrapper" data-aos="fade-left">
                  <iframe
                    src={project.mapEmbedUrl.includes('<iframe') 
                      ? project.mapEmbedUrl.match(/src="([^"]+)"/)?.[1] 
                      : project.mapEmbedUrl}
                    className="hero-map-iframe"
                    title="Project Location"
                    loading="lazy"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* GALLERY SECTION (Directly after Hero) */}
        <section className="project-gallery-section" data-aos="fade-up">
          <div className="gallery-container-pro">
            <div className="masonry-grid-pro">
              {project.media && project.media.length > 0 ? (
                project.media.map((item, index) => {
                  // Cycle through masonry patterns
                  const patterns = ['span-2-2', 'span-1-2', 'span-1-1', 'span-2-1', 'span-1-2'];
                  const patternClass = patterns[index % patterns.length];
                  
                  return (
                    <div key={index} className={`masonry-item ${patternClass}`}>
                      <img src={item.url} alt={`${project.title} gallery ${index}`} className="masonry-img" />
                    </div>
                  );
                })
              ) : (
                <div className="masonry-item span-2-2">
                  <img src={project.imageUrl} alt={project.title} className="masonry-img" />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetails;
