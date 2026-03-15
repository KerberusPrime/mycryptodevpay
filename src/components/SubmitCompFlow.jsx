import React, { useState } from 'react'
import {
  jobFamilies, seniorityLevels, companyStages,
  employmentTypes, verificationMethods,
} from '../data/jobCatalog.js'
import { saveSubmission } from '../utils/dataService.js'

function formatCurrency(value) {
  const num = value.replace(/[^0-9]/g, '')
  if (!num) return ''
  return '$' + parseInt(num).toLocaleString()
}

export default function SubmitCompFlow({ onComplete, onBack }) {
  const [family, setFamily]                     = useState('')
  const [subfamily, setSubfamily]               = useState('')
  const [level, setLevel]                       = useState('')
  const [companyStage, setCompanyStage]         = useState('')
  const [baseSalary, setBaseSalary]             = useState('')
  const [totalComp, setTotalComp]               = useState('')
  const [employmentType, setEmploymentType]     = useState('')
  const [verificationMethod, setVerification]   = useState('')
  const [isSubmitting, setIsSubmitting]         = useState(false)
  const [submitError, setSubmitError]           = useState(null)

  const subfamilies = family
    ? Object.entries(jobFamilies[family].subfamilies).map(([code, data]) => ({ code, ...data }))
    : []

  const isComplete =
    family && subfamily && level && companyStage &&
    baseSalary && totalComp && employmentType && verificationMethod

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await saveSubmission({
      family,
      subfamily,
      level,
      companyStage,
      base:               parseInt(baseSalary.replace(/[^0-9]/g, '')),
      totalComp:          parseInt(totalComp.replace(/[^0-9]/g, '')),
      employmentType,
      verificationMethod,
    })

    setIsSubmitting(false)

    if (result.success) {
      onComplete()
    } else {
      setSubmitError(result.error || 'Submission failed — please try again.')
    }
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="card">
        <h2>📊 Contribute Your Compensation Data</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Help build the open-source compensation database. All data is anonymized and
          only shown in aggregate once a role has 5+ submissions.
        </p>

        {/* Job Family */}
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

        {/* Subfamily */}
        {family && (
          <div className="form-group">
            <label className="form-label">Subfamily *</label>
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

        {/* Level */}
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
        </div>

        {/* Company Stage */}
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

        {/* Base Salary */}
        <div className="form-group">
          <label className="form-label">Base Salary (Annual USD) *</label>
          <input
            type="text"
            className="form-input"
            placeholder="$150,000"
            value={baseSalary}
            onChange={e => setBaseSalary(formatCurrency(e.target.value))}
          />
        </div>

        {/* Total Comp */}
        <div className="form-group">
          <label className="form-label">Total Compensation (Base + Bonus + Equity, annualized) *</label>
          <input
            type="text"
            className="form-input"
            placeholder="$250,000"
            value={totalComp}
            onChange={e => setTotalComp(formatCurrency(e.target.value))}
          />
        </div>

        {/* Employment Type */}
        <div className="form-group">
          <label className="form-label">Employment Type *</label>
          <select
            className="form-select"
            value={employmentType}
            onChange={e => setEmploymentType(e.target.value)}
          >
            <option value="">Select…</option>
            {employmentTypes.map(t => (
              <option key={t.code} value={t.code}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Verification */}
        <div className="form-group">
          <label className="form-label">Verification Method *</label>
          <select
            className="form-select"
            value={verificationMethod}
            onChange={e => setVerification(e.target.value)}
          >
            <option value="">Select…</option>
            {verificationMethods.map(v => (
              <option key={v.code} value={v.code}>{v.name}</option>
            ))}
          </select>
        </div>

        {verificationMethod === 'honor' && (
          <div className="alert alert-warning">
            ⚠️ Unverified submissions receive lower weight in aggregations and are marked accordingly.
          </div>
        )}

        {submitError && (
          <div className="alert alert-warning">❌ {submitError}</div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isComplete || isSubmitting}
            style={{ flex: 1 }}
          >
            {isSubmitting ? 'Submitting…' : '✓ Submit Data'}
          </button>
        </div>
      </div>
    </div>
  )
}
