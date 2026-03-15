import React, { useState } from 'react'
import { jobFamilies, companyStages, marketCapRanges, fundingRanges, treasuryRanges } from '../data/jobCatalog.js'
import { analyzeJobDescription } from '../utils/aiAnalyzer.js'
import StepProgress from './StepProgress.jsx'

const STEPS = [
  { label: 'Job Description' },
  { label: 'Review Analysis' },
  { label: 'Company Context' },
]

const CONFIDENCE_META = {
  high:   { label: 'High confidence', color: 'var(--success)',  icon: '✓' },
  medium: { label: 'Medium confidence', color: 'var(--warning)', icon: '~' },
  low:    { label: 'Low confidence — review carefully', color: 'var(--danger)', icon: '!' },
}

function getSizeOptions(companyStage) {
  if (companyStage === 'tokenLive') return marketCapRanges
  if (companyStage === 'dao')       return treasuryRanges
  return fundingRanges
}

function getSizeLabel(companyStage) {
  if (companyStage === 'tokenLive') return 'Protocol Market Cap'
  if (companyStage === 'dao')       return 'Treasury Size'
  return 'Total Funding Raised'
}

function getSizeHint(companyStage) {
  if (companyStage === 'tokenLive') return 'Market cap significantly affects compensation — token-live protocols with >$500M MC typically pay at or above Series C rates.'
  if (companyStage === 'dao')       return 'Treasury size reflects the DAO\'s ability to sustain competitive contributor compensation.'
  return 'Funding raised is the strongest predictor of base salary at early-stage companies.'
}

export default function JDUploadFlow({ onComplete, onBack }) {
  const [step, setStep]                                 = useState(1)
  const [jobTitle, setJobTitle]                         = useState('')
  const [jdText, setJdText]                             = useState('')
  const [analysis, setAnalysis]                         = useState(null)
  const [companyStage, setCompanyStage]                 = useState('')
  const [companySizeIndicator, setCompanySizeIndicator] = useState('')
  const [isLoading, setIsLoading]                       = useState(false)

  const wordCount = jdText.trim().split(/\s+/).filter(w => w.length > 0).length
  const isValidJD = wordCount >= 100

  const handleAnalyze = () => {
    setIsLoading(true)
    setTimeout(() => {
      const result = analyzeJobDescription(jdText)
      setAnalysis(result)
      setIsLoading(false)
      setStep(2)
    }, 900)
  }

  const handleSubmit = () => {
    onComplete({
      level:               analysis.level,
      family:              analysis.family,
      subfamily:           analysis.subfamily,
      familyName:          analysis.familyName,
      subfamilyName:       analysis.subfamilyName,
      isCryptoNative:      analysis.isCryptoNative,
      isSecurityRole:      analysis.isSecurityRole,
      companyStage,
      companySizeIndicator,
      jobTitle:            jobTitle || analysis.subfamilyName,
      sourceFlow:          'jd',
    })
  }

  if (isLoading) {
    return (
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <StepProgress steps={STEPS} current={1} />
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div className="loading-spinner" />
          <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Analyzing job description…
          </p>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Detecting role family · Scoring seniority signals · Flagging mismatches
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <StepProgress steps={STEPS} current={step} />

      {/* ── Step 1: Paste JD ─────────────────────────────── */}
      {step === 1 && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">Paste the job description</h2>
            <p className="flow-subtitle">
              Include the full text — responsibilities, requirements and context.
              The more detail, the more accurate the analysis.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Job Title <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional — helps with matching)</span></label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Senior Smart Contract Engineer"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Job Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Paste the complete job description here including responsibilities, requirements, and any compensation details…"
              value={jdText}
              onChange={e => setJdText(e.target.value)}
            />
            <p
              className="word-count"
              style={{ color: isValidJD ? 'var(--success)' : wordCount > 60 ? 'var(--warning)' : 'var(--text-muted)' }}
            >
              {isValidJD ? `✓ ${wordCount} words — ready to analyze` : `${wordCount} / 100 words minimum`}
            </p>
          </div>

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAnalyze}
              disabled={!isValidJD}
              style={{ flex: 1 }}
            >
              Analyze Job Description →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Review Analysis ───────────────────────── */}
      {step === 2 && analysis && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">Review the analysis</h2>
            <p className="flow-subtitle">
              Our analyzer identified the following role profile. Review and continue if it looks right.
            </p>
          </div>

          <div className="analysis-grid">
            <div className="analysis-item">
              <span className="analysis-label">Suggested Level</span>
              <span className="level-badge" style={{ alignSelf: 'flex-start', marginTop: '2px' }}>{analysis.level}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Job Family</span>
              <span className="analysis-value">{analysis.familyName}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Specialty</span>
              <span className="analysis-value">{analysis.subfamilyName}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Match Quality</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: CONFIDENCE_META[analysis.confidence]?.color }}>
                {CONFIDENCE_META[analysis.confidence]?.icon} {CONFIDENCE_META[analysis.confidence]?.label}
              </span>
            </div>
          </div>

          {/* Role modifiers */}
          {(analysis.isCryptoNative || analysis.isSecurityRole) && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0 0 1rem' }}>
              {analysis.isCryptoNative && (
                <span className="tag tag-brand">⬡ Crypto-Native Role  (+5% knowledge weighting)</span>
              )}
              {analysis.isSecurityRole && (
                <span className="tag tag-warning">🔒 Security Specialist (+10% problem-solving weighting)</span>
              )}
            </div>
          )}

          {/* Flags */}
          {analysis.flags.length > 0 && (
            <div className="flags-list">
              {analysis.flags.map((f, i) => (
                <div key={i} className="alert alert-warning">{f}</div>
              ))}
            </div>
          )}

          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            ℹ️ Not quite right? The dropdown flow lets you manually select each dimension for a more controlled result.
          </div>

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} style={{ flex: 1 }}>
              Confirm & Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Company Context ───────────────────────── */}
      {step === 3 && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">Company context</h2>
            <p className="flow-subtitle">
              Stage and size are the biggest drivers of comp variation — a Series A pays
              roughly 30% less than a Series C for the same role, while top-market-cap
              token-live protocols can pay a premium.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Company Stage *</label>
            <select
              className="form-select"
              value={companyStage}
              onChange={e => { setCompanyStage(e.target.value); setCompanySizeIndicator('') }}
            >
              <option value="">Select the company's current stage…</option>
              {companyStages.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          {companyStage && (
            <div className="form-group">
              <label className="form-label">{getSizeLabel(companyStage)} *</label>
              <select
                className="form-select"
                value={companySizeIndicator}
                onChange={e => setCompanySizeIndicator(e.target.value)}
              >
                <option value="">Select range…</option>
                {getSizeOptions(companyStage).map(o => (
                  <option key={o.code} value={o.code}>{o.name}</option>
                ))}
              </select>
              <p className="form-hint">{getSizeHint(companyStage)}</p>
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={!companyStage || !companySizeIndicator}
              style={{ flex: 1 }}
            >
              Get Compensation Data →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
