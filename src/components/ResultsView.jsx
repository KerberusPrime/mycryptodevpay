import React, { useState, useEffect, useRef } from 'react'
import { levelPointRanges } from '../data/jobCatalog.js'
import { GEO_REGIONS, applyGeoMultiplier } from '../utils/geoAdjuster.js'
import { buildShareURL, copyToClipboard } from '../utils/urlState.js'

// ── Helpers ──────────────────────────────────────────────────
const fmt  = n => '$' + Math.round(n).toLocaleString()
const fmtK = n => '$' + Math.round(n / 1000) + 'K'
const pct  = n => (n * 100).toFixed(0) + '%'

const FACTOR_META = [
  { key: 'know',    label: 'Knowledge & Application', weight: '30%', color: 'var(--factor-knowledge)',      desc: 'Depth of expertise required and how it\'s applied' },
  { key: 'prob',    label: 'Problem Solving',          weight: '15%', color: 'var(--factor-problem)',       desc: 'Complexity and ambiguity of challenges faced' },
  { key: 'inter',   label: 'Interaction',              weight: '15%', color: 'var(--factor-interaction)',   desc: 'Communication, influence and stakeholder management' },
  { key: 'impact',  label: 'Impact',                   weight: '30%', color: 'var(--factor-impact)',        desc: 'Organizational scope and effect of the role' },
  { key: 'account', label: 'Accountability',           weight: '10%', color: 'var(--factor-accountability)', desc: 'Financial and resource responsibility' },
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

  const isEarlyStage   = effectiveMul <= 0.85
  const isExecLevel    = ['D1','D2','VP'].includes(level)

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

// Count-up hook for hero number animation
function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!target) return
    const start = Date.now()
    const animate = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

// Toast hook
function useToast() {
  const [toast, setToast] = useState(null)
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }
  return { toast, showToast }
}

export default function ResultsView({ evaluation, onBack, onSubmitData, onCompare, onTokenCalc }) {
  const [showFactors, setShowFactors]   = useState(false)
  const [geo, setGeo]                   = useState('us-other')
  const [showGeoMenu, setShowGeoMenu]   = useState(false)
  const { toast, showToast }            = useToast()

  if (!evaluation) return null

  const {
    level, familyName, subfamilyName,
    isCryptoNative, isSecurityRole,
    factors, totalPoints, grade,
    percentiles: rawPercentiles, mix,
    stageMultiplier, sizeModifier,
    companyStage,
  } = evaluation

  // Apply geo adjustment
  const percentiles = geo === 'us-other'
    ? rawPercentiles
    : applyGeoMultiplier(rawPercentiles, geo)

  const geoRegion = GEO_REGIONS.find(r => r.code === geo) ?? GEO_REGIONS.find(r => r.code === 'us-other')

  const range      = levelPointRanges[level]
  const stageLabel = STAGE_LABELS[companyStage] ?? companyStage

  // Effective multiplier for stage display
  const effectiveMul = (stageMultiplier?.base ?? 1) + (sizeModifier ?? 0)
  const mulPct       = Math.round((effectiveMul - 1) * 100)
  const mulDisplay   = mulPct > 0 ? `+${mulPct}%` : `${mulPct}%`
  const mulClass     = mulPct >= 0 ? 'positive' : 'negative'

  // Percentile bar geometry
  const barMin  = percentiles.p25.total
  const barMax  = percentiles.p90.total
  const barSpan = barMax - barMin
  const p50Pos  = barSpan > 0 ? ((percentiles.p50.total - barMin) / barSpan) * 100 : 50
  const rangeRight = barSpan > 0 ? ((percentiles.p75.total - barMin) / barSpan) * 100 : 75

  // Count-up hero number
  const animatedTotal = useCountUp(percentiles.p50.total, 900)

  const negotiationGuide = getNegotiationGuide(level, percentiles, effectiveMul)

  const handleShare = async () => {
    const url = buildShareURL({
      level,
      family: evaluation.family,
      subfamily: evaluation.subfamily,
      companyStage,
      companySizeIndicator: evaluation.companySizeIndicator,
      geo,
    })
    await copyToClipboard(url)
    showToast('Link copied to clipboard!')
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>

      {/* ── Toast ────────────────────────────────────────── */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✓' : '!'} {toast.msg}
        </div>
      )}

      {/* ── Top action bar ───────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button className="btn btn-ghost" onClick={onBack} style={{ padding: '0.5rem 0.875rem' }}>
          ← New search
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Geo toggle */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowGeoMenu(m => !m)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              🌍 {geoRegion.shortName} ▾
            </button>
            {showGeoMenu && (
              <div className="geo-dropdown">
                {GEO_REGIONS.map(r => (
                  <div
                    key={r.code}
                    className={`geo-option ${r.code === geo ? 'active' : ''}`}
                    onClick={() => { setGeo(r.code); setShowGeoMenu(false) }}
                  >
                    <span>{r.name}</span>
                    <span className="geo-mul">{(r.multiplier * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {onCompare && (
            <button className="btn btn-secondary btn-sm" onClick={onCompare}>
              ⇄ Compare Roles
            </button>
          )}

          <button className="btn btn-secondary btn-sm" onClick={handleShare}>
            ↗ Share Results
          </button>
        </div>
      </div>

      {/* Geo banner if non-default */}
      {geo !== 'us-other' && (
        <div className="alert alert-info" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>📍</span>
          <span>
            Showing <strong>{geoRegion.name}</strong> rates ({(geoRegion.multiplier * 100).toFixed(0)}% of US baseline).
            {' '}{geoRegion.note}
          </span>
        </div>
      )}

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
          <div className="verdict-number">{fmt(animatedTotal)}</div>
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
            <div
              className="percentile-bar-range"
              style={{ left: '0%', width: `${rangeRight}%` }}
            />
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
          <span style={{ marginLeft: 'auto', font: 'normal 0.78rem/1 var(--font-body)', color: 'var(--text-muted)', fontWeight: 400 }}>
            USD · Stage-adjusted{geo !== 'us-other' ? ` · ${geoRegion.shortName}` : ''}
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
              <td>Annual Bonus <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(STI)</span></td>
              <td>{fmt(percentiles.p25.sti)}</td>
              <td className="col-median">{fmt(percentiles.p50.sti)}</td>
              <td>{fmt(percentiles.p75.sti)}</td>
              <td>{fmt(percentiles.p90.sti)}</td>
            </tr>
            <tr>
              <td>
                Equity / Tokens <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>(LTI annualized)</span>
                {onTokenCalc && (
                  <button
                    onClick={onTokenCalc}
                    style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--brand-light)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                  >
                    → Calculate token value
                  </button>
                )}
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
            <div className="pay-mix-base" style={{ flex: mix.base }} />
            <div className="pay-mix-sti"  style={{ flex: mix.sti  }} />
            <div className="pay-mix-lti"  style={{ flex: mix.lti  }} />
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
        <div className="negotiation-title">💬 Negotiation Guide</div>
        <ul className="negotiation-points">
          {negotiationGuide.map((point, i) => (
            <li key={i}>{point}</li>
          ))}
        </ul>
      </div>

      {/* ── Quick Actions ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {onCompare && (
          <div className="card" style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', marginBottom: 0 }} onClick={onCompare}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>⇄</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Compare Roles</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>See how this role stacks up</div>
          </div>
        )}
        {onTokenCalc && (
          <div className="card" style={{ padding: '1.25rem', textAlign: 'center', cursor: 'pointer', marginBottom: 0 }} onClick={onTokenCalc}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>🪙</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Token Calculator</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Convert your grant to comp value</div>
          </div>
        )}
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

    </div>
  )
}
