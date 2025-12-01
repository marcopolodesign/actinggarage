import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const MetaPixel: React.FC = () => {
  const location = useLocation();
  const PIXEL_ID = '737833792079548';

  useEffect(() => {
    // Initialize Facebook Pixel
    if (typeof window.fbq === 'undefined') {
      (function(f: any, b: any, e: string, v: string, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function() {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = true;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        'script',
        'https://connect.facebook.net/en_US/fbevents.js'
      );
    }

    // Initialize pixel and track initial page view
    if (typeof window.fbq !== 'undefined') {
      window.fbq('init', PIXEL_ID);
      window.fbq('track', 'PageView');
      console.log('Meta Pixel: Initialized with ID', PIXEL_ID);
    } else {
      console.warn('Meta Pixel: Failed to initialize - fbq not available');
    }
  }, []);

  useEffect(() => {
    // Track page view on route change
    if (typeof window.fbq !== 'undefined') {
      window.fbq('track', 'PageView');
    }
  }, [location]);

  return (
    <>
      {/* Noscript fallback for Meta Pixel */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
};

export default MetaPixel;

