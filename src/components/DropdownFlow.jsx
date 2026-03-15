import React, { useState } from 'react'
import {
  jobFamilies, seniorityLevels, companyStages,
  marketCapRanges, fundingRanges, treasuryRanges,
} from '../data/jobCatalog.js'

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

// Group levels for display
const IC_LEVELS  = seniorityLevels.filter(l => l.track === 'ic')
const MGT_LEVELS = seniorityLevels.filter(l => l.track === 'mgmt')
const EXE_LEVELS = seniorityLevels.filter(l => l.track === 'exec')

export default function DropdownFlow({ onComplete, onBack }) {
  const [family, setFamily]                             = useState('')
  const [subfamily, setSubfamily]                       = useState('')
  const [level, setLevel]                               = useState('')
  const [companyStage, setCompanyStage]                 = useState('')
  const [companySizeIndicator, setCompanySizeIndicator] = useState('')

  const subfamilies = family
    ? Object.entries(jobFamilies[family].subfamilies).map(([code, data]) => ({ code, ...data }))
    : []

  const subfamilyData    = family && subfamily ? jobFamilies[family].subfamilies[subfamily] : null
  const isCryptoNative   = subfamilyData?.cryptoNative ?? false
  const isSecurityRole   = subfamilyData?.securityRole ?? false
  const isComplete       = family && subfamily && level && companyStage && companySizeIndicator

  // Progress: how many of the 5 fields are filled
  const filled  = [family, subfamily, level, companyStage, companySizeIndicator].filter(Boolean).length
  const progress = Math.round((filled / 5) * 100)

  const handleSubmit = () => {
    onComplete({
      level,
      family,
      subfamily,
      familyName:          jobFamilies[family].name,
      subfamilyName:       jobFamilies[family].subfamilies[subfamily].name,
      isCryptoNative,
      isSecurityRole,
      companyStage,
      companySizeIndicator,
      sourceFlow: 'dropdown',
    })
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div className="card">
        <div className="flow-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h2 className="flow-title" style={{ marginBottom: 0 }}>Select role criteria</h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {filled}/5 complete
            </span>
          </div>
          {/* Inline progress */}
          <div style={{ height: '3px', background: 'var(--bg-elevated)', borderRadius: '999px', marginBottom: '1rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'var(--brand-gradient)', borderRadius: '999px', transition: 'width 0.3s ease' }} />
          </div>
          <p className="flow-subtitle">
            Every field narrows the benchmark — stage and level have the biggest impact.
          </p>
        </div>

        {/* Section: Role */}
        <div className="section-divider">
          <div className="section-divider-line" />
          <span className="section-divider-label">Role</span>
          <div className="section-divider-line" />
        </div>

        <div className="form-group">
          <label className="form-label">Job Family *</label>
          <select
            className="form-select"
            value={family}
            onChange={e => { setFamily(e.target.value); setSubfamily('') }}
          >
            <option value="">Select the broad job category…</option>
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
              <option value="">Select the specific discipline…</option>
              {subfamilies.map(s => (
                <option key={s.code} value={s.code}>{s.icon} {s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Role modifier tags */}
        {subfamily && (isCryptoNative || isSecurityRole) && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {isCryptoNative && (
              <span className="tag tag-brand">⬡ Crypto-Native (+5% knowledge weighting)</span>
            )}
            {isSecurityRole && (
              <span className="tag tag-warning">🔒 Security Specialist (+10% problem-solving weighting)</span>
            )}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Seniority Level *</label>
          <select
            className="form-select"
            value={level}
            onChange={e => setLevel(e.target.value)}
          >
            <option value="">Select level…</option>
            <optgroup label="Individual Contributor">
              {IC_LEVELS.map(l => (
                <option key={l.code} value={l.code}>{l.code} — {l.name} (Grade {l.grade})</option>
              ))}
            </optgroup>
            <optgroup label="Management">
              {MGT_LEVELS.map(l => (
                <option key={l.code} value={l.code}>{l.code} — {l.name} (Grade {l.grade})</option>
              ))}
            </optgroup>
            <optgroup label="Executive">
              {EXE_LEVELS.map(l => (
                <option key={l.code} value={l.code}>{l.code} — {l.name} (Grade {l.grade})</option>
              ))}
            </optgroup>
          </select>
          <p className="form-hint">Grades align to the Points-Factor score range — IC3 (Senior) = Grade 6–7 = 330–485 pts.</p>
        </div>

        {/* Section: Company */}
        <div className="section-divider">
          <div className="section-divider-line" />
          <span className="section-divider-label">Company</span>
          <div className="section-divider-line" />
        </div>

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

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!isComplete}
            style={{ flex: 1 }}
          >
            {isComplete ? 'Get Compensation Data →' : `${5 - filled} more field${5 - filled !== 1 ? 's' : ''} needed`}
          </button>
        </div>
      </div>
    </div>
  )
}
