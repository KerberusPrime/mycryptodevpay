// ============================================================
// URL State — encode/decode evaluation params in query string
// Enables shareable result links with no backend required.
// ============================================================

const PARAM_KEYS = ['level', 'family', 'subfamily', 'stage', 'size', 'geo', 'flow']

/**
 * Push result params into the browser URL without a page reload.
 */
export function pushResultsToURL(params) {
  const sp = new URLSearchParams()
  if (params.level)              sp.set('level',  params.level)
  if (params.family)             sp.set('family', params.family)
  if (params.subfamily)          sp.set('sub',    params.subfamily)
  if (params.companyStage)       sp.set('stage',  params.companyStage)
  if (params.companySizeIndicator) sp.set('size', params.companySizeIndicator)
  if (params.geo)                sp.set('geo',    params.geo)
  window.history.replaceState({}, '', `?${sp.toString()}`)
}

/**
 * Read result params from the current URL query string.
 * Returns null if no valid params found.
 */
export function readResultsFromURL() {
  const sp = new URLSearchParams(window.location.search)
  const level  = sp.get('level')
  const family = sp.get('family')
  const sub    = sp.get('sub')
  const stage  = sp.get('stage')
  const size   = sp.get('size')
  const geo    = sp.get('geo')

  if (!level || !family || !sub || !stage || !size) return null

  return {
    level,
    family,
    subfamily:            sub,
    companyStage:         stage,
    companySizeIndicator: size,
    geo:                  geo || 'us-other',
  }
}

/**
 * Build the full shareable URL string for the current params.
 */
export function buildShareURL(params) {
  const sp = new URLSearchParams()
  if (params.level)              sp.set('level',  params.level)
  if (params.family)             sp.set('family', params.family)
  if (params.subfamily)          sp.set('sub',    params.subfamily)
  if (params.companyStage)       sp.set('stage',  params.companyStage)
  if (params.companySizeIndicator) sp.set('size', params.companySizeIndicator)
  if (params.geo)                sp.set('geo',    params.geo)
  return `${window.location.origin}${window.location.pathname}?${sp.toString()}`
}

/**
 * Clear URL params (called when user goes back to landing).
 */
export function clearURL() {
  window.history.replaceState({}, '', window.location.pathname)
}

/**
 * Copy text to clipboard, returns promise.
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return true
  }
  // Fallback
  const el = document.createElement('textarea')
  el.value = text
  el.style.position = 'fixed'
  el.style.opacity = '0'
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  return true
}
