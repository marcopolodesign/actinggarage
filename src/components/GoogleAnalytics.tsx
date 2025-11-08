import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GoogleAnalytics: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'AW-17688095812', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;


