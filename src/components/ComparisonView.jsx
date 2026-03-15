import React, { useState } from 'react'
import {
  jobFamilies, seniorityLevels, companyStages,
  marketCapRanges, fundingRanges, treasuryRanges,
} from '../data/jobCatalog.js'
import { evaluateRole } from '../utils/evaluationEngine.js'

const fmt = n => '$' + Math.round(n).toLocaleString()

const STAGE_LABELS = { preseed:'Pre-seed', seed:'Seed', seriesA:'Series A', seriesB:'Series B', seriesC:'Series C+', tokenLive:'Token Live', dao:'DAO' }

function getSizeOptions(s) {
  if (s === 'tokenLive') return marketCapRanges
  if (s === 'dao')       return treasuryRanges
  return fundingRanges
}
function getSizeLabel(s) {
  if (s === 'tokenLive') return 'Market Cap'
  if (s === 'dao')       return 'Treasury'
  return 'Funding'
}

function RoleSelector({ label, value, onChange }) {
  const [family, setFamily]         = useState(value?.family ?? '')
  const [subfamily, setSubfamily]   = useState(value?.subfamily ?? '')
  const [level, setLevel]           = useState(value?.level ?? '')
  const [stage, setStage]           = useState(value?.companyStage ?? '')
  const [size, setSize]             = useState(value?.companySizeIndicator ?? '')

  const subfamilies = family
    ? Object.entries(jobFamilies[family].subfamilies).map(([code, data]) => ({ code, ...data }))
    : []

  const isComplete = family && subfamily && level && stage && size

  const handleConfirm = () => {
    if (!isComplete) return
    onChange({
      level, family, subfamily,
      familyName:          jobFamilies[family].name,
      subfamilyName:       jobFamilies[family].subfamilies[subfamily].name,
      isCryptoNative:      jobFamilies[family].subfamilies[subfamily].cryptoNative,
      isSecurityRole:      jobFamilies[family].subfamilies[subfamily].securityRole,
      companyStage:        stage,
      companySizeIndicator: size,
    })
  }

  return (
    <div className="card" style={{ flex: 1 }}>
      <div className="card-label">{label}</div>

      <div className="form-group">
        <label className="form-label" style={{ fontSize: '0.8rem' }}>Family</label>
        <select className="form-select" style={{ padding: '0.6rem 0.875rem', fontSize: '0.875rem' }}
          value={family} onChange={e => { setFamily(e.target.value); setSubfamily('') }}>
          <option value="">Select…</option>
          {Object.entries(jobFamilies).map(([code, data]) => <option key={code} value={code}>{data.name}</option>)}
        </select>
      </div>

      {family && (
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Specialty</label>
          <select className="form-select" style={{ padding: '0.6rem 0.875rem', fontSize: '0.875rem' }}
            value={subfamily} onChange={e => setSubfamily(e.target.value)}>
            <option value="">Select…</option>
            {subfamilies.map(s => <option key={s.code} value={s.code}>{s.icon} {s.name}</option>)}
          </select>
        </div>
      )}

      <div className="form-group">
        <label className="form-label" style={{ fontSize: '0.8rem' }}>Level</label>
        <select className="form-select" style={{ padding: '0.6rem 0.875rem', fontSize: '0.875rem' }}
          value={level} onChange={e => setLevel(e.target.value)}>
          <option value="">Select…</option>
          {seniorityLevels.map(l => <option key={l.code} value={l.code}>{l.code} — {l.name}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ fontSize: '0.8rem' }}>Stage</label>
        <select className="form-select" style={{ padding: '0.6rem 0.875rem', fontSize: '0.875rem' }}
          value={stage} onChange={e => { setStage(e.target.value); setSize('') }}>
          <option value="">Select…</option>
          {companyStages.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
        </select>
      </div>

      {stage && (
        <div className="form-group">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>{getSizeLabel(stage)}</label>
          <select className="form-select" style={{ padding: '0.6rem 0.875rem', fontSize: '0.875rem' }}
            value={size} onChange={e => setSize(e.target.value)}>
            <option value="">Select…</option>
            {getSizeOptions(stage).map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
          </select>
        </div>
      )}

      <button className="btn btn-primary" onClick={handleConfirm} disabled={!isComplete} style={{ width: '100%' }}>
        Set Role
      </button>
    </div>
  )
}

function CompColumn({ eval: ev, highlight }) {
  if (!ev) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-surface)', border: '1px dashed var(--border-default)',
      borderRadius: 'var(--radius-lg)', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
      Configure role →
    </div>
  )

  const { level, subfamilyName, familyName, percentiles, companyStage, totalPoints } = ev
  const med = percentiles.p50

  return (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ background: highlight ? 'linear-gradient(135deg,var(--bg-card),rgba(124,58,237,0.08))' : 'var(--bg-card)',
        border: `1px solid ${highlight ? 'var(--border-brand)' : 'var(--border-default)'}`,
        borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '0.75rem', position: 'relative' }}>
        {highlight && (
          <div style={{ position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
            background: 'var(--brand)', color: '#fff', fontSize: '0.65rem', fontWeight: 700,
            padding: '0.15rem 0.75rem', borderRadius: '0 0 8px 8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Higher Total Comp
          </div>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <span className="level-badge">{level}</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{subfamilyName}</span>
        </div>
        <div style={{ fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.03em', color: highlight ? 'var(--brand-light)' : 'var(--text-primary)' }}>
          {fmt(med.total)}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Median total comp · {STAGE_LABELS[companyStage] ?? companyStage}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Role score: {totalPoints} pts
        </div>
      </div>

      {/* Comp rows */}
      {[
        { label: 'Base Salary',      val: med.base },
        { label: 'Annual Bonus',     val: med.sti  },
        { label: 'Equity / Tokens',  val: med.lti  },
        { label: 'Total Comp',       val: med.total, bold: true },
      ].map(row => (
        <div key={row.label} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.75rem 1rem',
          background: row.bold ? 'var(--bg-elevated)' : 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)', marginBottom: '0.5rem',
        }}>
          <span style={{ fontSize: '0.85rem', color: row.bold ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: row.bold ? 700 : 400 }}>
            {row.label}
          </span>
          <span style={{ fontWeight: 700, fontSize: row.bold ? '1rem' : '0.9rem', color: row.bold && highlight ? 'var(--brand-light)' : 'var(--text-primary)' }}>
            {fmt(row.val)}
          </span>
        </div>
      ))}

      {/* Percentile spread */}
      <div style={{ padding: '0.875rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginTop: '0.5rem' }}>
        <div className="card-label" style={{ marginBottom: '0.4rem' }}>Range</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
          <div><div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>P25</div><div style={{ fontWeight: 600 }}>{fmt(percentiles.p25.total)}</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ color: 'var(--brand-light)', fontSize: '0.68rem' }}>MEDIAN</div><div style={{ fontWeight: 700, color: 'var(--brand-light)' }}>{fmt(percentiles.p50.total)}</div></div>
          <div><div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>P75</div><div style={{ fontWeight: 600 }}>{fmt(percentiles.p75.total)}</div></div>
          <div style={{ textAlign: 'right' }}><div style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>P90</div><div style={{ fontWeight: 600 }}>{fmt(percentiles.p90.total)}</div></div>
        </div>
      </div>
    </div>
  )
}

export default function ComparisonView({ initialEvaluation, onBack }) {
  const [roleA, setRoleA] = useState(initialEvaluation
    ? { level: initialEvaluation.level, family: initialEvaluation.family, subfamily: initialEvaluation.subfamily,
        familyName: initialEvaluation.familyName, subfamilyName: initialEvaluation.subfamilyName,
        isCryptoNative: initialEvaluation.isCryptoNative, isSecurityRole: initialEvaluation.isSecurityRole,
        companyStage: initialEvaluation.companyStage, companySizeIndicator: initialEvaluation.companySizeIndicator }
    : null)
  const [roleB, setRoleB]     = useState(null)
  const [evalA, setEvalA]     = useState(initialEvaluation ?? null)
  const [evalB, setEvalB]     = useState(null)
  const [mode, setMode]       = useState(initialEvaluation ? 'results' : 'configure') // 'configure' | 'results'

  const runEvaluation = (params, setter) => {
    const result = evaluateRole(params)
    setter({
      ...result,
      familyName:    params.familyName,
      subfamilyName: params.subfamilyName,
      isCryptoNative: params.isCryptoNative,
      isSecurityRole: params.isSecurityRole,
    })
  }

  const handleSetRoleA = (params) => { setRoleA(params); runEvaluation(params, setEvalA) }
  const handleSetRoleB = (params) => { setRoleB(params); runEvaluation(params, setEvalB) }

  const aHigher = evalA && evalB && evalA.percentiles.p50.total >= evalB.percentiles.p50.total
  const bHigher = evalA && evalB && evalB.percentiles.p50.total >  evalA.percentiles.p50.total

  const diff = evalA && evalB
    ? Math.abs(evalA.percentiles.p50.total - evalB.percentiles.p50.total)
    : null

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Role Comparison</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Compare compensation benchmarks for two roles side-by-side
          </p>
        </div>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
      </div>

      {/* Summary diff banner */}
      {diff !== null && (
        <div className="alert alert-info" style={{ marginBottom: '1.5rem', fontWeight: 500 }}>
          {aHigher
            ? <>Role A pays <strong>{fmt(diff)}/yr more</strong> at the median than Role B.</>
            : <>Role B pays <strong>{fmt(diff)}/yr more</strong> at the median than Role A.</>
          }
          {' '}That's <strong>{fmt(diff / 12)}/mo</strong> difference.
        </div>
      )}

      {/* Two-column compare */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        <div>
          <div className="card-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>Role A</div>
          {mode === 'configure' || !evalA
            ? <RoleSelector label="Configure Role A" value={roleA} onChange={handleSetRoleA} />
            : <CompColumn eval={evalA} highlight={aHigher} />
          }
        </div>
        <div>
          <div className="card-label" style={{ marginBottom: '0.75rem', textAlign: 'center' }}>Role B</div>
          <RoleSelector label="Configure Role B" value={roleB} onChange={handleSetRoleB} />
          {roleB && evalB && <div style={{ marginTop: '0.75rem' }}><CompColumn eval={evalB} highlight={bHigher} /></div>}
        </div>
      </div>

      {evalA && !evalB && (
        <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
          Configure Role B on the right to see the comparison.
        </div>
      )}
    </div>
  )
}
