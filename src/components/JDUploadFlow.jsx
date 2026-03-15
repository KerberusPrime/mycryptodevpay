import React, { useState } from 'react'
import { jobFamilies, companyStages, marketCapRanges, fundingRanges, treasuryRanges } from '../data/jobCatalog.js'
import { analyzeJobDescription } from '../utils/aiAnalyzer.js'

const CONFIDENCE_LABEL = { high: '🟢 High', medium: '🟡 Medium', low: '🔴 Low' }

function getSizeOptions(companyStage) {
  if (companyStage === 'tokenLive') return marketCapRanges
  if (companyStage === 'dao')       return treasuryRanges
  return fundingRanges
}

function getSizeLabel(companyStage) {
  if (companyStage === 'tokenLive') return 'Market Cap'
  if (companyStage === 'dao')       return 'Treasury Size'
  return 'Funding Raised'
}

export default function JDUploadFlow({ onComplete, onBack }) {
  const [step, setStep]                           = useState(1)
  const [jobTitle, setJobTitle]                   = useState('')
  const [jdText, setJdText]                       = useState('')
  const [analysis, setAnalysis]                   = useState(null)
  const [companyStage, setCompanyStage]           = useState('')
  const [companySizeIndicator, setCompanySizeIndicator] = useState('')
  const [isLoading, setIsLoading]                 = useState(false)

  const wordCount  = jdText.trim().split(/\s+/).filter(w => w.length > 0).length
  const isValidJD  = wordCount >= 100

  const handleAnalyze = () => {
    setIsLoading(true)
    // Simulate a brief processing delay for UX
    setTimeout(() => {
      const result = analyzeJobDescription(jdText)
      setAnalysis(result)
      setIsLoading(false)
      setStep(2)
    }, 800)
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
      <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
        <div className="loading-spinner" />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Analyzing job description…
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>

      {/* ── Step 1: paste JD ─────────────────────────── */}
      {step === 1 && (
        <div className="card">
          <h2>📄 Paste Your Job Description</h2>

          <div className="form-group">
            <label className="form-label">Job Title (optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Senior Smart Contract Engineer"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Job Description *</label>
            <textarea
              className="form-textarea"
              placeholder="Paste the full job description here (minimum 100 words)…"
              value={jdText}
              onChange={e => setJdText(e.target.value)}
            />
            <p
              className="form-sublabel"
              style={{ color: isValidJD ? 'var(--accent-green)' : 'var(--text-muted)' }}
            >
              {wordCount} / 100 words minimum {isValidJD && '✓'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={!isValidJD}
              style={{ flex: 1 }}
            >
              🔍 Analyze Job Description
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: review analysis ───────────────────── */}
      {step === 2 && analysis && (
        <div className="card">
          <h2>🎯 Analysis Results</h2>

          <div className="analysis-grid">
            <div className="analysis-item">
              <span className="analysis-label">Suggested Level</span>
              <span className="level-badge">{analysis.level}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Job Family</span>
              <span>{analysis.familyName}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Subfamily</span>
              <span>{analysis.subfamilyName}</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Confidence</span>
              <span>{CONFIDENCE_LABEL[analysis.confidence]}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1rem 0' }}>
            {analysis.isCryptoNative && (
              <span className="tag tag-purple">🔗 Crypto-Native (+5% Knowledge)</span>
            )}
            {analysis.isSecurityRole && (
              <span className="tag tag-yellow">🔒 Security Uplift (+10% Problem Solving)</span>
            )}
          </div>

          {analysis.flags.length > 0 && (
            <div className="flags-list">
              {analysis.flags.map((f, i) => (
                <div key={i} className="alert alert-warning">{f}</div>
              ))}
            </div>
          )}

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '1rem 0' }}>
            Not right? You can adjust the level in the next step or go back to refine the JD.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)} style={{ flex: 1 }}>
              Confirm & Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: company context ───────────────────── */}
      {step === 3 && (
        <div className="card">
          <h2>🏢 Company Context</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Company stage and size significantly affect compensation. We apply
            stage-specific multipliers to the benchmark data.
          </p>

          <div className="form-group">
            <label className="form-label">Company Stage *</label>
            <select
              className="form-select"
              value={companyStage}
              onChange={e => { setCompanyStage(e.target.value); setCompanySizeIndicator('') }}
            >
              <option value="">Select stage…</option>
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
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!companyStage || !companySizeIndicator}
              style={{ flex: 1 }}
            >
              🎯 Get Compensation Data
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
