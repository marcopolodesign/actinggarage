import { Routes, Route } from 'react-router-dom';
import { FormFlyoutProvider } from './context/FormFlyoutContext';
import { AboutFlyoutProvider } from './context/AboutFlyoutContext';
import FormFlyout from './components/FormFlyout';
import AboutFlyout from './components/AboutFlyout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Cursos from './pages/Cursos';
import './App.css';

function App() {
  return (
    <FormFlyoutProvider>
      <AboutFlyoutProvider>
        <ScrollToTop />
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
  );
}

export default App;