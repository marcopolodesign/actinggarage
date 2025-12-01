import { Routes, Route } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';
import './App.css';

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
          <WhatsAppButton />
          <AutoOpenForm />
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cursos" element={<Cursos />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <FormFlyout />
            <AboutFlyout />
            <EmailFooter />
          </div>
        </AboutFlyoutProvider>
      </FormFlyoutProvider>
    </HelmetProvider>
  );
}

export default App;