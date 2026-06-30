function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

export function getMetaAttribution() {
  const fbc = getCookie('_fbc') ?? localStorage.getItem('_fbc') ?? undefined
  const fbp = getCookie('_fbp') ?? undefined

  // Capture fbc from fbclid URL param if cookie not set yet
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  const derivedFbc = fbc ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined)

  return { fbc: derivedFbc, fbp: fbp ?? undefined }
}
