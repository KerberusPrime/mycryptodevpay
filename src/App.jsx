import React, { useState, useEffect } from 'react'

// ============ DATA ============
const jobFamilies = {
  engineering: {
    name: 'Engineering',
    subfamilies: {
      protocol: { name: 'Protocol/Blockchain Core', icon: '⛓️' },
      smartContract: { name: 'Smart Contract/Solidity', icon: '📜' },
      backend: { name: 'Backend', icon: '🔧' },
      frontend: { name: 'Frontend', icon: '🎨' },
      fullstack: { name: 'Full Stack', icon: '🔄' },
      devops: { name: 'DevOps/Infrastructure', icon: '☁️' },
      security: { name: 'Security/Auditing', icon: '🔒' },
      data: { name: 'Data/ML', icon: '📊' }
    }
  },
  product: {
    name: 'Product & Design',
    subfamilies: {
      productManagement: { name: 'Product Management', icon: '📋' },
      design: { name: 'UX/UI Design', icon: '✏️' },
      research: { name: 'User Research', icon: '🔍' }
    }
  },
  business: {
    name: 'Business',
    subfamilies: {
      bizdev: { name: 'Business Development', icon: '🤝' },
      partnerships: { name: 'Partnerships', icon: '🔗' },
      sales: { name: 'Sales', icon: '💼' }
    }
  },
  operations: {
    name: 'Operations',
    subfamilies: {
      legal: { name: 'Legal/Compliance', icon: '⚖️' },
      finance: { name: 'Finance/Accounting', icon: '💰' },
      hr: { name: 'HR/People', icon: '👥' },
      ops: { name: 'Operations', icon: '⚙️' }
    }
  },
  marketing: {
    name: 'Marketing & Community',
    subfamilies: {
      marketing: { name: 'Marketing', icon: '📣' },
      community: { name: 'Community Management', icon: '🌐' },
      devrel: { name: 'Developer Relations', icon: '👨‍💻' }
    }
  },
  research: {
    name: 'Research',
    subfamilies: {
      cryptography: { name: 'Cryptography', icon: '🔐' },
      economics: { name: 'Economics Research', icon: '📈' },
      academic: { name: 'Academic Research', icon: '🎓' }
    }
  },
  governance: {
    name: 'Governance',
    subfamilies: {
      governanceLead: { name: 'Governance Lead/Coordinator', icon: '🏛️' },
      delegate: { name: 'Delegate/Protocol Politician', icon: '🗳️' },
      daoOps: { name: 'DAO Operations', icon: '🔄' },
      tokenomics: { name: 'Tokenomics/Incentive Design', icon: '🪙' }
    }
  }
}

const seniorityLevels = [
  { code: 'IC1', name: 'Junior / Associate (Engineer I)', grade: '1-3' },
  { code: 'IC2', name: 'Mid-Level (Engineer II)', grade: '4-5' },
  { code: 'IC3', name: 'Senior (Engineer III)', grade: '6-7' },
  { code: 'IC4', name: 'Staff / Lead', grade: '8-9' },
  { code: 'IC5', name: 'Principal / Senior Staff', grade: '10-11' },
  { code: 'IC6', name: 'Distinguished / Fellow', grade: '12-13' },
  { code: 'M1', name: 'Manager', grade: '6-7' },
  { code: 'M2', name: 'Senior Manager', grade: '8-9' },
  { code: 'D1', name: 'Director', grade: '10-11' },
  { code: 'D2', name: 'Senior Director', grade: '12-13' },
  { code: 'VP', name: 'VP / C-Level', grade: '14-15' }
]

const companyStages = [
  { code: 'preseed', name: 'Pre-seed (<$1M raised)' },
  { code: 'seed', name: 'Seed ($1M-$5M)' },
  { code: 'seriesA', name: 'Series A ($5M-$15M)' },
  { code: 'seriesB', name: 'Series B ($15M-$50M)' },
  { code: 'seriesC', name: 'Series C+ ($50M+)' },
  { code: 'tokenLive', name: 'Token Live / Public' },
  { code: 'dao', name: 'DAO' }
]

const marketCapRanges = [
  { code: 'mc1', name: '< $10M' },
  { code: 'mc2', name: '$10M - $50M' },
  { code: 'mc3', name: '$50M - $200M' },
  { code: 'mc4', name: '$200M - $500M' },
  { code: 'mc5', name: '$500M - $1B' },
  { code: 'mc6', name: '$1B - $5B' },
  { code: 'mc7', name: '$5B - $20B' },
  { code: 'mc8', name: '> $20B' }
]

const fundingRanges = [
  { code: 'fr1', name: '< $1M (Pre-seed)' },
  { code: 'fr2', name: '$1M - $5M (Seed)' },
  { code: 'fr3', name: '$5M - $15M (Series A)' },
  { code: 'fr4', name: '$15M - $50M (Series B)' },
  { code: 'fr5', name: '$50M - $150M (Series C)' },
  { code: 'fr6', name: '> $150M (Series D+)' }
]

const treasuryRanges = [
  { code: 'tr1', name: '< $1M' },
  { code: 'tr2', name: '$1M - $10M' },
  { code: 'tr3', name: '$10M - $50M' },
  { code: 'tr4', name: '$50M - $200M' },
  { code: 'tr5', name: '$200M - $1B' },
  { code: 'tr6', name: '> $1B' }
]

const employmentTypes = [
  { code: 'fulltime', name: 'Full-time Employee' },
  { code: 'parttime', name: 'Part-time Employee' },
  { code: 'contract', name: 'Contractor/Freelance' },
  { code: 'daoContributor', name: 'DAO Contributor' }
]

const verificationMethods = [
  { code: 'twitter', name: 'X/Twitter Profile Link' },
  { code: 'linkedin', name: 'LinkedIn Profile Link' },
  { code: 'employer', name: 'Employer Verification Letter' },
  { code: 'honor', name: 'Honor System (Unverified)' }
]

const payMixByLevel = {
  IC1: { base: 0.85, sti: 0.10, lti: 0.05 },
  IC2: { base: 0.85, sti: 0.10, lti: 0.05 },
  IC3: { base: 0.75, sti: 0.15, lti: 0.10 },
  IC4: { base: 0.75, sti: 0.15, lti: 0.10 },
  IC5: { base: 0.65, sti: 0.15, lti: 0.20 },
  IC6: { base: 0.65, sti: 0.15, lti: 0.20 },
  M1: { base: 0.70, sti: 0.15, lti: 0.15 },
  M2: { base: 0.70, sti: 0.15, lti: 0.15 },
  D1: { base: 0.60, sti: 0.15, lti: 0.25 },
  D2: { base: 0.60, sti: 0.15, lti: 0.25 },
  VP: { base: 0.50, sti: 0.20, lti: 0.30 }
}

const sampleCompData = {
  IC1: { p25: 85000, p50: 100000, p75: 120000, p90: 140000 },
  IC2: { p25: 110000, p50: 130000, p75: 155000, p90: 180000 },
  IC3: { p25: 145000, p50: 175000, p75: 210000, p90: 250000 },
  IC4: { p25: 190000, p50: 230000, p75: 280000, p90: 340000 },
  IC5: { p25: 250000, p50: 310000, p75: 380000, p90: 450000 },
  IC6: { p25: 320000, p50: 400000, p75: 500000, p90: 600000 },
  M1: { p25: 160000, p50: 195000, p75: 240000, p90: 290000 },
  M2: { p25: 200000, p50: 250000, p75: 310000, p90: 380000 },
  D1: { p25: 270000, p50: 340000, p75: 420000, p90: 520000 },
  D2: { p25: 350000, p50: 440000, p75: 550000, p90: 680000 },
  VP: { p25: 450000, p50: 580000, p75: 750000, p90: 950000 }
}

// ============ COMPONENTS ============

function Header({ onNavigate, currentView }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo" onClick={() => onNavigate('landing')}>
          <span>💰</span>
          <span>MyCryptoDevPay</span>
        </div>
        <nav className="nav-links">
          <span className={`nav-link ${currentView === 'landing' ? 'active' : ''}`} onClick={() => onNavigate('landing')}>Find Salary</span>
          <span className={`nav-link ${currentView === 'submit' ? 'active' : ''}`} onClick={() => onNavigate('submit')}>Submit Data</span>
        </nav>
      </div>
    </header>
  )
}

function LandingChoice({ onSelect }) {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Crypto Compensation Benchmarking</h1>
      <p className="landing-subtitle">
        Open-source, transparent salary data for the crypto industry. 
        Find out what you should earn based on role evaluation, not guesswork.
      </p>
      
      <div className="choice-cards">
        <div className="choice-card" onClick={() => onSelect('jd-upload')}>
          <div className="choice-icon">📄</div>
          <h3 className="choice-title">I have a Job Description</h3>
          <p className="choice-description">
            Paste a job description and our AI will analyze it to suggest the appropriate level and compensation range.
          </p>
          <span className="tag tag-purple">AI-Powered</span>
        </div>
        
        <div className="choice-card" onClick={() => onSelect('dropdown')}>
          <div className="choice-icon">🎯</div>
          <h3 className="choice-title">I'll Select Criteria</h3>
          <p className="choice-description">
            Choose job family, level, company size to find compensation benchmarks.
          </p>
          <span className="tag tag-blue">Manual Selection</span>
        </div>
        
        <div className="choice-card" onClick={() => onSelect('submit')}>
          <div className="choice-icon">📊</div>
          <h3 className="choice-title">Contribute My Data</h3>
          <p className="choice-description">
            Help build the open-source compensation database by anonymously submitting your salary.
          </p>
          <span className="tag tag-green">Help the Community</span>
        </div>
      </div>
    </div>
  )
}

function JDUploadFlow({ onComplete, onBack }) {
  const [step, setStep] = useState(1)
  const [jobTitle, setJobTitle] = useState('')
  const [jdText, setJdText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [companyStage, setCompanyStage] = useState('')
  const [companySizeIndicator, setCompanySizeIndicator] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const wordCount = jdText.trim().split(/\s+/).filter(w => w.length > 0).length
  const isValidJD = wordCount >= 100
  
  const analyzeJD = () => {
    setIsLoading(true)
    setTimeout(() => {
      // Simple keyword-based analysis
      const text = jdText.toLowerCase()
      let family = 'engineering'
      let subfamily = 'backend'
      let level = 'IC3'
      let isCryptoNative = false
      
      // Detect family
      if (text.includes('product manager') || text.includes('product management')) {
        family = 'product'; subfamily = 'productManagement'
      } else if (text.includes('design') || text.includes('ux') || text.includes('ui')) {
        family = 'product'; subfamily = 'design'
      } else if (text.includes('smart contract') || text.includes('solidity')) {
        family = 'engineering'; subfamily = 'smartContract'; isCryptoNative = true
      } else if (text.includes('protocol') || text.includes('blockchain core')) {
        family = 'engineering'; subfamily = 'protocol'; isCryptoNative = true
      } else if (text.includes('security') || text.includes('audit')) {
        family = 'engineering'; subfamily = 'security'
      } else if (text.includes('frontend') || text.includes('react')) {
        family = 'engineering'; subfamily = 'frontend'
      } else if (text.includes('governance') || text.includes('dao')) {
        family = 'governance'; subfamily = 'governanceLead'; isCryptoNative = true
      } else if (text.includes('tokenomics')) {
        family = 'governance'; subfamily = 'tokenomics'; isCryptoNative = true
      }
      
      // Detect level
      if (text.includes('junior') || text.includes('entry') || text.includes('0-2 years')) level = 'IC1'
      else if (text.includes('senior') && !text.includes('staff')) level = 'IC3'
      else if (text.includes('staff') || text.includes('lead')) level = 'IC4'
      else if (text.includes('principal') || text.includes('architect')) level = 'IC5'
      else if (text.includes('director')) level = 'D1'
      else if (text.includes('vp') || text.includes('chief')) level = 'VP'
      else if (text.includes('manager')) level = 'M1'
      
      // Crypto detection
      if (text.includes('crypto') || text.includes('web3') || text.includes('defi') || text.includes('blockchain')) {
        isCryptoNative = true
      }
      
      setAnalysis({
        family,
        subfamily,
        level,
        isCryptoNative,
        familyName: jobFamilies[family].name,
        subfamilyName: jobFamilies[family].subfamilies[subfamily].name
      })
      setIsLoading(false)
      setStep(2)
    }, 1500)
  }
  
  const getSizeOptions = () => {
    if (companyStage === 'tokenLive') return marketCapRanges
    if (companyStage === 'dao') return treasuryRanges
    return fundingRanges
  }
  
  const handleSubmit = () => {
    onComplete({
      level: analysis.level,
      family: analysis.family,
      subfamily: analysis.subfamily,
      familyName: analysis.familyName,
      subfamilyName: analysis.subfamilyName,
      isCryptoNative: analysis.isCryptoNative,
      companyStage,
      jobTitle: jobTitle || analysis.subfamilyName
    })
  }

  if (isLoading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Analyzing job description...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {step === 1 && (
        <div className="card">
          <h2>📄 Paste Your Job Description</h2>
          
          <div className="form-group">
            <label className="form-label">Job Title (optional)</label>
            <input type="text" className="form-input" placeholder="e.g., Senior Smart Contract Engineer" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea className="form-textarea" placeholder="Paste the full job description here (minimum 100 words)..." value={jdText} onChange={(e) => setJdText(e.target.value)} />
            <p className="form-sublabel" style={{ color: isValidJD ? 'var(--accent-green)' : 'var(--text-muted)' }}>
              {wordCount} / 100 words minimum {isValidJD && '✓'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button className="btn btn-primary" onClick={analyzeJD} disabled={!isValidJD} style={{ flex: 1 }}>
              🔍 Analyze Job Description
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && analysis && (
        <div className="card">
          <h2>🎯 AI Analysis Results</h2>
          
          <div className="results-grid">
            <div><span className="label">Suggested Level:</span> <span className="level-badge">{analysis.level}</span></div>
            <div><span className="label">Job Family:</span> {analysis.familyName}</div>
            <div><span className="label">Subfamily:</span> {analysis.subfamilyName}</div>
          </div>
          
          {analysis.isCryptoNative && <span className="tag tag-purple" style={{ marginTop: '1rem', display: 'inline-block' }}>🔗 Crypto-Native Role</span>}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)} style={{ flex: 1 }}>Confirm & Continue →</button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="card">
          <h2>🏢 Company Information</h2>
          
          <div className="form-group">
            <label className="form-label">Company Stage *</label>
            <select className="form-select" value={companyStage} onChange={(e) => { setCompanyStage(e.target.value); setCompanySizeIndicator('') }}>
              <option value="">Select stage...</option>
              {companyStages.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </div>
          
          {companyStage && (
            <div className="form-group">
              <label className="form-label">{companyStage === 'tokenLive' ? 'Market Cap' : companyStage === 'dao' ? 'Treasury Size' : 'Funding Raised'} *</label>
              <select className="form-select" value={companySizeIndicator} onChange={(e) => setCompanySizeIndicator(e.target.value)}>
                <option value="">Select range...</option>
                {getSizeOptions().map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
              </select>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={!companyStage || !companySizeIndicator} style={{ flex: 1 }}>
              🎯 Get Compensation Data
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownFlow({ onComplete, onBack }) {
  const [family, setFamily] = useState('')
  const [subfamily, setSubfamily] = useState('')
  const [level, setLevel] = useState('')
  const [companyStage, setCompanyStage] = useState('')
  const [companySizeIndicator, setCompanySizeIndicator] = useState('')
  
  const getSubfamilies = () => {
    if (!family) return []
    return Object.entries(jobFamilies[family].subfamilies).map(([code, data]) => ({ code, ...data }))
  }
  
  const getSizeOptions = () => {
    if (companyStage === 'tokenLive') return marketCapRanges
    if (companyStage === 'dao') return treasuryRanges
    return fundingRanges
  }
  
  const isCryptoNative = () => {
    const cryptoSubfamilies = ['protocol', 'smartContract', 'security', 'cryptography', 'governanceLead', 'delegate', 'daoOps', 'tokenomics']
    return cryptoSubfamilies.includes(subfamily)
  }
  
  const handleSubmit = () => {
    onComplete({
      level,
      family,
      subfamily,
      familyName: jobFamilies[family].name,
      subfamilyName: jobFamilies[family].subfamilies[subfamily].name,
      isCryptoNative: isCryptoNative(),
      companyStage
    })
  }
  
  const isComplete = family && subfamily && level && companyStage && companySizeIndicator

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="card">
        <h2>🎯 Select Role Criteria</h2>
        
        <div className="form-group">
          <label className="form-label">Job Family *</label>
          <select className="form-select" value={family} onChange={(e) => { setFamily(e.target.value); setSubfamily('') }}>
            <option value="">Select job family...</option>
            {Object.entries(jobFamilies).map(([code, data]) => <option key={code} value={code}>{data.name}</option>)}
          </select>
        </div>
        
        {family && (
          <div className="form-group">
            <label className="form-label">Subfamily *</label>
            <select className="form-select" value={subfamily} onChange={(e) => setSubfamily(e.target.value)}>
              <option value="">Select subfamily...</option>
              {getSubfamilies().map(s => <option key={s.code} value={s.code}>{s.icon} {s.name}</option>)}
            </select>
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label">Seniority Level *</label>
          <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Select level...</option>
            {seniorityLevels.map(l => <option key={l.code} value={l.code}>{l.code} - {l.name}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Company Stage *</label>
          <select className="form-select" value={companyStage} onChange={(e) => { setCompanyStage(e.target.value); setCompanySizeIndicator('') }}>
            <option value="">Select stage...</option>
            {companyStages.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </div>
        
        {companyStage && (
          <div className="form-group">
            <label className="form-label">{companyStage === 'tokenLive' ? 'Market Cap' : companyStage === 'dao' ? 'Treasury Size' : 'Funding Raised'} *</label>
            <select className="form-select" value={companySizeIndicator} onChange={(e) => setCompanySizeIndicator(e.target.value)}>
              <option value="">Select range...</option>
              {getSizeOptions().map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
            </select>
          </div>
        )}
        
        {subfamily && isCryptoNative() && (
          <span className="tag tag-purple">🔗 Crypto-Native Role (+5% Knowledge)</span>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!isComplete} style={{ flex: 1 }}>
            🎯 Get Compensation Data
          </button>
        </div>
      </div>
    </div>
  )
}

function SubmitCompFlow({ onComplete, onBack }) {
  const [family, setFamily] = useState('')
  const [subfamily, setSubfamily] = useState('')
  const [level, setLevel] = useState('')
  const [companyStage, setCompanyStage] = useState('')
  const [baseSalary, setBaseSalary] = useState('')
  const [totalComp, setTotalComp] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [verificationMethod, setVerificationMethod] = useState('')
  
  const getSubfamilies = () => {
    if (!family) return []
    return Object.entries(jobFamilies[family].subfamilies).map(([code, data]) => ({ code, ...data }))
  }
  
  const formatCurrency = (value) => {
    const num = value.replace(/[^0-9]/g, '')
    if (!num) return ''
    return '$' + parseInt(num).toLocaleString()
  }
  
  const handleSubmit = () => {
    onComplete({
      family, subfamily, level, companyStage,
      base: parseInt(baseSalary.replace(/[^0-9]/g, '')),
      totalComp: parseInt(totalComp.replace(/[^0-9]/g, '')),
      employmentType, verificationMethod
    })
  }
  
  const isComplete = family && subfamily && level && companyStage && baseSalary && totalComp && employmentType && verificationMethod

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="card">
        <h2>📊 Contribute Your Compensation Data</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Help build the open-source compensation database. All data is anonymized.
        </p>
        
        <div className="form-group">
          <label className="form-label">Job Family *</label>
          <select className="form-select" value={family} onChange={(e) => { setFamily(e.target.value); setSubfamily('') }}>
            <option value="">Select...</option>
            {Object.entries(jobFamilies).map(([code, data]) => <option key={code} value={code}>{data.name}</option>)}
          </select>
        </div>
        
        {family && (
          <div className="form-group">
            <label className="form-label">Subfamily *</label>
            <select className="form-select" value={subfamily} onChange={(e) => setSubfamily(e.target.value)}>
              <option value="">Select...</option>
              {getSubfamilies().map(s => <option key={s.code} value={s.code}>{s.icon} {s.name}</option>)}
            </select>
          </div>
        )}
        
        <div className="form-group">
          <label className="form-label">Your Level *</label>
          <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Select...</option>
            {seniorityLevels.map(l => <option key={l.code} value={l.code}>{l.code} - {l.name}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Company Stage *</label>
          <select className="form-select" value={companyStage} onChange={(e) => setCompanyStage(e.target.value)}>
            <option value="">Select...</option>
            {companyStages.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Base Salary (Annual USD) *</label>
          <input type="text" className="form-input" placeholder="$150,000" value={baseSalary} onChange={(e) => setBaseSalary(formatCurrency(e.target.value))} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Total Compensation (Base + Bonus + Equity) *</label>
          <input type="text" className="form-input" placeholder="$250,000" value={totalComp} onChange={(e) => setTotalComp(formatCurrency(e.target.value))} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Employment Type *</label>
          <select className="form-select" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
            <option value="">Select...</option>
            {employmentTypes.map(t => <option key={t.code} value={t.code}>{t.name}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Verification Method *</label>
          <select className="form-select" value={verificationMethod} onChange={(e) => setVerificationMethod(e.target.value)}>
            <option value="">Select...</option>
            {verificationMethods.map(v => <option key={v.code} value={v.code}>{v.name}</option>)}
          </select>
        </div>
        
        {verificationMethod === 'honor' && (
          <div className="alert alert-warning">
            ⚠️ Unverified submissions may receive less weight in aggregations.
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!isComplete} style={{ flex: 1 }}>
            ✓ Submit Data
          </button>
        </div>
      </div>
    </div>
  )
}

function ResultsView({ evaluation, onBack, onSubmitData }) {
  const level = evaluation?.level || 'IC3'
  const compData = sampleCompData[level] || sampleCompData.IC3
  const mix = payMixByLevel[level] || payMixByLevel.IC3
  
  const formatCurrency = (value) => '$' + value.toLocaleString()
  
  const breakdown = (total) => ({
    base: Math.round(total * mix.base),
    sti: Math.round(total * mix.sti),
    lti: Math.round(total * mix.lti)
  })

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="results-header">
        <h1>{evaluation?.subfamilyName || 'Role'} Compensation</h1>
        <div className="results-meta">
          <span className="level-badge">{level}</span>
          <span>{evaluation?.familyName}</span>
          {evaluation?.isCryptoNative && <span className="tag tag-purple">🔗 Crypto-Native</span>}
        </div>
      </div>
      
      <div className="card">
        <h3>💰 Total Compensation Ranges (Annual USD)</h3>
        
        <table className="comp-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>25th %ile</th>
              <th>50th (Median)</th>
              <th>75th %ile</th>
              <th>90th %ile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Salary</td>
              <td>{formatCurrency(breakdown(compData.p25).base)}</td>
              <td>{formatCurrency(breakdown(compData.p50).base)}</td>
              <td>{formatCurrency(breakdown(compData.p75).base)}</td>
              <td>{formatCurrency(breakdown(compData.p90).base)}</td>
            </tr>
            <tr>
              <td>STI / Bonus</td>
              <td>{formatCurrency(breakdown(compData.p25).sti)}</td>
              <td>{formatCurrency(breakdown(compData.p50).sti)}</td>
              <td>{formatCurrency(breakdown(compData.p75).sti)}</td>
              <td>{formatCurrency(breakdown(compData.p90).sti)}</td>
            </tr>
            <tr>
              <td>LTI / Equity</td>
              <td>{formatCurrency(breakdown(compData.p25).lti)}</td>
              <td>{formatCurrency(breakdown(compData.p50).lti)}</td>
              <td>{formatCurrency(breakdown(compData.p75).lti)}</td>
              <td>{formatCurrency(breakdown(compData.p90).lti)}</td>
            </tr>
            <tr className="total-row">
              <td><strong>Total Comp</strong></td>
              <td className="highlight">{formatCurrency(compData.p25)}</td>
              <td className="highlight">{formatCurrency(compData.p50)}</td>
              <td className="highlight">{formatCurrency(compData.p75)}</td>
              <td className="highlight">{formatCurrency(compData.p90)}</td>
            </tr>
          </tbody>
        </table>
        
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Pay Mix: Base {(mix.base * 100).toFixed(0)}% / STI {(mix.sti * 100).toFixed(0)}% / LTI {(mix.lti * 100).toFixed(0)}%
        </p>
      </div>
      
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h3>📊 Help Improve This Data</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Contribute your compensation anonymously to help the community.</p>
        <button className="btn btn-primary" onClick={onSubmitData} style={{ marginTop: '1rem' }}>
          Contribute Your Data →
        </button>
      </div>
      
      <button className="btn btn-ghost" onClick={onBack} style={{ marginTop: '2rem' }}>← Start Over</button>
    </div>
  )
}

// ============ MAIN APP ============

export default function App() {
  const [currentView, setCurrentView] = useState('landing')
  const [evaluationData, setEvaluationData] = useState(null)

  const handleEvaluationComplete = (data) => {
    setEvaluationData(data)
    setCurrentView('results')
  }

  const handleSubmissionComplete = (data) => {
    const submissions = JSON.parse(localStorage.getItem('mycryptodevpay_submissions') || '[]')
    submissions.push({ ...data, id: Date.now(), timestamp: new Date().toISOString() })
    localStorage.setItem('mycryptodevpay_submissions', JSON.stringify(submissions))
    alert('Thank you! Your compensation data has been submitted.')
    setCurrentView('landing')
  }

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <LandingChoice onSelect={setCurrentView} />
      case 'jd-upload': return <JDUploadFlow onComplete={handleEvaluationComplete} onBack={() => setCurrentView('landing')} />
      case 'dropdown': return <DropdownFlow onComplete={handleEvaluationComplete} onBack={() => setCurrentView('landing')} />
      case 'submit': return <SubmitCompFlow onComplete={handleSubmissionComplete} onBack={() => setCurrentView('landing')} />
      case 'results': return <ResultsView evaluation={evaluationData} onBack={() => setCurrentView('landing')} onSubmitData={() => setCurrentView('submit')} />
      default: return <LandingChoice onSelect={setCurrentView} />
    }
  }

  return (
    <div className="app-container">
      <Header onNavigate={setCurrentView} currentView={currentView} />
      <main className="main-content">{renderView()}</main>
      <footer className="app-footer">
        <p>MyCryptoDevPay © 2025 | Open Source Compensation Framework</p>
        <p className="footer-note">Data is aggregated and anonymized.</p>
      </footer>
    </div>
  )
}
