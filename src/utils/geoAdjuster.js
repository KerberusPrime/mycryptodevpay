// ============================================================
// Geographic Adjustment — cost-of-labor multipliers
//
// Baseline (1.0x) = US non-Bay Area / non-NYC markets.
// All figures reflect crypto-industry positioning, which skews
// more remote-friendly and less geography-bound than traditional
// tech, but still has meaningful geographic variation.
// ============================================================

export const GEO_REGIONS = [
  {
    code: 'us-bay',
    name: 'US — Bay Area / NYC',
    shortName: 'SF/NYC',
    multiplier: 1.12,
    note: 'Highest cost of living; crypto hubs command a premium'
  },
  {
    code: 'us-other',
    name: 'US — Other Cities',
    shortName: 'US Other',
    multiplier: 1.00,
    note: 'Benchmark baseline'
  },
  {
    code: 'remote',
    name: 'Remote / Global',
    shortName: 'Remote',
    multiplier: 0.96,
    note: 'Most crypto companies pay near-US rates for remote roles'
  },
  {
    code: 'eu-tier1',
    name: 'EU — London / Zurich / Amsterdam',
    shortName: 'EU Tier 1',
    multiplier: 0.88,
    note: 'Strong talent market; slightly lower USD-equivalent cash'
  },
  {
    code: 'eu-tier2',
    name: 'EU — Berlin / Lisbon / Barcelona',
    shortName: 'EU Tier 2',
    multiplier: 0.74,
    note: 'Popular crypto hubs; significantly lower cash comp vs. US'
  },
  {
    code: 'apac-sg',
    name: 'APAC — Singapore / Hong Kong',
    shortName: 'SG / HK',
    multiplier: 0.84,
    note: 'Major DeFi and exchange hubs; lower than US but competitive in region'
  },
  {
    code: 'apac-au',
    name: 'APAC — Australia',
    shortName: 'AU',
    multiplier: 0.80,
    note: 'Growing crypto ecosystem; lower USD-equivalent rates'
  },
  {
    code: 'latam',
    name: 'Latin America',
    shortName: 'LatAm',
    multiplier: 0.55,
    note: 'Significant discount to US rates; often offset by lower cost of living'
  },
  {
    code: 'mea',
    name: 'Middle East / Africa',
    shortName: 'ME/Africa',
    multiplier: 0.68,
    note: 'Emerging crypto hubs (Dubai, Lagos); wide variance within region'
  },
]

/**
 * Apply a geographic multiplier to all percentile figures.
 * Returns adjusted percentiles object (same shape as input).
 */
export function applyGeoMultiplier(percentiles, geoCode) {
  const region = GEO_REGIONS.find(r => r.code === geoCode)
  if (!region || region.multiplier === 1.0) return percentiles

  const m = region.multiplier
  const adjust = (p) => ({
    base:  Math.round(p.base  * m),
    sti:   Math.round(p.sti   * m),
    lti:   Math.round(p.lti   * m),
    total: Math.round(p.total * m),
  })

  return {
    p25: adjust(percentiles.p25),
    p50: adjust(percentiles.p50),
    p75: adjust(percentiles.p75),
    p90: adjust(percentiles.p90),
  }
}

/**
 * Get a region object by code.
 */
export function getRegion(code) {
  return GEO_REGIONS.find(r => r.code === code) ?? GEO_REGIONS.find(r => r.code === 'us-other')
}
