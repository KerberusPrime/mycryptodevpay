// ============================================================
// AI Analyzer — JD keyword parsing + role matching
//
// Currently uses a deterministic keyword-scoring approach.
// Replace analyzeWithAI() with an API call (Claude, GPT-4, etc.)
// when you want real model-based extraction.
// ============================================================

import { jobFamilies, levelPointRanges } from '../data/jobCatalog.js'
import { pointsToLevel } from './evaluationEngine.js'

// ─── Signal maps ────────────────────────────────────────────

const FAMILY_SIGNALS = [
  // More specific patterns first
  { family: 'governance',     subfamily: 'tokenomics',       score: 10, patterns: ['tokenomics', 'token incentive', 'incentive design', 'mechanism design'] },
  { family: 'governance',     subfamily: 'daoOps',           score: 9,  patterns: ['dao operations', 'dao ops', 'dao coordination'] },
  { family: 'governance',     subfamily: 'delegate',         score: 9,  patterns: ['protocol delegate', 'governance delegate', 'protocol politician'] },
  { family: 'governance',     subfamily: 'governanceLead',   score: 8,  patterns: ['governance lead', 'governance coordinator', 'governance manager'] },
  { family: 'researchDomain', subfamily: 'cryptography',     score: 10, patterns: ['cryptography', 'cryptographer', 'zero knowledge', 'zk proof', 'zkp', 'mpc', 'homomorphic'] },
  { family: 'researchDomain', subfamily: 'economics',        score: 9,  patterns: ['economics research', 'economic research', 'crypto economics', 'cryptoeconomics'] },
  { family: 'researchDomain', subfamily: 'academic',         score: 8,  patterns: ['research scientist', 'academic research', 'phd research'] },
  { family: 'engineering',    subfamily: 'smartContract',    score: 10, patterns: ['smart contract', 'solidity', 'vyper', 'evm', 'foundry', 'hardhat', 'brownie'] },
  { family: 'engineering',    subfamily: 'protocol',         score: 10, patterns: ['protocol engineer', 'blockchain core', 'consensus', 'p2p network', 'layer 1', 'layer 2', 'l1', 'l2'] },
  { family: 'engineering',    subfamily: 'security',         score: 10, patterns: ['security audit', 'smart contract audit', 'penetration test', 'vulnerability', 'bug bounty', 'threat model'] },
  { family: 'engineering',    subfamily: 'devops',           score: 9,  patterns: ['devops', 'sre', 'infrastructure engineer', 'kubernetes', 'terraform', 'ci/cd', 'cloud engineer'] },
  { family: 'engineering',    subfamily: 'data',             score: 9,  patterns: ['data engineer', 'machine learning', 'ml engineer', 'data scientist', 'data pipeline', 'analytics engineer'] },
  { family: 'engineering',    subfamily: 'frontend',         score: 8,  patterns: ['frontend engineer', 'front-end', 'react', 'vue', 'angular', 'typescript ui', 'web developer'] },
  { family: 'engineering',    subfamily: 'fullstack',        score: 7,  patterns: ['full stack', 'fullstack', 'full-stack'] },
  { family: 'engineering',    subfamily: 'backend',          score: 6,  patterns: ['backend engineer', 'back-end', 'api developer', 'server-side', 'software engineer'] },
  { family: 'product',        subfamily: 'productManagement',score: 10, patterns: ['product manager', 'product management', 'product lead', 'head of product'] },
  { family: 'product',        subfamily: 'design',           score: 10, patterns: ['ux designer', 'ui designer', 'product designer', 'interaction design', 'figma'] },
  { family: 'product',        subfamily: 'research',         score: 9,  patterns: ['user researcher', 'ux researcher', 'usability research'] },
  { family: 'marketing',      subfamily: 'devrel',           score: 10, patterns: ['developer relations', 'devrel', 'developer advocate', 'developer evangelism'] },
  { family: 'marketing',      subfamily: 'community',        score: 9,  patterns: ['community manager', 'community lead', 'community growth', 'discord manager'] },
  { family: 'marketing',      subfamily: 'marketing',        score: 8,  patterns: ['marketing manager', 'growth marketing', 'performance marketing', 'content marketing'] },
  { family: 'business',       subfamily: 'bizdev',           score: 10, patterns: ['business development', 'biz dev', 'business dev'] },
  { family: 'business',       subfamily: 'partnerships',     score: 9,  patterns: ['partnerships manager', 'strategic partnerships', 'ecosystem partnerships'] },
  { family: 'business',       subfamily: 'sales',            score: 8,  patterns: ['account executive', 'sales manager', 'enterprise sales', 'sales lead'] },
  { family: 'operations',     subfamily: 'legal',            score: 10, patterns: ['legal counsel', 'compliance officer', 'general counsel', 'regulatory', 'legal & compliance'] },
  { family: 'operations',     subfamily: 'finance',          score: 9,  patterns: ['finance manager', 'cfo', 'controller', 'financial analyst', 'treasury manager'] },
  { family: 'operations',     subfamily: 'hr',               score: 9,  patterns: ['people operations', 'hr manager', 'talent acquisition', 'recruiter', 'people partner'] },
  { family: 'operations',     subfamily: 'ops',              score: 8,  patterns: ['operations manager', 'chief of staff', 'head of operations', 'ops lead'] },
]

const LEVEL_SIGNALS = [
  { level: 'VP',  score: 10, patterns: ['chief ', 'cto', 'cpo', 'coo', 'cfo', 'vp of', 'vice president', 'head of engineering', 'head of product', 'head of'] },
  { level: 'D1',  score: 9,  patterns: ['director of', 'director,', 'senior director'] },
  { level: 'IC6', score: 8,  patterns: ['distinguished engineer', 'fellow', 'principal architect'] },
  { level: 'IC5', score: 8,  patterns: ['principal engineer', 'principal software', 'senior principal', 'staff architect'] },
  { level: 'M2',  score: 7,  patterns: ['senior manager', 'sr. manager', 'sr manager'] },
  { level: 'IC4', score: 7,  patterns: ['staff engineer', 'tech lead', 'technical lead', 'lead engineer', 'lead developer'] },
  { level: 'M1',  score: 7,  patterns: ['engineering manager', 'team lead', 'people manager'] },
  { level: 'IC3', score: 6,  patterns: ['senior engineer', 'senior developer', 'senior software', 'sr. engineer', 'sr engineer', 'sr. developer'] },
  { level: 'IC2', score: 5,  patterns: ['mid-level', 'mid level', 'software engineer ii', 'engineer ii', '2-4 years', '3-5 years'] },
  { level: 'IC1', score: 4,  patterns: ['junior', 'associate engineer', 'entry level', 'entry-level', 'graduate', '0-2 years', '1-2 years'] },
]

// Crypto context signals — if present, marks role as crypto-native
const CRYPTO_CONTEXT_PATTERNS = [
  'blockchain', 'crypto', 'web3', 'defi', 'nft', 'dao', 'protocol',
  'token', 'wallet', 'dex', 'cefi', 'layer 2', 'l2', 'ethereum', 'bitcoin',
  'solana', 'cosmos', 'polkadot', 'avalanche', 'stablecoin', 'on-chain', 'onchain',
]

// Seniority keyword signals for points-factor estimation
const EXPERIENCE_SIGNALS = {
  expert:  { points: 50, patterns: ['10+ years', '8+ years', 'expert', 'deep expertise', 'extensive experience', 'proven track record'] },
  senior:  { points: 35, patterns: ['5+ years', '6+ years', '7+ years', 'significant experience'] },
  mid:     { points: 20, patterns: ['3+ years', '4+ years', 'solid experience'] },
  junior:  { points: 5,  patterns: ['1+ year', '2+ years', 'some experience', 'recent graduate'] },
}

const COMPLEXITY_SIGNALS = {
  high:   { points: 40, patterns: ['ambiguous', 'novel', 'first principles', 'unprecedented', 'define strategy', 'set direction'] },
  medium: { points: 20, patterns: ['complex', 'multifaceted', 'cross-functional', 'multiple stakeholders'] },
  low:    { points: 5,  patterns: ['well-defined', 'established processes', 'defined requirements'] },
}

const SCOPE_SIGNALS = {
  company:  { points: 45, patterns: ['company-wide', 'organization-wide', 'executive', 'board', 'investor'] },
  division: { points: 25, patterns: ['department', 'division', 'multiple teams', 'cross-team'] },
  team:     { points: 10, patterns: ['team', 'squad', 'pod'] },
}

// ─── Main analyzer ───────────────────────────────────────────

/**
 * analyzeJobDescription
 * Parses a JD string and returns a structured role assessment.
 *
 * @param {string} text
 * @returns {{ family, subfamily, level, isCryptoNative, isSecurityRole,
 *             confidence, flags, familyName, subfamilyName }}
 */
export function analyzeJobDescription(text) {
  const t = text.toLowerCase()

  // ── 1. Match family / subfamily ────────────────────────────
  let bestFamily = null
  let bestSubfamily = null
  let bestFamilyScore = 0

  for (const sig of FAMILY_SIGNALS) {
    for (const pattern of sig.patterns) {
      if (t.includes(pattern)) {
        if (sig.score > bestFamilyScore) {
          bestFamilyScore = sig.score
          bestFamily    = sig.family
          bestSubfamily = sig.subfamily
        }
        break
      }
    }
  }

  // Default fallback
  if (!bestFamily) { bestFamily = 'engineering'; bestSubfamily = 'backend' }

  // ── 2. Match level ─────────────────────────────────────────
  let bestLevel = null
  let bestLevelScore = 0

  for (const sig of LEVEL_SIGNALS) {
    for (const pattern of sig.patterns) {
      if (t.includes(pattern)) {
        if (sig.score > bestLevelScore) {
          bestLevelScore = sig.score
          bestLevel = sig.level
        }
        break
      }
    }
  }

  // ── 3. Points-factor heuristic for level fallback ──────────
  if (!bestLevel) {
    let pointsEstimate = 150 // base IC1-ish

    for (const [, sig] of Object.entries(EXPERIENCE_SIGNALS)) {
      for (const pattern of sig.patterns) {
        if (t.includes(pattern)) { pointsEstimate += sig.points; break }
      }
    }
    for (const [, sig] of Object.entries(COMPLEXITY_SIGNALS)) {
      for (const pattern of sig.patterns) {
        if (t.includes(pattern)) { pointsEstimate += sig.points; break }
      }
    }
    for (const [, sig] of Object.entries(SCOPE_SIGNALS)) {
      for (const pattern of sig.patterns) {
        if (t.includes(pattern)) { pointsEstimate += sig.points; break }
      }
    }

    bestLevel = pointsToLevel(Math.min(pointsEstimate, 1000))
  }

  // ── 4. Crypto context & security ──────────────────────────
  const isCryptoNative = CRYPTO_CONTEXT_PATTERNS.some(p => t.includes(p)) ||
                         jobFamilies[bestFamily]?.subfamilies[bestSubfamily]?.cryptoNative

  const isSecurityRole = jobFamilies[bestFamily]?.subfamilies[bestSubfamily]?.securityRole

  // ── 5. Confidence & flags ──────────────────────────────────
  const flags = []

  // Title vs. responsibilities mismatch check
  const titleLine = text.split('\n')[0].toLowerCase()
  if (titleLine.includes('senior') && (bestLevel === 'IC1' || bestLevel === 'IC2')) {
    flags.push('⚠️ Title says "Senior" but responsibilities suggest a lower level — possible title inflation')
  }
  if ((bestLevel === 'IC5' || bestLevel === 'IC6') && !titleLine.includes('principal') && !titleLine.includes('staff')) {
    flags.push('ℹ️ Responsibilities suggest a very senior level — verify alignment with title')
  }
  if (isCryptoNative && !CRYPTO_CONTEXT_PATTERNS.some(p => titleLine.includes(p))) {
    flags.push('🔗 Role appears crypto-native based on requirements despite generic title')
  }

  const confidence = bestFamilyScore >= 8 && bestLevelScore >= 5 ? 'high'
                   : bestFamilyScore >= 5 || bestLevelScore >= 5 ? 'medium'
                   : 'low'

  return {
    family:        bestFamily,
    subfamily:     bestSubfamily,
    level:         bestLevel,
    isCryptoNative,
    isSecurityRole,
    confidence,
    flags,
    familyName:    jobFamilies[bestFamily]?.name,
    subfamilyName: jobFamilies[bestFamily]?.subfamilies[bestSubfamily]?.name,
  }
}
