import { useEffect } from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';

const META_SOURCES = ['meta', 'facebook', 'instagram'];

/**
 * AutoOpenForm component
 * Automatically opens the form flyout when URL contains:
 * - Hash: #modal or #form
 * - Query param: ?modal=1 or ?openForm=1
 * - Meta paid traffic: utm_source=meta|facebook|instagram + utm_medium=paid (1.5s delay)
 */
const AutoOpenForm: React.FC = () => {
  const { openFlyout } = useFormFlyout();

  useEffect(() => {
    // Check for hash-based trigger (#modal)
    const hash = window.location.hash;
    if (hash === '#modal' || hash === '#form') {
      openFlyout();
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const modalParam = urlParams.get('modal');
    const openFormParam = urlParams.get('openForm');

    // Explicit trigger params — open immediately
    if (modalParam === '1' || modalParam === 'true' || openFormParam === '1' || openFormParam === 'true') {
      openFlyout();
      urlParams.delete('modal');
      urlParams.delete('openForm');
      const newSearch = urlParams.toString();
      window.history.replaceState(null, '', window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash);
      return;
    }

    // Meta paid traffic — open after short delay so the page settles first
    const utmSource = (urlParams.get('utm_source') || '').toLowerCase();
    const utmMedium = (urlParams.get('utm_medium') || '').toLowerCase();
    const isPaidMeta = META_SOURCES.includes(utmSource) && utmMedium === 'paid';

    if (isPaidMeta) {
      const timer = setTimeout(() => openFlyout(), 1500);
      return () => clearTimeout(timer);
    }
  }, [openFlyout]);

  return null;
};

export default AutoOpenForm;




