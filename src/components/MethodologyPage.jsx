import React, { useState } from 'react'

const FACTORS = [
  {
    key: 'know',
    label: 'Knowledge & Application',
    weight: '30%',
    color: 'var(--factor-knowledge)',
    desc: 'Measures the depth and breadth of technical or domain expertise required, and how that knowledge is applied. A junior engineer applies established patterns; a principal architect originates new ones.',
    examples: [
      'IC1–IC2: Apply known tools and frameworks under supervision',
      'IC3–IC4: Deep expertise in a sub-domain, guides others',
      'IC5+: Cross-domain mastery, sets technical direction',
      '+5% uplift for crypto-native roles (on-chain, DeFi, protocol)',
    ],
  },
  {
    key: 'prob',
    label: 'Problem Solving',
    weight: '15%',
    color: 'var(--factor-problem)',
    desc: 'Evaluates the complexity, novelty, and ambiguity of the problems encountered. Early-career roles solve well-defined problems; senior roles handle open-ended, poorly-constrained challenges.',
    examples: [
      'IC1–IC2: Well-defined problems with clear solutions',
      'IC3–IC4: Ambiguous problems requiring research and tradeoff analysis',
      'IC5+: First-principles problem solving; inventing new approaches',
      '+10% uplift for security/audit roles (adversarial problem space)',
    ],
  },
  {
    key: 'inter',
    label: 'Interaction',
    weight: '15%',
    color: 'var(--factor-interaction)',
    desc: 'Captures the complexity of communication, influence, and stakeholder management. Individual contributors primarily interact with immediate teams; executives engage boards, investors, and regulators.',
    examples: [
      'IC1–IC2: Team-scoped communication',
      'IC3–IC4: Cross-functional coordination, external partners',
      'VP+: C-suite, board, and public-facing communication',
      'Management tracks score 20–30% higher than IC equivalents',
    ],
  },
  {
    key: 'impact',
    label: 'Impact',
    weight: '30%',
    color: 'var(--factor-impact)',
    desc: 'Reflects the organizational scope and business effect of the role. This factor, like Knowledge, carries the heaviest weight because output quality and scale are the primary drivers of market compensation.',
    examples: [
      'IC1–IC2: Task-level impact within a feature or service',
      'IC3–IC4: Project or product-line level impact',
      'D1+: Divisional impact; VP+: company-wide strategic impact',
    ],
  },
  {
    key: 'account',
    label: 'Accountability',
    weight: '10%',
    color: 'var(--factor-accountability)',
    desc: 'Measures financial and resource ownership. Does the role hold a budget? Is it responsible for revenue, treasury, or hiring decisions? Executive roles carry proportionally higher accountability.',
    examples: [
      'IC1–IC4: Limited formal financial accountability',
      'D1–D2: Budget ownership, headcount decisions',
      'VP+: P&L responsibility, executive accountability',
    ],
  },
]

const LEVEL_TABLE = [
  { level: 'IC1', name: 'Associate',         track: 'IC',   range: '100–199',   desc: 'Entry level; executes defined tasks under supervision.' },
  { level: 'IC2', name: 'Mid-Level',          track: 'IC',   range: '200–299',   desc: 'Works independently on assigned scope.' },
  { level: 'IC3', name: 'Senior',             track: 'IC',   range: '300–399',   desc: 'Technical leadership on projects; mentors IC1/2.' },
  { level: 'IC4', name: 'Staff / Lead',       track: 'IC',   range: '400–499',   desc: 'Cross-team scope, sets engineering direction for an area.' },
  { level: 'IC5', name: 'Principal',          track: 'IC',   range: '500–599',   desc: 'Organization-wide technical strategy and impact.' },
  { level: 'IC6', name: 'Distinguished',      track: 'IC',   range: '600–699',   desc: 'Industry-recognized expertise; shapes company direction.' },
  { level: 'M1', name: 'Manager',             track: 'Mgmt', range: '350–449',   desc: 'Direct team management; delivery accountability.' },
  { level: 'M2', name: 'Senior Manager',      track: 'Mgmt', range: '450–549',   desc: 'Multi-team management; organizational planning.' },
  { level: 'D1', name: 'Director',            track: 'Mgmt', range: '550–649',   desc: 'Divisional leadership; budget and headcount ownership.' },
  { level: 'D2', name: 'Senior Director',     track: 'Mgmt', range: '650–749',   desc: 'Multi-division oversight; strategic initiatives.' },
  { level: 'VP', name: 'Vice President',      track: 'Exec', range: '750–1000',  desc: 'Executive team; company-wide remit and P&L.' },
]

const STAGE_TABLE = [
  { stage: 'Pre-seed',  baseMul: '0.70×', ltiNote: 'Very high equity upside; often option-heavy',  desc: 'Sub-$1M raised; extremely high risk.' },
  { stage: 'Seed',      baseMul: '0.80×', ltiNote: 'High equity upside',                           desc: '$1M–$5M raised; product validation phase.' },
  { stage: 'Series A',  baseMul: '0.88×', ltiNote: 'Meaningful equity component',                  desc: '$5M–$25M; scaling initial product.' },
  { stage: 'Series B',  baseMul: '0.94×', ltiNote: 'Equity as defined by comp band',               desc: '$25M–$100M; growth phase.' },
  { stage: 'Series C+', baseMul: '1.00×', ltiNote: 'Baseline — LTI benchmarked here',              desc: '$100M+; late-stage, near-public.' },
  { stage: 'Token Live',baseMul: '0.90×', ltiNote: 'Protocol tokens; market-dependent value',      desc: 'Decentralized protocol with liquid token.' },
  { stage: 'DAO',       baseMul: '0.75×', ltiNote: 'Governance token; treasury-dependent',         desc: 'Decentralized Autonomous Organization.' },
]

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function FactorCard({ factor, open, onToggle }) {
  return (
    <div
      className="card"
      style={{ marginBottom: '0.75rem', cursor: 'pointer', padding: '1rem 1.25rem' }}
      onClick={onToggle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: factor.color, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{factor.label}</span>
            <span className="tag tag-muted" style={{ fontSize: '0.68rem' }}>{factor.weight} weight</span>
          </div>
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '0.75rem' }}>
            {factor.desc}
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {factor.examples.map((ex, i) => (
              <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem' }}>
                <span style={{ color: factor.color, flexShrink: 0 }}>→</span> {ex}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function MethodologyPage({ onBack }) {
  const [openFactor, setOpenFactor] = useState(null)

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="landing-eyebrow" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
            ⬡ Open Methodology
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            How We Benchmark Comp
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '520px' }}>
            A transparent, points-factor framework for evaluating roles — no black boxes, no title games.
            Every number is traceable to a methodology you can audit.
          </p>
        </div>
        {onBack && <button className="btn btn-ghost" onClick={onBack}>← Back</button>}
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="card">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1rem' }}>
            MyCryptoDevPay uses a <strong style={{ color: 'var(--text-primary)' }}>Points-Factor evaluation methodology</strong> — the same
            foundational approach used by Hay Group, Willis Towers Watson, and Mercer in traditional enterprise comp — adapted
            for the crypto and Web3 industry. Each role is scored on five weighted factors, producing a total points score
            (0–1000) that maps to a standardized grade level.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1rem' }}>
            That grade level is then used to look up a compensation band — currently bootstrapped from public community
            data and structured comp surveys, and designed to be refined by crowdsourced anonymous submissions.
          </p>
          <div className="alert alert-info" style={{ marginTop: '0' }}>
            <strong>Why this matters:</strong> Job titles in crypto are notoriously inconsistent. A "Senior Engineer" at a 5-person
            seed-stage startup is a very different role than a "Senior Engineer" at a $2B protocol. Points-factor scoring
            cuts through title inflation and measures the actual work.
          </div>
        </div>
      </Section>

      {/* Five Factors */}
      <Section title="The Five Evaluation Factors">
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Every role is scored 0–10 on each factor. Weighted contributions sum to a total points score out of 1000.
          Click any factor to expand its definition and scoring examples.
        </p>
        {FACTORS.map(f => (
          <FactorCard
            key={f.key}
            factor={f}
            open={openFactor === f.key}
            onToggle={() => setOpenFactor(openFactor === f.key ? null : f.key)}
          />
        ))}
      </Section>

      {/* Level Table */}
      <Section title="Grade Levels & Points Ranges">
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)' }}>
                {['Level', 'Title', 'Track', 'Points Range', 'Summary'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {LEVEL_TABLE.map((row, i) => (
                <tr key={row.level} style={{ borderBottom: i < LEVEL_TABLE.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className="level-badge" style={{ fontSize: '0.75rem' }}>{row.level}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{row.name}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`tag ${row.track === 'IC' ? 'tag-info' : row.track === 'Mgmt' ? 'tag-success' : 'tag-brand'}`} style={{ fontSize: '0.68rem' }}>{row.track}</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--brand-light)', fontWeight: 600 }}>{row.range}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Company Stage Multipliers */}
      <Section title="Company Stage Multipliers">
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
          Base salary benchmarks are indexed to a Series C+ company (1.00×). Earlier-stage companies
          apply a discount multiplier to reflect lower cash affordability — typically offset by higher
          equity upside potential. LTI (equity/tokens) is sized inversely: earlier stages grant
          proportionally more equity.
        </p>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)' }}>
                {['Stage', 'Base Multiplier', 'LTI Notes', 'Description'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAGE_TABLE.map((row, i) => (
                <tr key={row.stage} style={{ borderBottom: i < STAGE_TABLE.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{row.stage}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: row.baseMul === '1.00×' ? 'var(--brand-light)' : row.baseMul < '0.80×' ? 'var(--danger)' : 'var(--text-primary)' }}>{row.baseMul}</span>
                    {row.baseMul === '1.00×' && <span className="tag tag-muted" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>Baseline</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{row.ltiNote}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Geographic Adjustment */}
      <Section title="Geographic Adjustment">
        <div className="card">
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '0.75rem' }}>
            All benchmarks default to <strong style={{ color: 'var(--text-primary)' }}>US non-Bay Area / non-NYC (1.00× baseline)</strong>.
            A geographic multiplier can be applied to adjust for cost-of-labor differences across 9 regions:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'US — Bay Area / NYC', mul: '1.12×', type: 'premium' },
              { label: 'US — Other Cities', mul: '1.00×', type: 'baseline' },
              { label: 'Remote / Global', mul: '0.96×', type: 'normal' },
              { label: 'EU — London / Zurich', mul: '0.88×', type: 'normal' },
              { label: 'EU — Berlin / Lisbon', mul: '0.74×', type: 'discount' },
              { label: 'APAC — Singapore / HK', mul: '0.84×', type: 'normal' },
              { label: 'APAC — Australia', mul: '0.80×', type: 'normal' },
              { label: 'Latin America', mul: '0.55×', type: 'discount' },
              { label: 'Middle East / Africa', mul: '0.68×', type: 'discount' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{r.label}</span>
                <span style={{ fontWeight: 700, fontSize: '0.82rem', color: r.type === 'premium' ? 'var(--success)' : r.type === 'baseline' ? 'var(--brand-light)' : r.type === 'discount' ? 'var(--danger)' : 'var(--text-primary)' }}>{r.mul}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.5 }}>
            Geographic multipliers reflect crypto-industry positioning, which is more remote-friendly and less geography-bound than traditional tech. These are approximate cost-of-labor ratios, not cost-of-living conversions.
          </p>
        </div>
      </Section>

      {/* Data Sources */}
      <Section title="Data Sources & Confidence">
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '📊', title: 'Crowdsourced submissions', desc: 'Anonymous salary data submitted through this tool. Data points only surface in results once 5+ submissions exist for a role-stage combination. Submissions include role level, family, company stage, and total comp components.' },
              { icon: '🔍', title: 'Public compensation surveys', desc: 'Structured comp survey data from Levels.fyi, Electric Capital Developer Reports, DeFi-native talent surveys, and other publicly available sources. Used to bootstrap initial benchmarks and validate crowdsourced outliers.' },
              { icon: '🤝', title: 'Recruiter and operator network', desc: 'Qualitative calibration from active crypto recruiters, protocol operators, and People/Total Rewards professionals who have contributed structured feedback on comp band accuracy.' },
            ].map(s => (
              <div key={s.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{s.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
            <strong>Limitations:</strong> Benchmarks are indicative, not authoritative. The crypto job market is fast-moving and regionally sparse. Early-stage data has wide confidence intervals. Always cross-reference with live job postings and direct recruiter conversations.
          </div>
        </div>
      </Section>

      {/* Open Source */}
      <Section title="Open Source & Contributing">
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⬡</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>MIT Licensed — fully open source</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            The evaluation engine, scoring weights, and comp band data are all public. Fork it, improve it,
            or integrate it into your own tools. Contributions to both code and data are welcome.
          </p>
          <a
            href="https://github.com/KerberusPrime/mycryptodevpay"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View on GitHub ↗
          </a>
        </div>
      </Section>

      <button className="btn btn-ghost" onClick={onBack}>← Back to home</button>
    </div>
  )
}
