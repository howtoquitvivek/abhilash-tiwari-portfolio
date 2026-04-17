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
import { useAOS } from './hooks/useAOS'
import CallPopup from './components/CallPopup'
import './App.css'

const MainSite = () => {
  useAOS();
  return (
    <>
      <Helmet>
        <title>Abhilash Tiwari | Professional Builder & Promoter in Jabalpur</title>
        <meta name="description" content="Expert Civil Contractor and Developer specializing in high-quality residential construction at Sobhapur Greens, Jabalpur. Trusted name in Jabalpur real estate." />
        <meta name="keywords" content="Construction, Civil Contractor, Jabalpur, Real Estate, Builder, Abhilash Tiwari, Sobhapur Greens" />
      </Helmet>
      <Hero />
      <Services />
      <ProjectList />
      <ContactForm />
    </>
  );
};

const AdminPage = () => {
  return (
    <>
      <Helmet>
        <title>Admin Portal | Abhilash Tiwari Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <AdminDashboard />
    </>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
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
            
            {/* Admin Portal - Full Viewport Experience */}
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  )
}

export default App
