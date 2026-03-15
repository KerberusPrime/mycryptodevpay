import React, { useEffect, useState } from 'react'

function getSubmissionCount() {
  try {
    const stored = localStorage.getItem('mcdp_submissions')
    if (!stored) return 0
    return JSON.parse(stored).length
  } catch {
    return 0
  }
}

export default function LandingChoice({ onSelect, submissionCount: propCount }) {
  const [subCount, setSubCount] = useState(propCount ?? 0)

  useEffect(() => {
    // Also read from localStorage in case prop isn't provided yet
    const local = getSubmissionCount()
    setSubCount(Math.max(propCount ?? 0, local))
  }, [propCount])

  const displayCount = subCount > 0
    ? `${subCount.toLocaleString()} salary data point${subCount !== 1 ? 's' : ''} contributed`
    : '7 job families · 24 specialties'

  return (
    <div className="landing-container">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="landing-hero">
        <div className="landing-eyebrow">
          ⬡ Open-Source · Points-Factor Methodology
        </div>

        <h1 className="landing-title">
          Know your worth<br />in crypto.
        </h1>

        <p className="landing-subtitle">
          Transparent, methodology-backed compensation benchmarks for the
          crypto industry — built on a rigorous evaluation framework, not job-title guesswork.
        </p>

        {/* Trust strip */}
        <div className="trust-strip">
          <div className="trust-item">
            <span className="trust-dot" />
            Community-powered data
          </div>
          <div className="trust-item">
            <span className="trust-dot" />
            No login required
          </div>
          <div className="trust-item">
            <span className="trust-dot" />
            MIT open-source
          </div>
          <div className="trust-item">
            <span className="trust-dot" />
            {displayCount}
          </div>
        </div>
      </div>

      {/* ── Path cards ───────────────────────────────────── */}
      <p className="choice-section-label">How would you like to start?</p>

      <div className="choice-cards">

        {/* Primary: JD Upload */}
        <div className="choice-card primary" onClick={() => onSelect('jd-upload')}>
          <div className="choice-icon">📄</div>
          <div className="choice-body">
            <h3 className="choice-title">Analyze a Job Description</h3>
            <p className="choice-description">
              Paste any job description. Our analyzer reads it, identifies the role level,
              flags title-vs-responsibility mismatches, and returns a stage-adjusted
              compensation range in seconds.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              <span className="tag tag-brand">AI-Powered</span>
              <span className="tag tag-muted">~60 seconds</span>
            </div>
            <span className="choice-cta">Start with a JD →</span>
          </div>
        </div>

        {/* Manual Select */}
        <div className="choice-card" onClick={() => onSelect('dropdown')}>
          <div className="choice-icon">🎯</div>
          <div className="choice-body">
            <h3 className="choice-title">Select Role Criteria</h3>
            <p className="choice-description">
              Choose your job family, specialty, level and company stage to
              instantly see benchmarked compensation ranges.
            </p>
            <span className="tag tag-info">Manual Selection</span>
          </div>
        </div>

        {/* Check My Offer */}
        <div className="choice-card" onClick={() => onSelect('offer-check')}>
          <div className="choice-icon">💰</div>
          <div className="choice-body">
            <h3 className="choice-title">Check My Offer</h3>
            <p className="choice-description">
              Have an offer in hand? Enter the numbers and see exactly where it lands
              in the market distribution — with a negotiation gap analysis.
            </p>
            <span className="tag tag-success">Offer Analysis</span>
          </div>
        </div>

        {/* Token Calculator */}
        <div className="choice-card" onClick={() => onSelect('token-calc')}>
          <div className="choice-icon">🪙</div>
          <div className="choice-body">
            <h3 className="choice-title">Token Grant Calculator</h3>
            <p className="choice-description">
              Convert your token allocation into a risk-adjusted annual comp figure.
              Handles vesting, cliff, lock-ups, and pre-TGE discounts.
            </p>
            <span className="tag tag-warning">Token Valuation</span>
          </div>
        </div>

        {/* Submit */}
        <div className="choice-card" onClick={() => onSelect('submit')}>
          <div className="choice-icon">🤝</div>
          <div className="choice-body">
            <h3 className="choice-title">Contribute Your Salary</h3>
            <p className="choice-description">
              Anonymous submissions improve accuracy for everyone. Data only
              surfaces once 5+ people have contributed for a role.
            </p>
            <span className="tag tag-muted">Help the Community</span>
          </div>
        </div>

      </div>

      {/* ── How it works ─────────────────────────────────── */}
      <div className="how-it-works">
        <div className="how-step">
          <div className="how-step-num">1</div>
          Describe your role
        </div>
        <span className="how-step-arrow">→</span>
        <div className="how-step">
          <div className="how-step-num">2</div>
          We score it on 5 factors
        </div>
        <span className="how-step-arrow">→</span>
        <div className="how-step">
          <div className="how-step-num">3</div>
          Get stage-adjusted benchmarks
        </div>
        <span className="how-step-arrow">→</span>
        <div className="how-step">
          <div className="how-step-num">4</div>
          Negotiate with confidence
        </div>
      </div>

    </div>
  )
}
