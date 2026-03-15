import React, { useState } from 'react'

const FAQS = [
  {
    category: 'Understanding the Results',
    items: [
      {
        q: 'What do IC1, IC2, IC3… mean?',
        a: 'IC stands for Individual Contributor. The number represents the seniority level on the IC career track. IC1 is entry-level (associate), IC2 is mid-level, IC3 is senior, IC4 is staff/lead, IC5 is principal, IC6 is distinguished. Management roles (M1/M2/D1/D2/VP) are on a separate track and reflect increasing people and organizational leadership scope.',
      },
      {
        q: 'What is STI and LTI?',
        a: 'STI (Short-Term Incentive) is your annual bonus — a cash payment tied to individual and company performance, typically paid once a year. LTI (Long-Term Incentive) is your equity or token allocation, expressed as an annualized value over the vesting period. In crypto, LTI can be stock options, SAFTs, token warrants, or direct token grants.',
      },
      {
        q: 'How is Total Compensation calculated?',
        a: 'Total Compensation = Base Salary + Annual Bonus (STI) + Annualized Equity/Tokens (LTI). The LTI figure is divided by the vesting period to produce an annual equivalent — for example, a 4-year vesting schedule with a $200,000 grant would contribute $50,000/year to total comp.',
      },
      {
        q: 'What does "stage-adjusted" mean?',
        a: 'We baseline all compensation figures to a Series C+ company (1.00×). If your company is at an earlier stage — say Seed (0.80×) — we apply that multiplier to the benchmark numbers to reflect realistic cash affordability at that stage. The flip side is that earlier-stage companies typically offer more equity upside to compensate for lower cash.',
      },
      {
        q: 'Why does my total comp look lower than what I see on Glassdoor or Levels.fyi?',
        a: 'Two main reasons: (1) Our data reflects crypto-specific roles and companies, not traditional tech. Crypto companies generally pay closer to Series B/C tech companies, not FAANG. (2) The stage multiplier may be applying a discount if your company is early-stage. Check your geographic adjustment and company stage settings.',
      },
    ],
  },
  {
    category: 'The Evaluation Methodology',
    items: [
      {
        q: 'How are benchmarks calculated?',
        a: 'We use a five-factor Points-Factor methodology: Knowledge & Application (30%), Problem Solving (15%), Interaction (15%), Impact (30%), and Accountability (10%). Each factor is scored 0–10 for your level. Total points (0–1000) map to a grade level, which is then used to look up comp percentiles from our data set. Stage and geographic multipliers are applied on top.',
      },
      {
        q: 'What does "Crypto-Native" mean?',
        a: 'A crypto-native role is one where deep on-chain or protocol knowledge is a primary job requirement — not just a nice-to-have. This includes smart contract engineers, DeFi protocol developers, blockchain core developers, tokenomics designers, and on-chain analysts. Crypto-native roles receive a +5% Knowledge factor uplift to reflect the specialized premium that native protocol expertise commands.',
      },
      {
        q: 'Why do security/audit roles get an extra uplift?',
        a: 'Security and audit roles in crypto (smart contract auditors, security researchers, protocol security engineers) face adversarial problem-solving environments with extremely high stakes. A single vulnerability can result in millions of dollars of user funds being lost. The +10% Problem Solving uplift reflects this specialized risk and the premium the market pays for this expertise.',
      },
      {
        q: 'Why use a Points-Factor system instead of just job titles?',
        a: 'Job title inflation is rampant in crypto. A "Head of Engineering" at a 4-person pre-seed company and a "Head of Engineering" at a 200-person Series B protocol are completely different roles. Points-factor scoring cuts through title ambiguity by measuring what the role actually requires: how hard are the problems? How wide is the impact? That produces a consistent, comparable benchmark regardless of what the job is called.',
      },
      {
        q: 'How often is the data updated?',
        a: 'The base methodology and scoring weights are updated quarterly. The underlying comp data is updated as new crowdsourced submissions come in (immediately) and when new structured survey data is published (typically 2–4 times per year). You can see the data freshness note on the Results page.',
      },
    ],
  },
  {
    category: 'Submitting Your Data',
    items: [
      {
        q: 'Is my submission anonymous?',
        a: 'Yes. We do not collect names, email addresses, or any personally identifying information. Submissions store only: job level, job family/subfamily, company stage, company size indicator, base salary, bonus, equity/token value, and geographic region. This combination is deliberately coarse enough that no individual can be identified.',
      },
      {
        q: 'How many submissions does it take before data appears?',
        a: 'A minimum of 5 submissions for the same role-stage-region combination are required before that data is shown to other users. Below that threshold, only the baseline bootstrapped data is shown. This prevents any single data point from being used to infer individual compensation.',
      },
      {
        q: 'What if my company is unusual — e.g., a foundation, not-for-profit, or hybrid entity?',
        a: 'Use the closest structural analogue. A crypto foundation with a large treasury is structurally similar to a DAO — select DAO. A not-for-profit with a $50M operating budget and normal salary structure is closest to Series B. The goal is to capture the cash comp reality, not the legal entity type.',
      },
      {
        q: 'Can my company use this tool internally for comp planning?',
        a: 'Yes — the tool is MIT licensed and completely open source. You can fork it, load your own comp band CSV, and use the evaluation engine internally. The CSV import feature allows you to replace the default benchmarks with your own proprietary data. See the GitHub repository for setup instructions.',
      },
    ],
  },
  {
    category: 'Token & Equity Compensation',
    items: [
      {
        q: 'How should I value my token grant?',
        a: 'Use the Token Grant Calculator (linked from the Results page) to compute a risk-adjusted annual value. The key inputs are: number of tokens, current price (use last funding round implied price for pre-TGE tokens), vesting schedule, cliff period, and token liquidity status. The calculator applies an illiquidity discount and outputs an annualized figure you can compare directly against LTI benchmarks.',
      },
      {
        q: 'What discount should I apply to pre-TGE tokens?',
        a: 'We use research-backed discount factors: Listed & Liquid (no discount, 1.0×), Listed but Locked (25% discount, 0.75×), Pre-TGE Series B+ stage (45% discount, 0.55×), Pre-TGE Seed/Series A stage (65% discount, 0.35×). These reflect the probability of the token ever reaching the assumed price, and the illiquidity premium demanded for locked allocations.',
      },
      {
        q: 'Should I include unvested equity when evaluating an offer?',
        a: 'Yes, but express it as an annualized figure. A $400,000 token grant with a 4-year vesting schedule and 1-year cliff contributes $100,000/year to your LTI benchmark. Use that $100,000 figure when comparing against the "Equity / Tokens" row in our comp table — not the gross $400,000.',
      },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1rem 0',
        cursor: 'pointer',
      }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', flex: 1 }}>{q}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0, marginTop: '2px' }}>
          {open ? '▲' : '▼'}
        </span>
      </div>
      {open && (
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginTop: '0.75rem', paddingRight: '1.5rem' }}>
          {a}
        </p>
      )}
    </div>
  )
}

export default function FAQPage({ onBack, onNavigate }) {
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div className="landing-eyebrow" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
            Frequently Asked Questions
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
            FAQ
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Everything you need to know about how the benchmarks work, how to interpret results,
            and how to contribute your own data.
          </p>
        </div>
        {onBack && <button className="btn btn-ghost" onClick={onBack}>← Back</button>}
      </div>

      {/* FAQ sections */}
      {FAQS.map(section => (
        <div key={section.category} className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-label" style={{ marginBottom: '0.5rem' }}>{section.category}</div>
          {section.items.map(item => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      ))}

      {/* Still have questions? */}
      <div className="card" style={{ textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, var(--bg-card), rgba(124,58,237,0.06))' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💬</div>
        <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Still have questions?</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem', maxWidth: '400px', margin: '0 auto 1.25rem' }}>
          Open an issue on GitHub or dive into the methodology page for a deeper technical walkthrough.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onNavigate && onNavigate('methodology')}>
            Read the Methodology →
          </button>
          <a
            href="https://github.com/KerberusPrime/mycryptodevpay/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            Open a GitHub Issue ↗
          </a>
        </div>
      </div>

      <button className="btn btn-ghost" onClick={onBack} style={{ marginTop: '0.5rem' }}>← Back to home</button>
    </div>
  )
}
