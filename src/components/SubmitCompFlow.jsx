import React, { useState } from 'react'
import {
  jobFamilies, seniorityLevels, companyStages,
  employmentTypes, verificationMethods,
} from '../data/jobCatalog.js'
import { saveSubmission } from '../utils/dataService.js'
import StepProgress from './StepProgress.jsx'

const STEPS = [
  { label: 'Role Details' },
  { label: 'Compensation' },
  { label: 'Verify & Submit' },
]

function formatCurrency(value) {
  const num = value.replace(/[^0-9]/g, '')
  if (!num) return ''
  return '$' + parseInt(num).toLocaleString()
}

export default function SubmitCompFlow({ onComplete, onBack }) {
  const [step, setStep]                   = useState(1)
  const [family, setFamily]               = useState('')
  const [subfamily, setSubfamily]         = useState('')
  const [level, setLevel]                 = useState('')
  const [companyStage, setCompanyStage]   = useState('')
  const [baseSalary, setBaseSalary]       = useState('')
  const [totalComp, setTotalComp]         = useState('')
  const [employmentType, setEmployment]   = useState('')
  const [verificationMethod, setVerify]   = useState('')
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [submitError, setSubmitError]     = useState(null)
  const [submitted, setSubmitted]         = useState(false)

  const subfamilies = family
    ? Object.entries(jobFamilies[family].subfamilies).map(([code, data]) => ({ code, ...data }))
    : []

  const step1Complete = family && subfamily && level && companyStage
  const step2Complete = baseSalary && totalComp && employmentType

  // Infer ratio for a quick sanity check
  const baseNum  = parseInt(baseSalary.replace(/[^0-9]/g, '')) || 0
  const totalNum = parseInt(totalComp.replace(/[^0-9]/g, '')) || 0
  const baseRatio = totalNum > 0 ? baseNum / totalNum : 0
  const ratioOk   = baseRatio >= 0.3 && baseRatio <= 1.0

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await saveSubmission({
      family,
      subfamily,
      level,
      companyStage,
      base:               baseNum,
      totalComp:          totalNum,
      employmentType,
      verificationMethod,
    })

    setIsSubmitting(false)

    if (result.success) {
      setSubmitted(true)
      onComplete()
    } else {
      setSubmitError(result.error || 'Submission failed — please try again.')
    }
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="success-state card">
          <div className="success-icon">✓</div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Thank you for contributing
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Your submission has been recorded anonymously. Once 5 or more people
            contribute data for this role, it will appear in the benchmark results.
          </p>
          <button className="btn btn-primary" onClick={onBack}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <StepProgress steps={STEPS} current={step} />

      {/* ── Step 1: Role Details ──────────────────────────── */}
      {step === 1 && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">Your role details</h2>
            <p className="flow-subtitle">
              Be as specific as possible — this helps calibrate the data for others in similar roles.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Job Family *</label>
            <select
              className="form-select"
              value={family}
              onChange={e => { setFamily(e.target.value); setSubfamily('') }}
            >
              <option value="">Select…</option>
              {Object.entries(jobFamilies).map(([code, data]) => (
                <option key={code} value={code}>{data.name}</option>
              ))}
            </select>
          </div>

          {family && (
            <div className="form-group">
              <label className="form-label">Specialty Area *</label>
              <select
                className="form-select"
                value={subfamily}
                onChange={e => setSubfamily(e.target.value)}
              >
                <option value="">Select…</option>
                {subfamilies.map(s => (
                  <option key={s.code} value={s.code}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Your Level *</label>
            <select
              className="form-select"
              value={level}
              onChange={e => setLevel(e.target.value)}
            >
              <option value="">Select…</option>
              {seniorityLevels.map(l => (
                <option key={l.code} value={l.code}>{l.code} — {l.name}</option>
              ))}
            </select>
            <p className="form-hint">Select the level that best matches your internal band or equivalent seniority.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Company Stage *</label>
            <select
              className="form-select"
              value={companyStage}
              onChange={e => setCompanyStage(e.target.value)}
            >
              <option value="">Select…</option>
              {companyStages.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setStep(2)}
              disabled={!step1Complete}
              style={{ flex: 1 }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Compensation ──────────────────────────── */}
      {step === 2 && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">Your compensation</h2>
            <p className="flow-subtitle">
              All data is stored anonymously and only shown in aggregate.
              Enter your most recent annual figures in USD.
            </p>
          </div>

          <div className="alert alert-info">
            🔒 We never store your identity, company name, or any identifying information.
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Base Salary (Annual USD) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="$150,000"
              value={baseSalary}
              onChange={e => setBaseSalary(formatCurrency(e.target.value))}
            />
            <p className="form-hint">Cash base salary only — exclude bonus and equity.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Total Annual Compensation *</label>
            <input
              type="text"
              className="form-input"
              placeholder="$250,000"
              value={totalComp}
              onChange={e => setTotalComp(formatCurrency(e.target.value))}
            />
            <p className="form-hint">Base + annual bonus + equity/tokens annualized over your vesting period. For token grants, use fair market value at grant date.</p>
          </div>

          {/* Sanity check */}
          {baseSalary && totalComp && !ratioOk && (
            <div className="alert alert-warning">
              ⚠️ Your base salary appears to be less than 30% of total comp. Is this correct?
              Token-heavy packages are valid — just confirm the figures.
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Employment Type *</label>
            <select
              className="form-select"
              value={employmentType}
              onChange={e => setEmployment(e.target.value)}
            >
              <option value="">Select…</option>
              {employmentTypes.map(t => (
                <option key={t.code} value={t.code}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setStep(3)}
              disabled={!step2Complete}
              style={{ flex: 1 }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Verify & Submit ───────────────────────── */}
      {step === 3 && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">Verify & submit</h2>
            <p className="flow-subtitle">
              Verified submissions carry more weight in aggregations.
              Choose the method that works for you — or submit unverified.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Verification Method *</label>
            {verificationMethods.map(v => (
              <label
                key={v.code}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  background: verificationMethod === v.code ? 'rgba(124,58,237,0.08)' : 'var(--bg-elevated)',
                  border: `1px solid ${verificationMethod === v.code ? 'var(--border-brand)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  transition: 'all 0.15s',
                }}
              >
                <input
                  type="radio"
                  name="verification"
                  value={v.code}
                  checked={verificationMethod === v.code}
                  onChange={() => setVerify(v.code)}
                  style={{ marginTop: '2px', accentColor: 'var(--brand-light)' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v.name}</div>
                  {v.code === 'honor' && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Unverified data is included but weighted lower in aggregations
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem' }}>
            <p className="card-label">Submission Summary</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Level:</span>
              <span>{level}</span>
              <span style={{ color: 'var(--text-muted)' }}>Stage:</span>
              <span>{companyStages.find(s => s.code === companyStage)?.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>Base Salary:</span>
              <span>{baseSalary}</span>
              <span style={{ color: 'var(--text-muted)' }}>Total Comp:</span>
              <span>{totalComp}</span>
            </div>
          </div>

          {submitError && (
            <div className="alert alert-warning">❌ {submitError}</div>
          )}

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleFinalSubmit}
              disabled={!verificationMethod || isSubmitting}
              style={{ flex: 1 }}
            >
              {isSubmitting ? 'Submitting…' : 'Submit Anonymously →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
