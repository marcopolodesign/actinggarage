import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FormFlyoutProvider } from './context/FormFlyoutContext';
import { AboutFlyoutProvider } from './context/AboutFlyoutContext';
import FormFlyout from './components/FormFlyout';
import AboutFlyout from './components/AboutFlyout';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import EulaDisclaimer from './components/EulaDisclaimer';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import './App.css';

function App() {
  return (
    <HelmetProvider>
      <FormFlyoutProvider>
        <AboutFlyoutProvider>
          <ScrollToTop />
          <PageTransition />
          <EulaDisclaimer />
          <div className="app">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cursos" element={<Cursos />} />
            </Routes>
            <FormFlyout />
            <AboutFlyout />
          </div>
        </AboutFlyoutProvider>
      </FormFlyoutProvider>
    </HelmetProvider>
  );
}

export default App;