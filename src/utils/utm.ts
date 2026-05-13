const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id'] as const;
type UtmKey = typeof UTM_KEYS[number];

const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function isExpired(): boolean {
  const ts = localStorage.getItem('utm_ts');
  return !!ts && Date.now() - parseInt(ts) > TTL_MS;
}

function clearStored(): void {
  UTM_KEYS.forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('utm_ts');
}

// Call on every page load / navigation. Writes UTMs to localStorage so they
// survive browser closes (last-touch, 30-day window). Must run before any
// browser stripping (e.g. Firefox ETP) can modify the URL.
export function captureUtms(): void {
  const params = new URLSearchParams(window.location.search);
  const hasNew = UTM_KEYS.some(key => params.get(key));
  if (hasNew) {
    clearStored(); // clear stale keys from previous campaigns
    UTM_KEYS.forEach(key => {
      const value = params.get(key);
      if (value) localStorage.setItem(key, value);
    });
    localStorage.setItem('utm_ts', Date.now().toString());
  }
}

export function getUtm(key: UtmKey): string | null {
  if (isExpired()) {
    clearStored();
    return new URLSearchParams(window.location.search).get(key);
  }
  return localStorage.getItem(key) ?? new URLSearchParams(window.location.search).get(key);
}

export function getUtms() {
  return {
    utm_source: getUtm('utm_source') ?? '',
    utm_medium: getUtm('utm_medium') ?? 'organic',
    utm_campaign: getUtm('utm_campaign') ?? '',
    utm_id: getUtm('utm_id') ?? '',
  };
}

// True if any of the three main UTM params are present (URL or localStorage, within TTL).
export function hasUtms(): boolean {
  return (['utm_source', 'utm_medium', 'utm_campaign'] as UtmKey[]).some(key =>
    Boolean(getUtm(key))
  );
}
