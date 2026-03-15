// ============================================================
// Job Catalog — all static reference data
// ============================================================

export const jobFamilies = {
  engineering: {
    name: 'Engineering',
    subfamilies: {
      protocol:      { name: 'Protocol/Blockchain Core',   icon: '⛓️', cryptoNative: true,  securityRole: false },
      smartContract: { name: 'Smart Contract/Solidity',    icon: '📜', cryptoNative: true,  securityRole: false },
      backend:       { name: 'Backend',                    icon: '🔧', cryptoNative: false, securityRole: false },
      frontend:      { name: 'Frontend',                   icon: '🎨', cryptoNative: false, securityRole: false },
      fullstack:     { name: 'Full Stack',                 icon: '🔄', cryptoNative: false, securityRole: false },
      devops:        { name: 'DevOps/Infrastructure',      icon: '☁️', cryptoNative: false, securityRole: false },
      security:      { name: 'Security/Auditing',          icon: '🔒', cryptoNative: true,  securityRole: true  },
      data:          { name: 'Data/ML',                    icon: '📊', cryptoNative: false, securityRole: false },
    }
  },
  product: {
    name: 'Product & Design',
    subfamilies: {
      productManagement: { name: 'Product Management', icon: '📋', cryptoNative: false, securityRole: false },
      design:            { name: 'UX/UI Design',        icon: '✏️', cryptoNative: false, securityRole: false },
      research:          { name: 'User Research',       icon: '🔍', cryptoNative: false, securityRole: false },
    }
  },
  business: {
    name: 'Business',
    subfamilies: {
      bizdev:       { name: 'Business Development', icon: '🤝', cryptoNative: false, securityRole: false },
      partnerships: { name: 'Partnerships',         icon: '🔗', cryptoNative: false, securityRole: false },
      sales:        { name: 'Sales',                icon: '💼', cryptoNative: false, securityRole: false },
    }
  },
  operations: {
    name: 'Operations',
    subfamilies: {
      legal:   { name: 'Legal/Compliance',    icon: '⚖️', cryptoNative: false, securityRole: false },
      finance: { name: 'Finance/Accounting',  icon: '💰', cryptoNative: false, securityRole: false },
      hr:      { name: 'HR/People',           icon: '👥', cryptoNative: false, securityRole: false },
      ops:     { name: 'Operations',          icon: '⚙️', cryptoNative: false, securityRole: false },
    }
  },
  marketing: {
    name: 'Marketing & Community',
    subfamilies: {
      marketing:  { name: 'Marketing',             icon: '📣', cryptoNative: false, securityRole: false },
      community:  { name: 'Community Management',  icon: '🌐', cryptoNative: true,  securityRole: false },
      devrel:     { name: 'Developer Relations',   icon: '👨‍💻', cryptoNative: true,  securityRole: false },
    }
  },
  researchDomain: {
    name: 'Research',
    subfamilies: {
      cryptography: { name: 'Cryptography',        icon: '🔐', cryptoNative: true,  securityRole: true  },
      economics:    { name: 'Economics Research',  icon: '📈', cryptoNative: true,  securityRole: false },
      academic:     { name: 'Academic Research',   icon: '🎓', cryptoNative: false, securityRole: false },
    }
  },
  governance: {
    name: 'Governance',
    subfamilies: {
      governanceLead: { name: 'Governance Lead/Coordinator',  icon: '🏛️', cryptoNative: true, securityRole: false },
      delegate:       { name: 'Delegate/Protocol Politician', icon: '🗳️', cryptoNative: true, securityRole: false },
      daoOps:         { name: 'DAO Operations',               icon: '🔄', cryptoNative: true, securityRole: false },
      tokenomics:     { name: 'Tokenomics/Incentive Design',  icon: '🪙', cryptoNative: true, securityRole: false },
    }
  }
}

export const seniorityLevels = [
  { code: 'IC1', name: 'Junior / Associate (Engineer I)',  grade: '1-3',   track: 'ic' },
  { code: 'IC2', name: 'Mid-Level (Engineer II)',          grade: '4-5',   track: 'ic' },
  { code: 'IC3', name: 'Senior (Engineer III)',            grade: '6-7',   track: 'ic' },
  { code: 'IC4', name: 'Staff / Lead',                    grade: '8-9',   track: 'ic' },
  { code: 'IC5', name: 'Principal / Senior Staff',        grade: '10-11', track: 'ic' },
  { code: 'IC6', name: 'Distinguished / Fellow',          grade: '12-13', track: 'ic' },
  { code: 'M1',  name: 'Manager',                         grade: '6-7',   track: 'mgmt' },
  { code: 'M2',  name: 'Senior Manager',                  grade: '8-9',   track: 'mgmt' },
  { code: 'D1',  name: 'Director',                        grade: '10-11', track: 'mgmt' },
  { code: 'D2',  name: 'Senior Director',                 grade: '12-13', track: 'mgmt' },
  { code: 'VP',  name: 'VP / C-Level',                   grade: '14-15', track: 'exec' },
]

export const companyStages = [
  { code: 'preseed',   name: 'Pre-seed (<$1M raised)',      sizeType: 'funding' },
  { code: 'seed',      name: 'Seed ($1M–$5M)',              sizeType: 'funding' },
  { code: 'seriesA',   name: 'Series A ($5M–$15M)',         sizeType: 'funding' },
  { code: 'seriesB',   name: 'Series B ($15M–$50M)',        sizeType: 'funding' },
  { code: 'seriesC',   name: 'Series C+ ($50M+)',           sizeType: 'funding' },
  { code: 'tokenLive', name: 'Token Live / Public',         sizeType: 'marketcap' },
  { code: 'dao',       name: 'DAO',                         sizeType: 'treasury' },
]

export const marketCapRanges = [
  { code: 'mc1', name: '< $10M' },
  { code: 'mc2', name: '$10M – $50M' },
  { code: 'mc3', name: '$50M – $200M' },
  { code: 'mc4', name: '$200M – $500M' },
  { code: 'mc5', name: '$500M – $1B' },
  { code: 'mc6', name: '$1B – $5B' },
  { code: 'mc7', name: '$5B – $20B' },
  { code: 'mc8', name: '> $20B' },
]

export const fundingRanges = [
  { code: 'fr1', name: '< $1M (Pre-seed)' },
  { code: 'fr2', name: '$1M – $5M (Seed)' },
  { code: 'fr3', name: '$5M – $15M (Series A)' },
  { code: 'fr4', name: '$15M – $50M (Series B)' },
  { code: 'fr5', name: '$50M – $150M (Series C)' },
  { code: 'fr6', name: '> $150M (Series D+)' },
]

export const treasuryRanges = [
  { code: 'tr1', name: '< $1M' },
  { code: 'tr2', name: '$1M – $10M' },
  { code: 'tr3', name: '$10M – $50M' },
  { code: 'tr4', name: '$50M – $200M' },
  { code: 'tr5', name: '$200M – $1B' },
  { code: 'tr6', name: '> $1B' },
]

export const employmentTypes = [
  { code: 'fulltime',      name: 'Full-time Employee' },
  { code: 'parttime',      name: 'Part-time Employee' },
  { code: 'contract',      name: 'Contractor/Freelance' },
  { code: 'daoContributor',name: 'DAO Contributor' },
]

export const verificationMethods = [
  { code: 'twitter',  name: 'X/Twitter Profile Link' },
  { code: 'linkedin', name: 'LinkedIn Profile Link' },
  { code: 'employer', name: 'Employer Verification Letter' },
  { code: 'honor',    name: 'Honor System (Unverified)' },
]

// Pay mix: proportion of total comp by component per level
export const payMixByLevel = {
  IC1: { base: 0.85, sti: 0.10, lti: 0.05 },
  IC2: { base: 0.85, sti: 0.10, lti: 0.05 },
  IC3: { base: 0.75, sti: 0.15, lti: 0.10 },
  IC4: { base: 0.75, sti: 0.15, lti: 0.10 },
  IC5: { base: 0.65, sti: 0.15, lti: 0.20 },
  IC6: { base: 0.65, sti: 0.15, lti: 0.20 },
  M1:  { base: 0.70, sti: 0.15, lti: 0.15 },
  M2:  { base: 0.70, sti: 0.15, lti: 0.15 },
  D1:  { base: 0.60, sti: 0.15, lti: 0.25 },
  D2:  { base: 0.60, sti: 0.15, lti: 0.25 },
  VP:  { base: 0.50, sti: 0.20, lti: 0.30 },
}

// Points ranges for grade/level mapping
export const levelPointRanges = {
  IC1: { min: 100, max: 205, midpoint: 152 },
  IC2: { min: 206, max: 329, midpoint: 267 },
  IC3: { min: 330, max: 485, midpoint: 407 },
  IC4: { min: 486, max: 641, midpoint: 563 },
  IC5: { min: 642, max: 790, midpoint: 716 },
  IC6: { min: 791, max: 906, midpoint: 848 },
  M1:  { min: 330, max: 485, midpoint: 407 },
  M2:  { min: 486, max: 641, midpoint: 563 },
  D1:  { min: 642, max: 790, midpoint: 716 },
  D2:  { min: 791, max: 906, midpoint: 848 },
  VP:  { min: 907, max: 1000, midpoint: 953 },
}

// Base comp data — placeholder until real CSV is loaded
// Structure: { p25, p50, p75, p90 } in USD total comp
// Replace these with real survey data when the CSV is imported
export const baseCompData = {
  IC1: { p25: 85000,  p50: 100000, p75: 120000, p90: 140000 },
  IC2: { p25: 110000, p50: 130000, p75: 155000, p90: 180000 },
  IC3: { p25: 145000, p50: 175000, p75: 210000, p90: 250000 },
  IC4: { p25: 190000, p50: 230000, p75: 280000, p90: 340000 },
  IC5: { p25: 250000, p50: 310000, p75: 380000, p90: 450000 },
  IC6: { p25: 320000, p50: 400000, p75: 500000, p90: 600000 },
  M1:  { p25: 160000, p50: 195000, p75: 240000, p90: 290000 },
  M2:  { p25: 200000, p50: 250000, p75: 310000, p90: 380000 },
  D1:  { p25: 270000, p50: 340000, p75: 420000, p90: 520000 },
  D2:  { p25: 350000, p50: 440000, p75: 550000, p90: 680000 },
  VP:  { p25: 450000, p50: 580000, p75: 750000, p90: 950000 },
}
