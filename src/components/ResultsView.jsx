import React from 'react'
import { levelPointRanges } from '../data/jobCatalog.js'

const fmt = n => '$' + Math.round(n).toLocaleString()
const pct = n => (n * 100).toFixed(0) + '%'

const FACTOR_META = [
  { key: 'know',    label: 'Knowledge & Application', weight: '30%', color: '#a855f7' },
  { key: 'prob',    label: 'Problem Solving',          weight: '15%', color: '#3b82f6' },
  { key: 'inter',   label: 'Interaction',              weight: '15%', color: '#10b981' },
  { key: 'impact',  label: 'Impact',                   weight: '30%', color: '#f59e0b' },
  { key: 'account', label: 'Accountability',           weight: '10%', color: '#ec4899' },
]

const STAGE_LABELS = {
  preseed:   'Pre-seed',
  seed:      'Seed',
  seriesA:   'Series A',
  seriesB:   'Series B',
  seriesC:   'Series C+',
  tokenLive: 'Token Live',
  dao:       'DAO',
}

function FactorBar({ value, color }) {
  return (
    <div className="factor-bar-track">
      <div
        className="factor-bar-fill"
        style={{ width: `${(value / 10) * 100}%`, background: color }}
      />
    </div>
  )
}

export default function ResultsView({ evaluation, onBack, onSubmitData }) {
  if (!evaluation) return null

  const {
    level, familyName, subfamilyName,
    isCryptoNative, isSecurityRole,
    factors, totalPoints, grade,
    percentiles, mix,
    stageMultiplier, sizeModifier,
    companyStage,
  } = evaluation

  const range = levelPointRanges[level]
  const stageLabel = STAGE_LABELS[companyStage] ?? companyStage

  // Effective base multiplier (displayed as %)
  const effectiveMul = ((stageMultiplier?.base ?? 1) + (sizeModifier ?? 0))
  const mulDisplay   = effectiveMul >= 1
    ? `+${((effectiveMul - 1) * 100).toFixed(0)}%`
    : `${((effectiveMul - 1) * 100).toFixed(0)}%`

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <div className="results-header">
        <h1>{subfamilyName} Compensation</h1>
        <div className="results-meta">
          <span className="level-badge">{level}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{familyName}</span>
          <span style={{ color: 'var(--text-secondary)' }}>Grade {grade}</span>
          {isCryptoNative && <span className="tag tag-purple">🔗 Crypto-Native</span>}
          {isSecurityRole  && <span className="tag tag-yellow">🔒 Security Role</span>}
        </div>
      </div>

      {/* ── Points-Factor Breakdown ──────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>📐 Points-Factor Score</h3>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-purple)' }}>
              {totalPoints}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              / 1000 pts &nbsp;·&nbsp; Grade {grade}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="factor-bar-track" style={{ height: '12px', borderRadius: '6px' }}>
            <div
              className="factor-bar-fill"
              style={{
                width: `${(totalPoints / 1000) * 100}%`,
                background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                height: '100%',
                borderRadius: '6px',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span>0</span>
            {range && (
              <span style={{ color: 'var(--accent-purple)' }}>
                {level} range: {range.min}–{range.max}
              </span>
            )}
            <span>1000</span>
          </div>
        </div>

        {/* Factor detail rows */}
        <div className="factor-table">
          {FACTOR_META.map(f => (
            <div key={f.key} className="factor-row">
              <div className="factor-label">
                <span>{f.label}</span>
                <span className="factor-weight">{f.weight}</span>
              </div>
              <FactorBar value={factors?.[f.key] ?? 0} color={f.color} />
              <div className="factor-score" style={{ color: f.color }}>
                {factors?.[f.key]?.toFixed(1)} / 10
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Compensation Table ───────────────────────────── */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h3>💰 Total Compensation (Annual USD)</h3>
          <div className="stage-badge">
            <span>{stageLabel}</span>
            <span
              className={`stage-multiplier ${effectiveMul >= 1 ? 'positive' : 'negative'}`}
            >
              {mulDisplay} vs benchmark
            </span>
          </div>
        </div>

        <table className="comp-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>25th %ile</th>
              <th>50th (Median)</th>
              <th>75th %ile</th>
              <th>90th %ile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Salary</td>
              <td>{fmt(percentiles.p25.base)}</td>
              <td>{fmt(percentiles.p50.base)}</td>
              <td>{fmt(percentiles.p75.base)}</td>
              <td>{fmt(percentiles.p90.base)}</td>
            </tr>
            <tr>
              <td>STI / Bonus</td>
              <td>{fmt(percentiles.p25.sti)}</td>
              <td>{fmt(percentiles.p50.sti)}</td>
              <td>{fmt(percentiles.p75.sti)}</td>
              <td>{fmt(percentiles.p90.sti)}</td>
            </tr>
            <tr>
              <td>LTI / Equity</td>
              <td>{fmt(percentiles.p25.lti)}</td>
              <td>{fmt(percentiles.p50.lti)}</td>
              <td>{fmt(percentiles.p75.lti)}</td>
              <td>{fmt(percentiles.p90.lti)}</td>
            </tr>
            <tr className="total-row">
              <td><strong>Total Comp</strong></td>
              <td className="highlight">{fmt(percentiles.p25.total)}</td>
              <td className="highlight">{fmt(percentiles.p50.total)}</td>
              <td className="highlight">{fmt(percentiles.p75.total)}</td>
              <td className="highlight">{fmt(percentiles.p90.total)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span>Pay mix: Base {pct(mix.base)} / STI {pct(mix.sti)} / LTI {pct(mix.lti)}</span>
          <span>· Data shown in USD · Stage-adjusted</span>
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────── */}
      <div className="card" style={{ textAlign: 'center' }}>
        <h3>📊 Help Improve This Data</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Contribute your compensation anonymously to increase data accuracy for everyone.
        </p>
        <button className="btn btn-primary" onClick={onSubmitData}>
          Contribute Your Data →
        </button>
      </div>

      <button className="btn btn-ghost" onClick={onBack} style={{ marginTop: '1rem' }}>
        ← Start Over
      </button>
    </div>
  )
}
