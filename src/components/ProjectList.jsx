import React, { useState, useEffect } from 'react';
import { getProjects } from '../services/projectService';

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
            border: 3px solid var(--surface);
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
          .error-message { color: #ef4444; font-weight: 500; }
        `}</style>
      </div>
    );
  }

  return (
    <section id="projects" className="projects-section">
      <div className="container">
        <div className="section-header text-center mb-2" data-aos="fade-up">
          <span className="subtitle">Outstanding Work</span>
          <h2 className="title">Portfolio Showcase</h2>
          <div className="accent-bar mx-auto"></div>
        </div>

        {projects.length === 0 ? (
          <p className="text-center text-muted">No projects found. Check back soon!</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <article 
                key={project.id} 
                className="project-card" 
              >
                <div className="project-image">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={`Project: ${project.title}`} />
                  ) : (
                    <div className="project-img-placeholder" role="img" aria-label="Project thumbnail placeholder"></div>
                  )}
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link" aria-label={`View details for project ${project.title}`}>
                      View Details <span>&rarr;</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .projects-section {
          background-color: white;
        }

        .subtitle {
          color: var(--accent);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 2px;
          font-size: 0.8rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .title {
          font-size: 2.5rem;
        }

        .accent-bar {
          width: 60px;
          height: 4px;
          background: var(--accent);
          margin: 1.5rem auto;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .project-card {
          background: white;
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border);
        }

        .project-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border-color: var(--accent);
        }

        .project-image {
          width: 100%;
          aspect-ratio: 16/10;
          overflow: hidden;
          background-color: var(--surface);
        }

        .project-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .project-card:hover .project-image img {
          transform: scale(1.05);
        }

        .project-img-placeholder {
          width: 100%;
          height: 100%;
          background: var(--primary);
        }

        .project-info {
          padding: 1.5rem;
        }

        .project-info h3 {
          font-size: 1.25rem;
          margin-bottom: 0.8rem;
        }

        .project-info p {
          color: var(--text-muted);
          font-size: 0.9rem;
          margin-bottom: 1.2rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .project-link {
          font-weight: 600;
          color: var(--accent);
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .project-link span {
          transition: transform 0.2s ease;
        }

        .project-link:hover span {
          transform: translateX(4px);
        }

        .mx-auto { margin-left: auto; margin-right: auto; }
      `}</style>
    </section>
  );
};

export default ProjectList;
