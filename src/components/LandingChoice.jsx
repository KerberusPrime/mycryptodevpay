import React from 'react'

export default function LandingChoice({ onSelect }) {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Crypto Compensation Benchmarking</h1>
      <p className="landing-subtitle">
        Open-source, transparent salary data for the crypto industry.
        Find out what you should earn based on role evaluation — not guesswork.
      </p>

      <div className="choice-cards">
        <div className="choice-card" onClick={() => onSelect('jd-upload')}>
          <div className="choice-icon">📄</div>
          <h3 className="choice-title">I have a Job Description</h3>
          <p className="choice-description">
            Paste a job description and our analyzer will extract the appropriate level,
            flag mismatches, and give you a compensation range.
          </p>
          <span className="tag tag-purple">AI-Powered</span>
        </div>

        <div className="choice-card" onClick={() => onSelect('dropdown')}>
          <div className="choice-icon">🎯</div>
          <h3 className="choice-title">I'll Select Criteria</h3>
          <p className="choice-description">
            Choose job family, level and company context to instantly see
            stage-adjusted compensation benchmarks.
          </p>
          <span className="tag tag-blue">Manual Selection</span>
        </div>

        <div className="choice-card" onClick={() => onSelect('submit')}>
          <div className="choice-icon">📊</div>
          <h3 className="choice-title">Contribute My Data</h3>
          <p className="choice-description">
            Help build the open-source compensation database by anonymously
            submitting your salary.
          </p>
          <span className="tag tag-green">Help the Community</span>
        </div>
      </div>

      <div className="methodology-note">
        <p>
          Compensation ranges are derived using the{' '}
          <strong>Points-Factor evaluation methodology</strong> — the same
          framework used by Fortune 500 compensation teams, adapted for crypto.
        </p>
      </div>
    </div>
  )
}
