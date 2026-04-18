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
    <section className="services">
      <div className="container">

        {/* HEADER */}
        <div className="section-header">
          <div className="top-line">
            <span></span>
            <p>WHAT WE DO</p>
          </div>

          <h2>
            Our Specialized <span className="highlight">Services</span>
          </h2>

          <p className="subtitle">
            Decades of expertise delivered with unmatched precision and craftsmanship.
          </p>
        </div>

        <div className="content">

          {/* LEFT */}
          <div className="left">
            <div className="grid">
              {services.map((item, i) => (
                <div key={i} className="card">
                  <div className="icon">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="right">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5"
              alt="construction"
            />
          </div>

        </div>
      </div>

      <style>{`

        .services {
          padding: 6rem 0;
          background: #f8fafc;
        }

        .services .container {
          max-width: 1150px;
          margin: auto;
          padding: 0 1.5rem;
        }

        /* HEADER */
        .services .section-header {
          margin-bottom: 3rem;
        }

        .services .top-line {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
        }

        .services .top-line span {
          width: 40px;
          height: 2px;
          background: #c89a2a;
        }

        .services .top-line p {
          font-size: 0.75rem;
          letter-spacing: 3px;
          color: #c89a2a;
        }

        .services h2 {
          font-size: 2.5rem;
          font-weight: 600;
          color: #1e293b;
          font-family: Georgia, serif;
        }

        .services .highlight {
          color: #c89a2a;
          font-style: italic;
        }

        .services .subtitle {
          color: #64748b;
          margin-top: 10px;
          max-width: 450px;
        }

        /* CONTENT */
        .services .content {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 3rem;
          align-items: center;
        }

        /* GRID */
        .services .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        /* CARD */
        .services .card {
          position: relative;
          overflow: hidden;
          background: white;
          padding: 1.8rem;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          transition: 0.3s;
          border: 1px solid rgba(0,0,0,0.04);
        }

        .services .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        /* GOLD LINE */
        .services .card::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          width: 0%;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          transition: 0.4s;
        }

        .services .card:hover::before {
          width: 100%;
        }

        /* ICON */
        .services .icon {
          width: 45px;
          height: 45px;
          border-radius: 10px;
          background: rgba(245,158,11,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f59e0b;
          margin-bottom: 10px;
          transition: 0.3s;
        }

        .services .card:hover .icon {
          background: #f59e0b;
          color: black;
        }

        /* TEXT */
        .services h4 {
          margin-bottom: 8px;
          font-size: 1.05rem;
          color: #1e293b;
        }

        .services .card p {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.5;
        }

        /* IMAGE BIG HEIGHT */
        .services .right img {
          width: 100%;
          height: 500px; /* 🔥 height increase */
          object-fit: cover;
          border-radius: 20px;
          transform: scale(1.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.2);
        }

        /* RESPONSIVE */
        @media(max-width:768px){
          .services .content{
            grid-template-columns: 1fr;
          }

          .services .grid{
            grid-template-columns: 1fr;
          }

          .services .right img {
            height: 350px;
          }
        }

      `}</style>
    </section>
  );
};

export default Services;