import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { FormFlyoutProvider } from './context/FormFlyoutContext';
import { AboutFlyoutProvider } from './context/AboutFlyoutContext';
import FormFlyout from './components/FormFlyout';
import AboutFlyout from './components/AboutFlyout';
import AutoOpenForm from './components/AutoOpenForm';
import LeadPopup from './components/LeadPopup';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import EulaDisclaimer from './components/EulaDisclaimer';
import EmailFooter from './components/EmailFooter';
import WhatsAppButton from './components/WhatsAppButton';
import GoogleAnalytics from './components/GoogleAnalytics';
import MetaPixel from './components/MetaPixel';
import { captureUtms } from './utils/utm';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import CourseLanding from './pages/CourseLanding';
import Dashboard from './pages/Dashboard';
import LandingSales from './pages/LandingSales';
import LandingJovenes from './pages/LandingJovenes';
import Referido from './pages/Referido';
import ContratoFirma from './pages/ContratoFirma';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isContractPage = location.pathname.startsWith('/contrato');
  const isStandalonePage = location.pathname.startsWith('/referido');

  useEffect(() => { captureUtms(); }, [location.search]);

  return (
    <div className="app">
      {!isContractPage && !isStandalonePage && <WhatsAppButton />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        {/* Consolidated into /jovenes 2026-07-23 — keep old course URLs redirecting for SEO/bookmarks */}
        <Route path="/cursos/garage-mini-kids" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/cursos/garage-kids" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/cursos/garage-new-generation" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/cursos/garage-new-generation-cinema" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/cursos/garage-new-generation-hybrid" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/cursos/:slug" element={<CourseLanding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/landing-sales" element={<LandingSales />} />
        {/* Backwards-compatible aliases (ads / bookmarks) */}
        <Route path="/landing-hybrid" element={<CourseLandingRedirect to="/cursos/garage-hybrid" />} />
        <Route path="/landing-hybrid-plus" element={<CourseLandingRedirect to="/cursos/garage-hybrid-plus" />} />
        <Route path="/landing-mini-kids" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/landing-kids" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/landing-new-generation" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/landing-new-generation-camara" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/landing-new-generation-hybrid" element={<CourseLandingRedirect to="/jovenes" />} />
        <Route path="/jovenes" element={<LandingJovenes />} />
        <Route path="/contrato/:token" element={<ContratoFirma />} />
        <Route path="/referido" element={<Referido />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/terminos" element={<Terminos />} />
      </Routes>
      <FormFlyout />
      <AboutFlyout />
      {!isContractPage && !isStandalonePage && <EmailFooter />}
    </div>
  );
}

function CourseLandingRedirect({ to }: { to: string }) {
  // Keep UTM params when redirecting.
  const location = useLocation();
  const target = `${to}${location.search || ''}`;
  return <Navigate to={target} replace />;
}

function App() {
  return (
    <HelmetProvider>
      <FormFlyoutProvider>
        <AboutFlyoutProvider>
          <GoogleAnalytics />
          <MetaPixel />
          <ScrollToTop />
          <PageTransition />
          <EulaDisclaimer />
          <AutoOpenForm />
          <LeadPopup />
          <AppContent />
        </AboutFlyoutProvider>
      </FormFlyoutProvider>
    </HelmetProvider>
  );
}

export default App;