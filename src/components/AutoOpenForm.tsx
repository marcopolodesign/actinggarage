import { useEffect } from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';

/**
 * AutoOpenForm component
 * Opens the form flyout when URL contains:
 * - Hash: #modal or #form
 * - Query param: ?modal=1 or ?openForm=1
 *
 * Timed capture (all visitors) is handled by LeadPopup at 10s.
 */
const AutoOpenForm: React.FC = () => {
  const { openFlyout } = useFormFlyout();

  useEffect(() => {
    // Hash-based trigger (#modal / #form)
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
  }, [openFlyout]);

  return null;
};

export default AutoOpenForm;




