import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FormFlyoutProvider } from './context/FormFlyoutContext';
import { AboutFlyoutProvider } from './context/AboutFlyoutContext';
import FormFlyout from './components/FormFlyout';
import AboutFlyout from './components/AboutFlyout';
import AutoOpenForm from './components/AutoOpenForm';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import EulaDisclaimer from './components/EulaDisclaimer';
import EmailFooter from './components/EmailFooter';
import WhatsAppButton from './components/WhatsAppButton';
import GoogleAnalytics from './components/GoogleAnalytics';
import MetaPixel from './components/MetaPixel';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import CourseLanding from './pages/CourseLanding';
import Dashboard from './pages/Dashboard';
import LandingSales from './pages/LandingSales';
import LandingJovenes from './pages/LandingJovenes';
import ContratoFirma from './pages/ContratoFirma';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isContractPage = location.pathname.startsWith('/contrato');

  return (
    <div className="app">
      {!isContractPage && <WhatsAppButton />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cursos" element={<Cursos />} />
        <Route path="/cursos/:slug" element={<CourseLanding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/landing-sales" element={<LandingSales />} />
        {/* Backwards-compatible aliases (ads / bookmarks) */}
        <Route path="/landing-hybrid" element={<CourseLandingRedirect to="/cursos/garage-hybrid" />} />
        <Route path="/landing-hybrid-plus" element={<CourseLandingRedirect to="/cursos/garage-hybrid-plus" />} />
        <Route path="/landing-mini-kids" element={<CourseLandingRedirect to="/cursos/garage-mini-kids" />} />
        <Route path="/landing-kids" element={<CourseLandingRedirect to="/cursos/garage-kids" />} />
        <Route path="/landing-new-generation" element={<CourseLandingRedirect to="/cursos/garage-new-generation" />} />
        <Route path="/landing-new-generation-camara" element={<CourseLandingRedirect to="/cursos/garage-new-generation-cinema" />} />
        <Route path="/landing-new-generation-hybrid" element={<CourseLandingRedirect to="/cursos/garage-new-generation-hybrid" />} />
        <Route path="/jovenes" element={<LandingJovenes />} />
        <Route path="/contrato/:token" element={<ContratoFirma />} />
      </Routes>
      <FormFlyout />
      <AboutFlyout />
      {!isContractPage && <EmailFooter />}
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
          <AppContent />
        </AboutFlyoutProvider>
      </FormFlyoutProvider>
    </HelmetProvider>
  );
}

export default App;