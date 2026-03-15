// ============================================================
// Evaluation Engine — Points-Factor Methodology
//
// Adapted from the industry-standard JobLink points-factor system.
// Total score: 0–1000 points across 5 weighted factors.
//
// Factor weights:
//   Knowledge & Application   30%  → max 300 pts
//   Problem Solving           15%  → max 150 pts
//   Interaction               15%  → max 150 pts
//   Impact                    30%  → max 300 pts
//   Accountability            10%  → max 100 pts
// ============================================================

import { jobFamilies, levelPointRanges, payMixByLevel, baseCompData } from '../data/jobCatalog.js'

// ─── Factor scores per level (0–10 scale) ───────────────────
// IC levels lean on Knowledge/Impact; management levels lean on Interaction/Accountability
const LEVEL_FACTOR_SCORES = {
  //          Know  ProbSolv  Interact  Impact  Account
  IC1: { know: 2.0, prob: 1.5, inter: 1.5, impact: 2.0, account: 1.0 },
  IC2: { know: 3.5, prob: 2.5, inter: 2.5, impact: 3.0, account: 2.0 },
  IC3: { know: 5.0, prob: 4.0, inter: 4.0, impact: 5.0, account: 3.5 },
  IC4: { know: 6.5, prob: 5.5, inter: 5.5, impact: 6.5, account: 5.5 },
  IC5: { know: 8.0, prob: 7.0, inter: 7.0, impact: 8.0, account: 7.0 },
  IC6: { know: 9.0, prob: 8.5, inter: 7.5, impact: 9.0, account: 8.5 },
  M1:  { know: 5.0, prob: 4.5, inter: 6.5, impact: 5.5, account: 5.0 },
  M2:  { know: 6.5, prob: 5.5, inter: 7.5, impact: 6.5, account: 6.5 },
  D1:  { know: 7.5, prob: 6.5, inter: 8.5, impact: 7.5, account: 7.5 },
  D2:  { know: 8.5, prob: 7.5, inter: 9.0, impact: 8.5, account: 8.5 },
  VP:  { know: 9.5, prob: 9.0, inter: 9.5, impact: 9.5, account: 9.5 },
}

const FACTOR_WEIGHTS = {
  know:    300,
  prob:    150,
  inter:   150,
  impact:  300,
  account: 100,
}

// Crypto-native bonus: +5% to Knowledge score
const CRYPTO_NATIVE_BONUS = 1.05

// Security uplift: +10% to Problem Solving score
const SECURITY_UPLIFT = 1.10

// ─── Company stage base multipliers ─────────────────────────
// Reflects typical pay positioning vs. Series C+ benchmark
const STAGE_MULTIPLIERS = {
  preseed:   { base: 0.70, sti: 0.75, lti: 1.25 },  // low cash, high promise equity
  seed:      { base: 0.80, sti: 0.82, lti: 1.18 },
  seriesA:   { base: 0.88, sti: 0.90, lti: 1.12 },
  seriesB:   { base: 0.95, sti: 0.97, lti: 1.05 },
  seriesC:   { base: 1.00, sti: 1.00, lti: 1.00 },  // ← baseline
  tokenLive: { base: 1.00, sti: 1.00, lti: 1.00 },  // adjusted by market cap below
  dao:       { base: 0.85, sti: 0.80, lti: 1.00 },  // adjusted by treasury below
}

// Size-within-stage modifier (additive % on the stage base)
const FUNDING_SIZE_MODIFIER = {
  fr1: -0.05, fr2: -0.02, fr3: 0.00, fr4: 0.03, fr5: 0.06, fr6: 0.10,
}

const MARKET_CAP_MODIFIER = {
  mc1: -0.12, mc2: -0.07, mc3: -0.02, mc4: 0.03,
  mc5: 0.08,  mc6: 0.14,  mc7: 0.20,  mc8: 0.28,
}

const TREASURY_MODIFIER = {
  tr1: -0.10, tr2: -0.05, tr3: 0.00, tr4: 0.05, tr5: 0.10, tr6: 0.18,
}

// ─── Core scoring function ───────────────────────────────────

/**
 * computeFactorScores
 * Calculates raw factor scores and total points for a role.
 *
 * @param {string} level         - e.g. 'IC3'
 * @param {string} subfamily     - e.g. 'smartContract'
 * @param {string} family        - e.g. 'engineering'
 * @returns {{ factors, totalPoints, grade }}
 */
export function computeFactorScores(level, subfamily, family) {
  const base = LEVEL_FACTOR_SCORES[level] || LEVEL_FACTOR_SCORES.IC3
  const subfamilyData = jobFamilies[family]?.subfamilies[subfamily]

  const isCryptoNative = subfamilyData?.cryptoNative ?? false
  const isSecurityRole = subfamilyData?.securityRole ?? false

  const factors = {
    know:    base.know    * (isCryptoNative ? CRYPTO_NATIVE_BONUS : 1),
    prob:    base.prob    * (isSecurityRole  ? SECURITY_UPLIFT     : 1),
    inter:   base.inter,
    impact:  base.impact,
    account: base.account,
  }

  // Cap at 10
  for (const k of Object.keys(factors)) {
    factors[k] = Math.min(10, factors[k])
  }

  const totalPoints = Math.round(
    (factors.know    / 10) * FACTOR_WEIGHTS.know    +
    (factors.prob    / 10) * FACTOR_WEIGHTS.prob    +
    (factors.inter   / 10) * FACTOR_WEIGHTS.inter   +
    (factors.impact  / 10) * FACTOR_WEIGHTS.impact  +
    (factors.account / 10) * FACTOR_WEIGHTS.account
  )

  return {
    factors,
    totalPoints,
    isCryptoNative,
    isSecurityRole,
    grade: levelPointRanges[level]?.grade ?? '?',
  }
}

/**
 * getSizeModifier
 * Returns the numeric size modifier (e.g. 0.03) for a stage + size combo.
 */
function getSizeModifier(companyStage, companySizeIndicator) {
  if (!companySizeIndicator) return 0
  if (companyStage === 'tokenLive') return MARKET_CAP_MODIFIER[companySizeIndicator] ?? 0
  if (companyStage === 'dao')       return TREASURY_MODIFIER[companySizeIndicator] ?? 0
  return FUNDING_SIZE_MODIFIER[companySizeIndicator] ?? 0
}

/**
 * applyCompanyMultipliers
 * Adjusts raw percentile comp data for company stage + size.
 * Returns { p25, p50, p75, p90 } objects for base, sti, lti, total.
 *
 * @param {string} level
 * @param {string} companyStage
 * @param {string} companySizeIndicator
 * @param {object} compDataOverride  - optional, replaces baseCompData[level]
 */
export function applyCompanyMultipliers(level, companyStage, companySizeIndicator, compDataOverride) {
  const raw     = compDataOverride ?? baseCompData[level] ?? baseCompData.IC3
  const mix     = payMixByLevel[level] ?? payMixByLevel.IC3
  const stageMul = STAGE_MULTIPLIERS[companyStage] ?? STAGE_MULTIPLIERS.seriesC
  const sizeMod  = getSizeModifier(companyStage, companySizeIndicator)

  // Effective multipliers per component
  const effBase = stageMul.base + sizeMod
  const effSti  = stageMul.sti  + sizeMod
  const effLti  = stageMul.lti  - sizeMod * 0.5  // equity moves inversely (somewhat)

  const percentiles = ['p25', 'p50', 'p75', 'p90']

  const result = {}
  for (const p of percentiles) {
    const total     = raw[p]
    const baseComp  = Math.round(total * mix.base  * effBase)
    const stiComp   = Math.round(total * mix.sti   * effSti)
    const ltiComp   = Math.round(total * mix.lti   * effLti)
    result[p] = {
      base:  baseComp,
      sti:   stiComp,
      lti:   ltiComp,
      total: baseComp + stiComp + ltiComp,
    }
  }

  return {
    percentiles: result,
    mix,
    stageMultiplier: stageMul,
    sizeModifier: sizeMod,
  }
}

/**
 * evaluateRole
 * Main entry point — runs full evaluation and returns everything needed
 * to populate the ResultsView.
 *
 * @param {{ level, family, subfamily, companyStage, companySizeIndicator }} params
 */
export function evaluateRole({ level, family, subfamily, companyStage, companySizeIndicator, compDataOverride }) {
  const scoring    = computeFactorScores(level, subfamily, family)
  const compResult = applyCompanyMultipliers(level, companyStage, companySizeIndicator, compDataOverride ?? null)

  return {
    level,
    family,
    subfamily,
    companyStage,
    companySizeIndicator,
    ...scoring,
    ...compResult,
  }
}

/**
 * pointsToLevel
 * Given a raw points total, returns the best matching level code.
 */
export function pointsToLevel(points) {
  for (const [code, range] of Object.entries(levelPointRanges)) {
    if (points >= range.min && points <= range.max) return code
  }
  if (points < 100) return 'IC1'
  return 'VP'
}
