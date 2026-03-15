import React, { useState } from 'react'
import { levelPointRanges } from '../data/jobCatalog.js'

// ── Helpers ──────────────────────────────────────────────────
const fmt  = n => '$' + Math.round(n).toLocaleString()
const fmtK = n => '$' + Math.round(n / 1000) + 'K'
const pct  = n => (n * 100).toFixed(0) + '%'

const FACTOR_META = [
  { key: 'know',    label: 'Knowledge & Application', weight: '30%', color: 'var(--factor-knowledge)',     desc: 'Depth of expertise required and how it\'s applied' },
  { key: 'prob',    label: 'Problem Solving',          weight: '15%', color: 'var(--factor-problem)',      desc: 'Complexity and ambiguity of challenges faced' },
  { key: 'inter',   label: 'Interaction',              weight: '15%', color: 'var(--factor-interaction)',  desc: 'Communication, influence and stakeholder management' },
  { key: 'impact',  label: 'Impact',                   weight: '30%', color: 'var(--factor-impact)',       desc: 'Organizational scope and effect of the role' },
  { key: 'account', label: 'Accountability',           weight: '10%', color: 'var(--factor-accountability)',desc: 'Financial and resource responsibility' },
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

// Negotiation guidance per effective multiplier bracket
function getNegotiationGuide(level, percentiles, effectiveMul) {
  const median    = percentiles.p50.total
  const p25       = percentiles.p25.total
  const p75       = percentiles.p75.total
  const baseShare = percentiles.p50.base
  const ltiShare  = percentiles.p50.lti

  const isAboveMarket  = effectiveMul >= 1.08
  const isBelowMarket  = effectiveMul <= 0.80
  const isExecLevel    = ['D1','D2','VP'].includes(level)
  const isEarlyStage   = effectiveMul <= 0.85

  const points = []

  points.push(`The negotiation sweet spot for this role is ${fmt(p25)} – ${fmt(p75)} total comp, with ${fmt(median)} as the market anchor.`)

  if (isEarlyStage) {
    points.push(`Early-stage companies typically offer lower base salaries — push for more equity to compensate. Your base target should be at least ${fmt(baseShare)}.`)
  } else {
    points.push(`At this stage, base salary is the primary lever. Lead with base and treat equity as upside — your base target: ${fmt(baseShare)}.`)
  }

  if (ltiShare > 20000) {
    points.push(`Equity / token allocation (${fmt(ltiShare)} annually at median) carries significant value. Always negotiate vesting schedule, cliff period, and acceleration clauses.`)
  }

  if (isExecLevel) {
    points.push(`At ${level} level, negotiate total compensation holistically — annual bonus structure, equity refresh cadence, and change-of-control provisions matter as much as base.`)
  }

  points.push(`If you receive an offer below ${fmt(p25)}, that's below the 25th percentile — you have strong data to counter. Reference this benchmark and ask about their comp band for this level.`)

  return points
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
  const [showFactors, setShowFactors] = useState(false)

  if (!evaluation) return null

  const {
    level, familyName, subfamilyName,
    isCryptoNative, isSecurityRole,
    factors, totalPoints, grade,
    percentiles, mix,
    stageMultiplier, sizeModifier,
    companyStage,
  } = evaluation

  const range      = levelPointRanges[level]
  const stageLabel = STAGE_LABELS[companyStage] ?? companyStage

  // Effective multiplier for stage display
  const effectiveMul = (stageMultiplier?.base ?? 1) + (sizeModifier ?? 0)
  const mulPct       = Math.round((effectiveMul - 1) * 100)
  const mulDisplay   = mulPct > 0 ? `+${mulPct}%` : `${mulPct}%`
  const mulClass     = mulPct >= 0 ? 'positive' : 'negative'

  // Percentile bar geometry: p25 left edge, p90 right edge, p50 marker
  const barMin = percentiles.p25.total
  const barMax = percentiles.p90.total
  const barSpan = barMax - barMin
  const p50Pos = barSpan > 0 ? ((percentiles.p50.total - barMin) / barSpan) * 100 : 50

  // p25 and p75 range within the bar
  const rangeLeft  = 0
  const rangeRight = barSpan > 0 ? ((percentiles.p75.total - barMin) / barSpan) * 100 : 75

  const negotiationGuide = getNegotiationGuide(level, percentiles, effectiveMul)

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>

      {/* ── Verdict / Hero Card ──────────────────────────── */}
      <div className="verdict-card">
        {/* Role identity */}
        <div className="verdict-role-line">
          <span className="level-badge">{level}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{subfamilyName}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>·</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{familyName}</span>
          {isCryptoNative && <span className="tag tag-brand">⬡ Crypto-Native</span>}
          {isSecurityRole  && <span className="tag tag-warning">🔒 Security</span>}
        </div>

        {/* Hero number */}
        <div className="verdict-number-section">
          <div className="verdict-number">{fmt(percentiles.p50.total)}</div>
          <div className="verdict-number-context">
            <div className="verdict-number-label">Market Median · Total Compensation</div>
            <div className="verdict-number-sublabel">
              {stageLabel} &nbsp;·&nbsp; Grade {grade}
              &nbsp;&nbsp;
              <span className={`stage-effect-pill ${mulClass}`}>
                {mulDisplay} vs Series C+ benchmark
              </span>
            </div>
          </div>
        </div>

        {/* Percentile range bar */}
        <div className="percentile-bar-wrap">
          <div className="percentile-bar-labels">
            <span>25th percentile</span>
            <span style={{ color: 'var(--brand-light)', fontWeight: 600 }}>● Median</span>
            <span>90th percentile</span>
          </div>

          <div className="percentile-bar-track">
            {/* p25–p75 filled range */}
            <div
              className="percentile-bar-range"
              style={{
                left:  `${rangeLeft}%`,
                width: `${rangeRight - rangeLeft}%`,
              }}
            />
            {/* Median marker */}
            <div
              className="percentile-bar-median"
              style={{ left: `${p50Pos}%` }}
            />
          </div>

          <div className="percentile-bar-values">
            <div className="percentile-val-item">
              <span className="percentile-val-label">25th %ile</span>
              <span className="percentile-val-number">{fmt(percentiles.p25.total)}</span>
            </div>
            <div className="percentile-val-item" style={{ textAlign: 'center' }}>
              <span className="percentile-val-label">Median</span>
              <span className="percentile-val-number median-val">{fmt(percentiles.p50.total)}</span>
            </div>
            <div className="percentile-val-item" style={{ textAlign: 'center' }}>
              <span className="percentile-val-label">75th %ile</span>
              <span className="percentile-val-number">{fmt(percentiles.p75.total)}</span>
            </div>
            <div className="percentile-val-item" style={{ textAlign: 'right' }}>
              <span className="percentile-val-label">90th %ile</span>
              <span className="percentile-val-number">{fmt(percentiles.p90.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Full Comp Breakdown ──────────────────────────── */}
      <div className="card">
        <h3 className="card-title">
          Annual Compensation Breakdown
          <span style={{ marginLeft: 'auto', font: 'normal 0.78rem/1 var(--text-muted)', color: 'var(--text-muted)', fontWeight: 400 }}>
            USD · Stage-adjusted
          </span>
        </h3>

        <table className="comp-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>25th %ile</th>
              <th className="col-median">50th</th>
              <th>75th %ile</th>
              <th>90th %ile</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Salary</td>
              <td>{fmt(percentiles.p25.base)}</td>
              <td className="col-median">{fmt(percentiles.p50.base)}</td>
              <td>{fmt(percentiles.p75.base)}</td>
              <td>{fmt(percentiles.p90.base)}</td>
            </tr>
            <tr>
              <td>
                Annual Bonus <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(STI)</span>
              </td>
              <td>{fmt(percentiles.p25.sti)}</td>
              <td className="col-median">{fmt(percentiles.p50.sti)}</td>
              <td>{fmt(percentiles.p75.sti)}</td>
              <td>{fmt(percentiles.p90.sti)}</td>
            </tr>
            <tr>
              <td>
                Equity / Tokens <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(LTI annualized)</span>
              </td>
              <td>{fmt(percentiles.p25.lti)}</td>
              <td className="col-median">{fmt(percentiles.p50.lti)}</td>
              <td>{fmt(percentiles.p75.lti)}</td>
              <td>{fmt(percentiles.p90.lti)}</td>
            </tr>
            <tr className="total-row">
              <td>Total Comp</td>
              <td>{fmt(percentiles.p25.total)}</td>
              <td className="col-median">{fmt(percentiles.p50.total)}</td>
              <td>{fmt(percentiles.p75.total)}</td>
              <td>{fmt(percentiles.p90.total)}</td>
            </tr>
          </tbody>
        </table>

        {/* Pay mix */}
        <div style={{ marginTop: '1.25rem' }}>
          <p className="card-label">Pay Mix at Median</p>
          <div className="pay-mix-bar">
            <div className="pay-mix-base"    style={{ flex: mix.base }} />
            <div className="pay-mix-sti"     style={{ flex: mix.sti  }} />
            <div className="pay-mix-lti"     style={{ flex: mix.lti  }} />
          </div>
          <div className="pay-mix-legend">
            <div className="pay-mix-item">
              <div className="pay-mix-dot" style={{ background: '#7c3aed' }} />
              Base {pct(mix.base)}
            </div>
            <div className="pay-mix-item">
              <div className="pay-mix-dot" style={{ background: '#0ea5e9' }} />
              Annual Bonus {pct(mix.sti)}
            </div>
            <div className="pay-mix-item">
              <div className="pay-mix-dot" style={{ background: '#10b981' }} />
              Equity / Tokens {pct(mix.lti)}
            </div>
          </div>
        </div>

        {/* Stage effect explanation */}
        <div className="alert alert-info" style={{ marginTop: '1.25rem' }}>
          <strong>Stage effect:</strong> {stageLabel} companies benchmark {mulDisplay === '+0%' ? 'in line with' : `${mulDisplay} vs`} a Series C+ baseline.
          {mulPct < 0 && ` Lower cash is typically offset by higher equity upside at earlier stages.`}
          {mulPct > 0 && ` Premium positioning reflects the protocol's scale and ability to compete with top-of-market.`}
        </div>
      </div>

      {/* ── Negotiation Guide ────────────────────────────── */}
      <div className="negotiation-card">
        <div className="negotiation-title">
          💬 Negotiation Guide
        </div>
        <ul className="negotiation-points">
          {negotiationGuide.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* ── Points-Factor Score (collapsible) ────────────── */}
      <div className="card">
        <div
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setShowFactors(f => !f)}
        >
          <h3 className="card-title" style={{ marginBottom: 0 }}>
            Role Evaluation Score
            <span style={{ marginLeft: '0.75rem' }}>
              <span className="level-badge">{totalPoints} pts</span>
            </span>
          </h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', userSelect: 'none' }}>
            {showFactors ? '▲ Hide' : '▼ Show breakdown'}
          </span>
        </div>

        {/* Always show summary bar */}
        <div className="points-bar-wrap" style={{ marginTop: '1rem' }}>
          <div className="points-bar-track">
            <div className="points-bar-fill" style={{ width: `${(totalPoints / 1000) * 100}%` }} />
          </div>
          <div className="points-bar-labels">
            <span>0</span>
            {range && (
              <span style={{ color: 'var(--brand-light)' }}>
                {level} range: {range.min}–{range.max} pts
              </span>
            )}
            <span>1000</span>
          </div>
        </div>

        {showFactors && (
          <>
            <div className="section-divider" style={{ marginTop: '1.5rem' }}>
              <div className="section-divider-line" />
              <span className="section-divider-label">Factor Scores</span>
              <div className="section-divider-line" />
            </div>

            <div className="factor-table">
              {FACTOR_META.map(f => (
                <div key={f.key} className="factor-row">
                  <div className="factor-label-wrap">
                    <span className="factor-name">{f.label}</span>
                    <span className="factor-weight">{f.weight} weight · {f.desc}</span>
                  </div>
                  <FactorBar value={factors?.[f.key] ?? 0} color={f.color} />
                  <div className="factor-score" style={{ color: f.color }}>
                    {factors?.[f.key]?.toFixed(1)}<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/10</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
              <strong>How scores are calculated:</strong> Knowledge and Impact each carry 30% weight; Problem Solving and Interaction 15% each; Accountability 10%. Crypto-native roles receive a +5% Knowledge uplift; security/audit roles receive a +10% Problem Solving uplift.
            </div>
          </>
        )}
      </div>

      {/* ── CTA ─────────────────────────────────────────── */}
      <div className="cta-card">
        <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🤝</div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Help improve these benchmarks
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '480px', margin: '0 auto 1.25rem' }}>
          Every anonymous submission makes the data more accurate. Yours takes 2 minutes
          and benefits the entire crypto community.
        </p>
        <button className="btn btn-primary" onClick={onSubmitData}>
          Contribute Your Salary →
        </button>
      </div>

      <button className="btn btn-ghost" onClick={onBack} style={{ marginTop: '0.5rem' }}>
        ← Start a new search
      </button>

    </div>
  )
}
