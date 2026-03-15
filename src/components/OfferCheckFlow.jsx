import React, { useState } from 'react'
import {
  jobFamilies, seniorityLevels, companyStages,
  marketCapRanges, fundingRanges, treasuryRanges,
} from '../data/jobCatalog.js'
import StepProgress from './StepProgress.jsx'

const STEPS = [
  { label: 'Your Offer' },
  { label: 'Role Details' },
  { label: 'Company Context' },
]

const IC_LEVELS  = seniorityLevels.filter(l => l.track === 'ic')
const MGT_LEVELS = seniorityLevels.filter(l => l.track === 'mgmt')
const EXE_LEVELS = seniorityLevels.filter(l => l.track === 'exec')

function getSizeOptions(s) {
  if (s === 'tokenLive') return marketCapRanges
  if (s === 'dao')       return treasuryRanges
  return fundingRanges
}
function getSizeLabel(s) {
  if (s === 'tokenLive') return 'Protocol Market Cap'
  if (s === 'dao')       return 'Treasury Size'
  return 'Total Funding Raised'
}

function formatCurrency(value) {
  const num = value.replace(/[^0-9]/g, '')
  if (!num) return ''
  return '$' + parseInt(num).toLocaleString()
}

/**
 * Compute approximate percentile for a given salary
 * using linear interpolation between known percentile points.
 */
function computePercentile(salary, totalPercentiles) {
  const { p25, p50, p75, p90 } = totalPercentiles
  const points = [
    { val: p25 * 0.7, pct: 5  },
    { val: p25,       pct: 25 },
    { val: p50,       pct: 50 },
    { val: p75,       pct: 75 },
    { val: p90,       pct: 90 },
    { val: p90 * 1.3, pct: 99 },
  ]
  for (let i = 1; i < points.length; i++) {
    const lo = points[i - 1]
    const hi = points[i]
    if (salary >= lo.val && salary <= hi.val) {
      const t = (salary - lo.val) / (hi.val - lo.val)
      return Math.round(lo.pct + t * (hi.pct - lo.pct))
    }
  }
  return salary < points[0].val ? 1 : 99
}

function fmt(n) { return '$' + Math.round(n).toLocaleString() }

function OfferResult({ offerAmount, evaluation }) {
  const { percentiles, subfamilyName, familyName, level, companyStage } = evaluation
  const totalP = {
    p25: percentiles.p25.total,
    p50: percentiles.p50.total,
    p75: percentiles.p75.total,
    p90: percentiles.p90.total,
  }

  const userPct    = computePercentile(offerAmount, totalP)
  const gapToP50   = totalP.p50 - offerAmount
  const gapToP75   = totalP.p75 - offerAmount
  const gapToP90   = totalP.p90 - offerAmount

  // Bar position: where does their salary land between p25 and p90
  const barMin     = totalP.p25 * 0.85
  const barMax     = totalP.p90 * 1.1
  const barSpan    = barMax - barMin
  const userPos    = Math.max(0, Math.min(100, ((offerAmount - barMin) / barSpan) * 100))
  const p25Pos     = Math.max(0, Math.min(100, ((totalP.p25 - barMin) / barSpan) * 100))
  const p50Pos     = Math.max(0, Math.min(100, ((totalP.p50 - barMin) / barSpan) * 100))
  const p75Pos     = Math.max(0, Math.min(100, ((totalP.p75 - barMin) / barSpan) * 100))
  const p90Pos     = Math.max(0, Math.min(100, ((totalP.p90 - barMin) / barSpan) * 100))

  const verdictColor = userPct >= 75 ? 'var(--success)'
                     : userPct >= 50 ? 'var(--brand-light)'
                     : userPct >= 25 ? 'var(--warning)'
                     : 'var(--danger)'

  const verdictLabel = userPct >= 75 ? 'Above market — strong offer'
                     : userPct >= 50 ? 'At or above market median'
                     : userPct >= 25 ? 'Below median — room to negotiate'
                     : 'Below 25th percentile — counter strongly'

  const STAGE_LABELS = { preseed:'Pre-seed', seed:'Seed', seriesA:'Series A', seriesB:'Series B', seriesC:'Series C+', tokenLive:'Token Live', dao:'DAO' }

  return (
    <div>
      {/* ── Verdict Card ────────────────────────────── */}
      <div className="verdict-card" style={{ marginBottom: '1.5rem' }}>
        <div className="verdict-role-line">
          <span className="level-badge">{level}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{subfamilyName} · {familyName}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>· {STAGE_LABELS[companyStage] ?? companyStage}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap', margin: '1.25rem 0' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Your Offer / Salary</div>
            <div style={{ fontSize: '3rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>{fmt(offerAmount)}</div>
          </div>
          <div style={{ paddingBottom: '0.4rem' }}>
            <div className="offer-percentile-badge" style={{ '--pct-color': verdictColor }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: verdictColor }}>{userPct}th</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>percentile</span>
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: verdictColor, marginTop: '0.25rem' }}>
              {verdictLabel}
            </div>
          </div>
        </div>

        {/* Visual bar with user's position */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ position: 'relative', height: '36px', marginBottom: '0.5rem' }}>
            {/* Track */}
            <div style={{ position: 'absolute', top: '14px', left: 0, right: 0, height: '8px', background: 'var(--bg-elevated)', borderRadius: '999px' }} />
            {/* p25–p75 range fill */}
            <div style={{
              position: 'absolute', top: '14px', height: '8px',
              left: `${p25Pos}%`, width: `${p75Pos - p25Pos}%`,
              background: 'linear-gradient(90deg, rgba(124,58,237,0.3), rgba(124,58,237,0.6))',
              borderRadius: '999px',
            }} />
            {/* Percentile labels */}
            {[{ pos: p25Pos, label: 'p25' }, { pos: p50Pos, label: 'p50' }, { pos: p75Pos, label: 'p75' }, { pos: p90Pos, label: 'p90' }].map(m => (
              <div key={m.label} style={{ position: 'absolute', top: 0, left: `${m.pos}%`, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</div>
                <div style={{ width: '1px', height: '10px', background: 'var(--border-default)' }} />
              </div>
            ))}
            {/* User's salary dot */}
            <div style={{
              position: 'absolute', top: '9px',
              left: `${userPos}%`, transform: 'translateX(-50%)',
              width: '18px', height: '18px',
              background: verdictColor,
              border: '3px solid var(--bg-base)',
              borderRadius: '50%',
              boxShadow: `0 0 0 3px ${verdictColor}40`,
              zIndex: 2,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span>{fmt(totalP.p25)}</span>
            <span style={{ color: 'var(--brand-light)', fontWeight: 600 }}>Median {fmt(totalP.p50)}</span>
            <span>{fmt(totalP.p90)}</span>
          </div>
        </div>
      </div>

      {/* ── Gap Analysis ────────────────────────────── */}
      <div className="card">
        <h3 className="card-title">Negotiation Targets</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          What you'd need to ask for to reach each benchmark.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Market Median', sublabel: '50th percentile', target: totalP.p50, color: 'var(--brand-light)', gap: gapToP50 },
            { label: 'Competitive',   sublabel: '75th percentile', target: totalP.p75, color: 'var(--success)',     gap: gapToP75 },
            { label: 'Top of Market', sublabel: '90th percentile', target: totalP.p90, color: 'var(--warning)',     gap: gapToP90 },
          ].map(row => (
            <div key={row.label} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              alignItems: 'center', gap: '1rem',
              padding: '1rem', borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: row.gap <= 0 ? '1px solid var(--success-border)' : '1px solid var(--border-subtle)',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: row.color }}>{row.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.sublabel}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{fmt(row.target)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>total comp</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {row.gap <= 0
                  ? <span className="tag tag-success">✓ You're here</span>
                  : <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>+{fmt(row.gap)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>to ask for</div>
                    </div>
                }
              </div>
            </div>
          ))}
        </div>

        {/* Negotiation script */}
        <div className="negotiation-card" style={{ marginTop: '1.25rem', marginBottom: 0 }}>
          <div className="negotiation-title">💬 What to Say</div>
          <ul className="negotiation-points">
            {gapToP50 > 0
              ? <>
                  <li>Your offer of {fmt(offerAmount)} is below the market median of {fmt(totalP.p50)} for this role — that's a {fmt(gapToP50)} gap you can reference directly.</li>
                  <li>Open with: <em>"Based on market data for {subfamilyName} at {STAGE_LABELS[companyStage] ?? companyStage} companies, the median is {fmt(totalP.p50)}. Can we get to that range?"</em></li>
                  <li>Your target ask: {fmt(totalP.p50)} total comp. Your stretch: {fmt(totalP.p75)}. Never open at your floor.</li>
                </>
              : <>
                  <li>Your offer is at or above market median — this is a strong package. Focus negotiation on equity upside, vesting terms, and refresh grants.</li>
                  <li>The 75th percentile for this role is {fmt(totalP.p75)} total comp — there's still room to push, especially on equity.</li>
                  <li>Ask about token/equity vesting acceleration on acquisition and annual refresh grants, which are often negotiable even when base is fixed.</li>
                </>
            }
            <li>Always negotiate in writing after verbal agreement — asking for the comp breakdown (base / bonus / equity split) in the offer letter.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function OfferCheckFlow({ onComplete, onBack }) {
  const [step, setStep]                                 = useState(1)
  const [offerText, setOfferText]                       = useState('')
  const [family, setFamily]                             = useState('')
  const [subfamily, setSubfamily]                       = useState('')
  const [level, setLevel]                               = useState('')
  const [companyStage, setCompanyStage]                 = useState('')
  const [companySizeIndicator, setCompanySizeIndicator] = useState('')
  const [evaluation, setEvaluation]                     = useState(null)

  const offerAmount = parseInt(offerText.replace(/[^0-9]/g, '')) || 0
  const isValidOffer = offerAmount >= 10000

  const subfamilies = family
    ? Object.entries(jobFamilies[family].subfamilies).map(([code, data]) => ({ code, ...data }))
    : []

  const isCryptoNative = family && subfamily ? jobFamilies[family]?.subfamilies[subfamily]?.cryptoNative : false
  const isSecurityRole = family && subfamily ? jobFamilies[family]?.subfamilies[subfamily]?.securityRole  : false
  const step2Complete  = family && subfamily && level
  const step3Complete  = companyStage && companySizeIndicator

  const handleGetResults = () => {
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
      offerAmount,
      sourceFlow: 'offer-check',
    })
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <StepProgress steps={STEPS} current={step} />

      {/* ── Step 1: Enter Offer ───────────────────── */}
      {step === 1 && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">What's the number?</h2>
            <p className="flow-subtitle">
              Enter your current salary, a job offer, or a number you're considering asking for.
              We'll show you exactly where it sits in the market.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Total Annual Compensation (USD) *</label>
            <input
              type="text"
              className="form-input offer-input"
              placeholder="$0"
              value={offerText}
              onChange={e => setOfferText(formatCurrency(e.target.value))}
              style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', height: '72px', textAlign: 'center' }}
            />
            <p className="form-hint" style={{ textAlign: 'center' }}>
              Include base + expected bonus + annualized equity. For offers, use the total package.
            </p>
          </div>

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={onBack}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setStep(2)}
              disabled={!isValidOffer}
              style={{ flex: 1 }}
            >
              {isValidOffer ? `Benchmark ${offerText} →` : 'Enter an amount to continue'}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Role Details ──────────────────── */}
      {step === 2 && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">What's the role?</h2>
            <p className="flow-subtitle">
              Benchmark: <strong style={{ color: 'var(--brand-light)' }}>{offerText}</strong>
              &nbsp;— now tell us what role this is for.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Job Family *</label>
            <select className="form-select" value={family} onChange={e => { setFamily(e.target.value); setSubfamily('') }}>
              <option value="">Select family…</option>
              {Object.entries(jobFamilies).map(([code, data]) => (
                <option key={code} value={code}>{data.name}</option>
              ))}
            </select>
          </div>

          {family && (
            <div className="form-group">
              <label className="form-label">Specialty *</label>
              <select className="form-select" value={subfamily} onChange={e => setSubfamily(e.target.value)}>
                <option value="">Select specialty…</option>
                {subfamilies.map(s => <option key={s.code} value={s.code}>{s.icon} {s.name}</option>)}
              </select>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Seniority Level *</label>
            <select className="form-select" value={level} onChange={e => setLevel(e.target.value)}>
              <option value="">Select level…</option>
              <optgroup label="Individual Contributor">
                {IC_LEVELS.map(l => <option key={l.code} value={l.code}>{l.code} — {l.name}</option>)}
              </optgroup>
              <optgroup label="Management">
                {MGT_LEVELS.map(l => <option key={l.code} value={l.code}>{l.code} — {l.name}</option>)}
              </optgroup>
              <optgroup label="Executive">
                {EXE_LEVELS.map(l => <option key={l.code} value={l.code}>{l.code} — {l.name}</option>)}
              </optgroup>
            </select>
          </div>

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary btn-lg" onClick={() => setStep(3)} disabled={!step2Complete} style={{ flex: 1 }}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Company Context ───────────────── */}
      {step === 3 && (
        <div className="card">
          <div className="flow-header">
            <h2 className="flow-title">Company context</h2>
            <p className="flow-subtitle">
              Stage and size adjust the benchmark significantly — a Pre-seed offer and a Series C
              offer for the same role title can differ by 40%.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Company Stage *</label>
            <select className="form-select" value={companyStage} onChange={e => { setCompanyStage(e.target.value); setCompanySizeIndicator('') }}>
              <option value="">Select stage…</option>
              {companyStages.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </div>

          {companyStage && (
            <div className="form-group">
              <label className="form-label">{getSizeLabel(companyStage)} *</label>
              <select className="form-select" value={companySizeIndicator} onChange={e => setCompanySizeIndicator(e.target.value)}>
                <option value="">Select range…</option>
                {getSizeOptions(companyStage).map(o => <option key={o.code} value={o.code}>{o.name}</option>)}
              </select>
            </div>
          )}

          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleGetResults}
              disabled={!step3Complete}
              style={{ flex: 1 }}
            >
              Analyze My Offer →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Export sub-component for use in ResultsView
export { OfferResult, computePercentile }
