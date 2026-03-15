import React from 'react'

export default function LandingChoice({ onSelect }) {
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
            7 job families · 24 specialties
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

        {/* Secondary: Manual */}
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

        {/* Secondary: Submit */}
        <div className="choice-card" onClick={() => onSelect('submit')}>
          <div className="choice-icon">🤝</div>
          <div className="choice-body">
            <h3 className="choice-title">Contribute Your Salary</h3>
            <p className="choice-description">
              Anonymous submissions improve accuracy for everyone. Data only
              surfaces once 5+ people have contributed for a role.
            </p>
            <span className="tag tag-success">Help the Community</span>
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
