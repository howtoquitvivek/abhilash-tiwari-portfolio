import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Hero from './components/Hero'
import Services from './components/Services'
import ProjectList from './components/ProjectList'
import ContactForm from './components/ContactForm'
import AdminDashboard from './pages/AdminDashboard'
import ProjectDetails from './pages/ProjectDetails'
import NotFound from './pages/NotFound'
import { useAOS } from './hooks/useAOS'
import CallPopup from './components/CallPopup'
import './App.css'
import { useLocation } from 'react-router-dom'

import { PORTFOLIO_THEME } from './themeConfig'

const ThemeInjector = () => (
  <style>{`
    :root {
      --p-color-rgb: ${PORTFOLIO_THEME.colors.primaryRgb};
      --s-color-rgb: ${PORTFOLIO_THEME.colors.secondaryRgb};
      --accent-rgb: ${PORTFOLIO_THEME.colors.accentRgb};
      
      --text-main: ${PORTFOLIO_THEME.colors.textMain};
      --text-muted: ${PORTFOLIO_THEME.colors.textMuted};
      
      --bg-soft: ${PORTFOLIO_THEME.colors.bgSoft};
      --border-subtle: ${PORTFOLIO_THEME.colors.borderSubtle};
      
      --radius-pro: ${PORTFOLIO_THEME.radius.pro};
      --radius-pro-inner: ${PORTFOLIO_THEME.radius.proInner};
      --radius-btn: ${PORTFOLIO_THEME.radius.btn};
      --radius-pill: ${PORTFOLIO_THEME.radius.pill};
    }
  `}</style>
);

// Scroll restoration helper
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  
  // Set to manual immediately to prevent browser anchor snapping
  if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  React.useEffect(() => {
    // Always start at top on path change to avoid seeing bottom of short page
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  
  return null;
};


const MainSite = () => {
  useAOS();
  return (
    <>
      <Helmet>
        <title>Builder in Jabalpur | Flats & Villas | Abhilash Construction</title>
        <meta name="keywords" content="builder in jabalpur, construction, flats, villas, real estate" />
        <meta property="og:title" content="Builder in Jabalpur | Flats & Villas | Abhilash Construction" />
      </Helmet>
      <Hero />
      <Services />
      <ProjectList />
      <ContactForm />
      <section className="seo-content" style={{ padding: '2rem 1.5rem', maxWidth: 'var(--container-max)', margin: '0 auto', color: 'var(--text-muted)' }}>
        <h2 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '1rem', fontWeight: '600' }}>Real Estate & Construction in Jabalpur</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.7', fontSize: '0.95rem' }}>Abhilash Construction is a trusted builder in Jabalpur offering premium flats, modern villas, and residential plots. We specialize in high-quality construction services in Jabalpur, delivering projects that combine design, durability, and affordability.</p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.7', fontSize: '0.95rem' }}>Whether you are looking for flats in Jabalpur, villas in Jabalpur, or plots for investment, we provide the best real estate solutions. Our team focuses on creating modern homes and commercial spaces that match your lifestyle and investment goals.</p>
        <p style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>With years of experience in real estate and construction in Jabalpur, we ensure timely delivery, transparent deals, and premium quality.</p>
      </section>
    </>
  );
};

const AdminPage = () => {
  return (
    <>
      <Helmet>
        <title>Admin Portal | Abhilash Construction</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminDashboard />
    </>
  );
};

const GlobalLoader = () => {
  const { pathname, hash } = useLocation();
  const [isVisible, setIsVisible] = React.useState(true);
  const [isAnimating, setIsAnimating] = React.useState(true);
  const prevPathRef = React.useRef(pathname);

  React.useEffect(() => {
    // Only trigger loader if the actual page path has changed
    if (prevPathRef.current !== pathname) {
      setIsVisible(true);
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => setIsVisible(false), 300);
      }, 400);

      prevPathRef.current = pathname;
      return () => clearTimeout(timer);
    } else {
      // If only hash changed, ensure loader is hidden
      setIsVisible(false);
      setIsAnimating(false);
    }
  }, [pathname, hash]);

  if (!isVisible) return null;

  return (
    <div className={`global-preloader ${isAnimating ? 'active' : 'exit'}`}>
      <div className="simple-spinner-pro"></div>
      <style>{`
        .global-preloader {
          position: fixed;
          inset: 0;
          background: rgba(5, 5, 5, 0.9);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.3s ease;
        }

        .global-preloader.exit {
          opacity: 0;
          pointer-events: none;
        }

        .simple-spinner-pro {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top: 3px solid var(--accent);
          border-radius: 50%;
          animation: spin 0.8s cubic-bezier(0.5, 0.1, 0.5, 0.9) infinite;
        }

        @keyframes spin { 
          from { transform: rotate(0deg); } 
          to { transform: rotate(360deg); } 
        }
      `}</style>
    </div>
  );
};


function App() {
  return (
    <HelmetProvider>
      <Router>
        <ThemeInjector />
        <ScrollToTop />
        <GlobalLoader />
        <div className="App">
          <Routes>
            {/* Main Site with Global Header/Footer */}
            <Route path="/" element={
              <>
                <Header />
                <main>
                  <MainSite />
                </main>
                <Footer />
                <CallPopup />
              </>
            } />
            
            {/* Project Details Page */}
            <Route path="/project/:projectId" element={
              <>
                <main>
                  <ProjectDetails />
                </main>
                <CallPopup />
              </>
            } />
            
            {/* Admin Portal - Full Viewport Experience */}

            <Route path="/admin" element={<AdminPage />} />
            
            {/* 404 Catch-All Route */}
            <Route path="*" element={
              <>
                <Header />
                <main>
                  <NotFound />
                </main>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
