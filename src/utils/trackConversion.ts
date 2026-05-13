declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

interface UserData {
  email?: string;
  phone?: string;
  name?: string;
}

// Fires a Google Ads conversion with enhanced user data so individual
// conversions can be identified in the Ads console (requires Enhanced
// Conversions to be enabled in the Google Ads account).
export function trackFormConversion({ email, phone, name }: UserData = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const [firstName, ...rest] = (name || '').trim().split(' ');

  window.gtag('event', 'conversion', {
    send_to: 'AW-17688095812/dXncCM7MhLsbEMTYq_JB',
    user_data: {
      ...(email    ? { email: email.trim().toLowerCase() } : {}),
      ...(phone    ? { phone_number: phone.replace(/\s/g, '') } : {}),
      ...(firstName ? {
        address: {
          first_name: firstName,
          last_name: rest.join(' ') || undefined,
        }
      } : {}),
    },
  });
}
