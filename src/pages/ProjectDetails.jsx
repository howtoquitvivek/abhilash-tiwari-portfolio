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

// ── NEW: Lightbox component ──────────────────────────────────────────────────
const Lightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose}>&#10005;</button>
      <img
        className="lightbox-img"
        src={imageUrl}
        alt="Preview"
        onClick={(e) => e.stopPropagation()}
      />
      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
          animation: lb-fade 0.25s ease;
        }
        @keyframes lb-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .lightbox-img {
          max-width: 90vw;
          max-height: 90vh;
          object-fit: contain;
          border-radius: 2px;
          cursor: default;
          animation: lb-scale 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 40px 80px rgba(0,0,0,0.6);
        }
        @keyframes lb-scale {
          from { transform: scale(0.88); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .lightbox-close {
          position: fixed;
          top: 1.25rem;
          right: 1.5rem;
          z-index: 10000;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          font-size: 1rem;
          width: 2.4rem;
          height: 2.4rem;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
          line-height: 1;
        }
        .lightbox-close:hover {
          background: rgba(255,255,255,0.22);
        }
      `}</style>
    </div>
  );
};
// ── END: Lightbox component ──────────────────────────────────────────────────

const GalleryItem = ({ item, index, projectTitle, patternClass, onImageClick }) => {
  // ── NEW: onImageClick prop added above — no other change ──
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, opacity: 0 });
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / (rect.height / 2) * -8;
    const rotateY = (x - centerX) / (rect.width / 2) * 8;

    const shinePos = (x / rect.width) * 100;
    const shineY = (y / rect.height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setShine({ x: shineX, y: shineY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setShine(prev => ({ ...prev, opacity: 0 }));
    setIsPressed(false);
  };

  return (
    <div
      className={`masonry-item ${patternClass} interactive-card ${isPressed ? 'pressed' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={() => onImageClick(item.url)}
      style={{
        transform: `perspective(1000px) 
                    rotateX(${rotation.x}deg) 
                    rotateY(${rotation.y}deg) 
                    ${isPressed ? 'translateZ(60px) scale(1.05)' : 'translateZ(0) scale(1.02)'}`,
      }}
    >
      <div
        className="card-shine"
        style={{
          background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,${shine.opacity * 0.15}) ${shine.x}%, transparent ${shine.x + 15}%)`,
        }}
      />
      <div className="card-parallax-container">
        <img
          src={item.url}
          alt={`${projectTitle} gallery ${index}`}
          className="masonry-img"
          style={{
            transform: `translate3d(${rotation.y * -0.3}px, ${rotation.x * 0.3}px, 0) scale(1.12)`
          }}
        />
      </div>
      <div className="card-info-peek">
        <span className="peek-index">{String(index + 1).padStart(2, '0')}</span>
        <span className="peek-label">PROJECT VIEW</span>
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  useAOS();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── NEW: lightbox state ──────────────────────────────────────────────────
  const [lightboxUrl, setLightboxUrl] = useState(null);
  // ── END: lightbox state ──────────────────────────────────────────────────

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

  const renderMap = () => {
    if (!project.mapEmbedUrl) return null;

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

      {/* ── NEW: render lightbox when an image is selected ─────────────── */}
      {lightboxUrl && (
        <Lightbox imageUrl={lightboxUrl} onClose={() => setLightboxUrl(null)} />
      )}
      {/* ── END: lightbox render ────────────────────────────────────────── */}

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
          font-size: 1rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin-top: 0;
          padding: 1.2rem 1.8rem;
          background: rgba(var(--p-color-rgb), 0.02);
          border: 1px solid var(--border-subtle);
          border-left: 3px solid var(--brand-red);
          font-style: italic;
          max-width: 550px;
        }

        .title-desc-flex {
          display: flex;
          align-items: flex-start;
          gap: 2rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
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
          text-transform: capitalize;
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

        .project-gallery-section {
          padding: 3rem 0 8rem;
          background: var(--bg-main);
        }

        .gallery-container-pro {
          width: 86%;
          max-width: 1300px;
          margin: 0 auto;
        }

        .masonry-grid-pro {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 160px;
          gap: 1.15rem 1.15rem;
        }

        .masonry-item {
          position: relative;
          border-radius: 0;
          overflow: hidden;
          background: #000;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.6s ease;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .interactive-card {
          cursor: pointer;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }

        .interactive-card:hover {
          box-shadow: 0 30px 60px -10px rgba(0,0,0,0.4);
          z-index: 10;
        }

        .interactive-card.pressed {
          box-shadow: 0 80px 140px -20px rgba(0,0,0,0.6);
          transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .card-shine {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          mix-blend-mode: overlay;
          transition: opacity 0.5s ease;
        }

        .card-parallax-container {
          width: 100%;
          height: 100%;
          overflow: hidden;
          transform-style: preserve-3d;
        }

        .masonry-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.1s linear;
          pointer-events: none;
          -webkit-user-drag: none;
        }

        .card-info-peek {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          z-index: 6;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          opacity: 0;
          transform: translate3d(0, 10px, 20px);
          transition: all 0.4s ease;
          pointer-events: none;
        }

        .interactive-card:hover .card-info-peek {
          opacity: 1;
          transform: translate3d(0, 0, 40px);
        }

        .peek-index {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: var(--accent);
          font-weight: 850;
          letter-spacing: 0.05em;
        }

        .peek-label {
          font-size: 0.55rem;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.3em;
          font-weight: 700;
          text-transform: uppercase;
        }

        .span-2-2 { grid-column: span 2; grid-row: span 2; }
        .span-1-2 { grid-column: span 1; grid-row: span 2; }
        .span-1-1 { grid-column: span 1; grid-row: span 1; }
        .span-2-1 { grid-column: span 2; grid-row: span 1; }

        .map-card-pro {
          background: var(--bg-soft);
          border: 1px solid var(--border-subtle);
          border-radius: 0;
          overflow: hidden;
          box-shadow: var(--shadow-pro);
        }

        @media (max-width: 1024px) {
          .masonry-grid-pro { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .masonry-grid-pro { grid-template-columns: 1fr; grid-auto-rows: auto; }
          .span-2-2, .span-1-2, .span-1-1, .span-2-1 { grid-column: span 1; grid-row: span 1; }
          .masonry-item { height: 180px; }
          .project-title-xl { font-size: 2.5rem; }
        }

        /* ============================================
           RESPONSIVE MEDIA QUERIES — ADDED AT END
           Breakpoints: 1024px | 768px | 480px
        ============================================ */

        /* ── Laptop / Large Tablet (≤ 1024px) ── */
        @media (max-width: 1024px) {
          .hero-split-pro {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-map-wrapper {
            width: 100%;
            height: 260px;
          }

          .metadata-grid-pro {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.15rem;
          }

          .project-body-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .project-body-section {
            padding: 4rem 0;
          }

          .gallery-container-pro {
            width: 92%;
          }

          .masonry-grid-pro {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 180px;
            gap: 1.15rem 1.15rem;
          }

          .span-2-2 { grid-column: span 2; grid-row: span 2; }
          .span-1-2 { grid-column: span 1; grid-row: span 2; }
          .span-2-1 { grid-column: span 2; grid-row: span 1; }
          .span-1-1 { grid-column: span 1; grid-row: span 1; }

          .project-gallery-section {
            padding: 2.5rem 0 5rem;
          }
        }

        /* ── Tablet (≤ 768px) ── */
        @media (max-width: 768px) {
          .project-hero-header {
            padding: 2.5rem 0 2rem;
          }

          .hero-split-pro {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .title-desc-flex {
            flex-direction: column;
            gap: 1.25rem;
            margin-bottom: 2rem;
          }

          .hero-desc-pro {
            max-width: 100%;
            font-size: 0.95rem;
            padding: 1rem 1.25rem;
          }

          .project-title-xl {
            font-size: clamp(1.6rem, 5vw, 2.4rem);
          }

          .metadata-grid-pro {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem 1.5rem;
          }

          .meta-value-pro {
            font-size: 1rem;
          }

          .hero-map-wrapper {
            height: 220px;
          }

          .project-body-section {
            padding: 3rem 0;
          }

          .project-body-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }

          .description-editorial {
            font-size: 1.1rem;
          }

          .gallery-container-pro {
            width: 94%;
          }

          .masonry-grid-pro {
            grid-template-columns: repeat(2, 1fr);
            grid-auto-rows: 160px;
            gap: 1.15rem 1.15rem;
            grid-auto-flow: dense;
          }

          .span-2-2 { grid-column: span 2; grid-row: span 1; }
          .span-1-2 { grid-column: span 1; grid-row: span 1; }
          .span-2-1 { grid-column: span 2; grid-row: span 1; }
          .span-1-1 { grid-column: span 1; grid-row: span 1; }

          .masonry-item { height: 160px; }

          .project-gallery-section {
            padding: 2rem 0 4rem;
          }

          .section-title-editorial {
            font-size: 1.25rem;
          }
        }

        /* ── Mobile (≤ 480px) ── */
        @media (max-width: 480px) {
          .project-hero-header {
            padding: 2rem 0 1.5rem;
          }

          .hero-split-pro {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .category-pill {
            font-size: 0.65rem;
            letter-spacing: 0.1em;
            margin-bottom: 0.5rem;
          }

          .project-title-xl {
            font-size: clamp(1.4rem, 7vw, 2rem);
            letter-spacing: -0.01em;
          }

          .title-desc-flex {
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .hero-desc-pro {
            max-width: 100%;
            font-size: 0.875rem;
            padding: 0.875rem 1rem;
            border-left-width: 3px;
          }

          .metadata-grid-pro {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem 1rem;
            padding-top: 1.25rem;
          }

          .meta-label-pro {
            font-size: 0.62rem;
          }

          .meta-value-pro {
            font-size: 0.9rem;
          }

          .hero-map-wrapper {
            height: 180px;
          }

          .project-body-section {
            padding: 2.5rem 0;
          }

          .project-body-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .description-editorial {
            font-size: 1rem;
            line-height: 1.7;
          }

          .editorial-accent-line {
            width: 36px;
            height: 3px;
            margin-bottom: 1.5rem;
          }

          .section-title-editorial {
            font-size: 1.15rem;
            margin-bottom: 1rem;
          }

          .gallery-container-pro {
            width: 96%;
          }

          .masonry-grid-pro {
            grid-template-columns: 1fr;
            grid-auto-rows: auto;
            gap: 1.15rem 1.15rem;
            grid-auto-flow: dense;
          }

          .span-2-2,
          .span-1-2,
          .span-1-1,
          .span-2-1 {
            grid-column: span 1;
            grid-row: span 1;
          }

          .masonry-item {
            height: 200px;
          }

          .project-gallery-section {
            padding: 1.5rem 0 3.5rem;
          }

          .card-info-peek {
            bottom: 1rem;
            left: 1rem;
          }

          .peek-index {
            font-size: 0.65rem;
          }

          .peek-label {
            font-size: 0.48rem;
            letter-spacing: 0.2em;
          }
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
                  const patterns = ['span-2-2', 'span-1-2', 'span-1-1', 'span-2-1', 'span-1-2'];
                  const patternClass = patterns[index % patterns.length];

                  return (
                    <GalleryItem
                      key={index}
                      item={item}
                      index={index}
                      projectTitle={project.title}
                      patternClass={patternClass}
                      onImageClick={setLightboxUrl}
                    />
                  );
                })
              ) : (
                <GalleryItem
                  item={{ url: project.imageUrl }}
                  index={0}
                  projectTitle={project.title}
                  patternClass="span-2-2"
                  onImageClick={setLightboxUrl}
                />
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