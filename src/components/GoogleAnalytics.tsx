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
    // Track page view on route change for both Google Ads and Google Analytics
    if (typeof window.gtag !== 'undefined') {
      // Track for Google Ads
      window.gtag('config', 'AW-17688095812', {
        page_path: location.pathname + location.search,
      });
      // Track for Google Analytics
      window.gtag('config', 'G-0SN6DF363M', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

export default GoogleAnalytics;


