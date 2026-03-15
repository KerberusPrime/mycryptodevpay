import React, { useState, useMemo } from 'react'

const fmt     = n => '$' + Math.round(n).toLocaleString()
const fmtFull = n => n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n/1e3).toFixed(0)}K` : `$${Math.round(n)}`

const TOKEN_STATUSES = [
  { code: 'liquid',      label: 'Listed & Liquid',       discount: 1.00, desc: 'Token is live, liquid, and tradeable. Full FMV applies.' },
  { code: 'listed-lock', label: 'Listed but Locked',     discount: 0.75, desc: 'Token is live but your allocation is locked post-TGE. Apply a 25% illiquidity discount.' },
  { code: 'pretge-b',   label: 'Pre-TGE (Series B+)',    discount: 0.55, desc: 'Token not yet launched; Series B or later funding stage. Higher certainty of launch.' },
  { code: 'pretge-a',   label: 'Pre-TGE (Seed/Series A)',discount: 0.35, desc: 'Token not yet launched; early stage with meaningful execution risk. Heavy discount applies.' },
]

const VESTING_PRESETS = [
  { label: '4yr / 1yr cliff',  months: 48, cliff: 12 },
  { label: '3yr / 1yr cliff',  months: 36, cliff: 12 },
  { label: '2yr / 6mo cliff',  months: 24, cliff: 6  },
  { label: '2yr / no cliff',   months: 24, cliff: 0  },
  { label: 'Custom',           months: 0,  cliff: 0  },
]

export default function TokenCalculator({ onBack }) {
  const [tokens,       setTokens]       = useState('')
  const [price,        setPrice]        = useState('')
  const [vestingMonths,setVestingMonths]= useState(48)
  const [cliffMonths,  setCliffMonths]  = useState(12)
  const [lockupMonths, setLockupMonths] = useState(0)
  const [statusCode,   setStatusCode]   = useState('liquid')
  const [preset,       setPreset]       = useState('4yr / 1yr cliff')

  const tokenCount  = parseFloat(tokens.replace(/[^0-9.]/g, ''))  || 0
  const tokenPrice  = parseFloat(price.replace(/[^0-9.]/g, ''))   || 0

  const status = TOKEN_STATUSES.find(s => s.code === statusCode) ?? TOKEN_STATUSES[0]

  const results = useMemo(() => {
    if (!tokenCount || !tokenPrice || !vestingMonths) return null

    const grossValue       = tokenCount * tokenPrice
    const annualGross      = grossValue / (vestingMonths / 12)
    const effectiveLockup  = Math.max(cliffMonths, lockupMonths)
    // Cliff reduces effective earning period
    const earnableMonths   = Math.max(vestingMonths - cliffMonths, 1)
    const annualPostCliff  = (grossValue / vestingMonths) * 12  // monthly vesting * 12
    const riskAdjusted     = grossValue * status.discount
    const annualRiskAdj    = riskAdjusted / (vestingMonths / 12)
    // Effective annualized (what you'd use for comp benchmarking)
    const benchmarkValue   = annualRiskAdj

    return {
      grossValue,
      annualGross,
      riskAdjusted,
      annualRiskAdj,
      benchmarkValue,
      discount: status.discount,
    }
  }, [tokenCount, tokenPrice, vestingMonths, cliffMonths, lockupMonths, statusCode])

  const handlePreset = (p) => {
    setPreset(p.label)
    if (p.months) { setVestingMonths(p.months); setCliffMonths(p.cliff) }
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Token Grant Calculator</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Convert your token allocation into an annualized compensation value
          </p>
        </div>
        {onBack && <button className="btn btn-ghost" onClick={onBack}>← Back</button>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

        {/* ── Inputs ──────────────────────────────── */}
        <div className="card">
          <div className="card-label">Grant Details</div>

          <div className="form-group">
            <label className="form-label">Number of Tokens</label>
            <input type="text" className="form-input" placeholder="e.g., 500,000"
              value={tokens} onChange={e => setTokens(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Current Token Price (USD)</label>
            <input type="text" className="form-input" placeholder="e.g., $0.50 or $12.00"
              value={price} onChange={e => setPrice(e.target.value)} />
            <p className="form-hint">Use current FMV for listed tokens. For pre-TGE, use the last funding round implied price.</p>
          </div>

          <div className="card-label" style={{ marginTop: '1rem' }}>Vesting Schedule</div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {VESTING_PRESETS.map(p => (
              <button
                key={p.label}
                className={`btn btn-sm ${preset === p.label ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handlePreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {preset === 'Custom' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Vesting Period (months)</label>
                <input type="number" className="form-input" min="1" max="120"
                  value={vestingMonths} onChange={e => setVestingMonths(Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label className="form-label">Cliff (months)</label>
                <input type="number" className="form-input" min="0" max="36"
                  value={cliffMonths} onChange={e => setCliffMonths(Number(e.target.value))} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Additional Lock-up After Vesting (months)</label>
            <input type="number" className="form-input" min="0" max="36" placeholder="0"
              value={lockupMonths} onChange={e => setLockupMonths(Number(e.target.value))} />
            <p className="form-hint">Some token grants have a lock-up period after TGE in addition to vesting.</p>
          </div>

          <div className="card-label" style={{ marginTop: '1rem' }}>Token Liquidity Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {TOKEN_STATUSES.map(s => (
              <label key={s.code} style={{
                display: 'flex', gap: '0.75rem', padding: '0.75rem 1rem',
                background: statusCode === s.code ? 'rgba(124,58,237,0.08)' : 'var(--bg-elevated)',
                border: `1px solid ${statusCode === s.code ? 'var(--border-brand)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s',
              }}>
                <input type="radio" name="status" value={s.code}
                  checked={statusCode === s.code}
                  onChange={() => setStatusCode(s.code)}
                  style={{ accentColor: 'var(--brand-light)', marginTop: '2px' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.label}</span>
                    <span className="tag tag-muted" style={{ fontSize: '0.68rem' }}>{(s.discount * 100).toFixed(0)}% of FMV</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{s.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* ── Results ─────────────────────────────── */}
        <div style={{ position: 'sticky', top: '80px' }}>
          {!results ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🪙</div>
              <div>Enter token count and price to see your grant value</div>
            </div>
          ) : (
            <>
              {/* Hero result */}
              <div className="verdict-card" style={{ marginBottom: '1rem' }}>
                <div className="card-label">Annualized Comp Value</div>
                <div style={{ fontSize: '2.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--brand-light)', lineHeight: 1, margin: '0.5rem 0' }}>
                  {fmtFull(results.annualRiskAdj)}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  per year · risk-adjusted · use this in comp benchmarks
                </div>
                {results.discount < 1 && (
                  <div className="tag tag-warning" style={{ display: 'inline-flex' }}>
                    {(results.discount * 100).toFixed(0)}% liquidity discount applied
                  </div>
                )}
              </div>

              {/* Breakdown */}
              <div className="card">
                <div className="card-label">Full Breakdown</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '0.5rem' }}>
                  {[
                    { label: 'Total Tokens Granted',   val: `${Number(tokenCount).toLocaleString()} tokens` },
                    { label: 'Token Price Used',        val: `$${tokenPrice.toFixed(4)}` },
                    { label: 'Gross Token Value',       val: fmtFull(results.grossValue) },
                    { label: `Vesting Period`,          val: `${vestingMonths}mo · ${cliffMonths}mo cliff` },
                    { label: 'Annual Gross (pre-adj)',  val: fmtFull(results.annualGross) },
                    { label: `Risk Adjustment`,         val: `×${results.discount.toFixed(2)} (${status.label})`, highlight: true },
                    { label: 'Risk-Adjusted Total',     val: fmtFull(results.riskAdjusted) },
                    { label: 'Annual Benchmark Value',  val: fmtFull(results.annualRiskAdj), bold: true },
                  ].map(row => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <span style={{ fontSize: '0.82rem', color: row.bold ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: row.bold ? 700 : 400 }}>{row.label}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: row.bold ? 700 : 600, color: row.bold ? 'var(--brand-light)' : row.highlight ? 'var(--warning)' : 'var(--text-primary)' }}>{row.val}</span>
                    </div>
                  ))}
                </div>

                <div className="alert alert-info" style={{ marginTop: '1rem' }}>
                  <strong>Use {fmtFull(results.annualRiskAdj)}/yr</strong> as your "Equity / Tokens" figure when comparing against benchmark LTI data on the results page.
                </div>
              </div>

              {/* Scenario sensitivity */}
              <div className="card">
                <div className="card-label">Price Sensitivity</div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  What your annual grant value looks like at different token prices:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {[0.25, 0.5, 1, 2, 5].map(mult => {
                    const scenarioPrice = tokenPrice * mult
                    const scenarioAnnual = (tokenCount * scenarioPrice * results.discount) / (vestingMonths / 12)
                    return (
                      <div key={mult} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        background: mult === 1 ? 'rgba(124,58,237,0.07)' : 'transparent',
                        border: mult === 1 ? '1px solid var(--border-brand)' : '1px solid transparent',
                        borderRadius: 'var(--radius-sm)',
                      }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {mult === 1 ? '→ Current' : mult < 1 ? `${mult}× (down ${((1-mult)*100).toFixed(0)}%)` : `${mult}× (up ${((mult-1)*100).toFixed(0)}%)`}
                          {' '}@ ${scenarioPrice.toFixed(4)}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: mult === 1 ? 'var(--brand-light)' : mult >= 2 ? 'var(--success)' : mult <= 0.25 ? 'var(--danger)' : 'var(--text-primary)' }}>
                          {fmtFull(scenarioAnnual)}/yr
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
