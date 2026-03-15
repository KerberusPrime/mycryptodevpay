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
  if (companyStage === 'tokenLive') return 'Market Cap'
  if (companyStage === 'dao')       return 'Treasury Size'
  return 'Funding Raised'
}

export default function DropdownFlow({ onComplete, onBack }) {
  const [family, setFamily]                             = useState('')
  const [subfamily, setSubfamily]                       = useState('')
  const [level, setLevel]                               = useState('')
  const [companyStage, setCompanyStage]                 = useState('')
  const [companySizeIndicator, setCompanySizeIndicator] = useState('')

  const subfamilies = family
    ? Object.entries(jobFamilies[family].subfamilies).map(([code, data]) => ({ code, ...data }))
    : []

  const subfamilyData = family && subfamily
    ? jobFamilies[family].subfamilies[subfamily]
    : null

  const isCryptoNative = subfamilyData?.cryptoNative ?? false
  const isSecurityRole = subfamilyData?.securityRole ?? false
  const isComplete     = family && subfamily && level && companyStage && companySizeIndicator

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
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="card">
        <h2>🎯 Select Role Criteria</h2>

        {/* Job Family */}
        <div className="form-group">
          <label className="form-label">Job Family *</label>
          <select
            className="form-select"
            value={family}
            onChange={e => { setFamily(e.target.value); setSubfamily('') }}
          >
            <option value="">Select job family…</option>
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
              <option value="">Select subfamily…</option>
              {subfamilies.map(s => (
                <option key={s.code} value={s.code}>{s.icon} {s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Role tags */}
        {subfamily && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {isCryptoNative && (
              <span className="tag tag-purple">🔗 Crypto-Native (+5% Knowledge)</span>
            )}
            {isSecurityRole && (
              <span className="tag tag-yellow">🔒 Security Uplift (+10% Problem Solving)</span>
            )}
          </div>
        )}

        {/* Seniority Level */}
        <div className="form-group">
          <label className="form-label">Seniority Level *</label>
          <select
            className="form-select"
            value={level}
            onChange={e => setLevel(e.target.value)}
          >
            <option value="">Select level…</option>
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
            onChange={e => { setCompanyStage(e.target.value); setCompanySizeIndicator('') }}
          >
            <option value="">Select stage…</option>
            {companyStages.map(s => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Size Indicator */}
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
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isComplete}
            style={{ flex: 1 }}
          >
            🎯 Get Compensation Data
          </button>
        </div>
      </div>
    </div>
  )
}
