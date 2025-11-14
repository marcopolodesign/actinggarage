import { useEffect } from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';

/**
 * AutoOpenForm component
 * Automatically opens the form flyout when URL contains:
 * - Hash: #modal
 * - Query param: ?modal=1 or ?openForm=1
 * 
 * Does not interfere with UTM parameters
 */
const AutoOpenForm: React.FC = () => {
  const { openFlyout } = useFormFlyout();

  useEffect(() => {
    // Check for hash-based trigger (#modal)
    const hash = window.location.hash;
    if (hash === '#modal' || hash === '#form') {
      openFlyout();
      // Clean up hash from URL without reloading
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      return;
    }

    // Check for query parameter-based triggers
    const urlParams = new URLSearchParams(window.location.search);
    const modalParam = urlParams.get('modal');
    const openFormParam = urlParams.get('openForm');
    
    if (modalParam === '1' || modalParam === 'true' || openFormParam === '1' || openFormParam === 'true') {
      openFlyout();
      // Remove the trigger parameter but keep UTM and other params
      urlParams.delete('modal');
      urlParams.delete('openForm');
      const newSearch = urlParams.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
      window.history.replaceState(null, '', newUrl);
    }
  }, [openFlyout]);

  return null;
};

export default AutoOpenForm;

