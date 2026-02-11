# MyCryptoDevPay 💰

**The open-source compensation benchmarking platform for the crypto industry.**

> Know your worth. Based on rigorous role evaluation, not guesswork.

---

## 🎯 What Is This?

MyCryptoDevPay is a web-based platform that provides **transparent, data-driven salary benchmarks** specifically for the crypto/blockchain industry. 

Unlike generic salary sites, we use a **rigorous points-factor evaluation methodology** (adapted from the industry-standard JobLink system) to assess roles based on their actual requirements—not just job titles.

### The Problem We Solve

The crypto industry has a massive compensation transparency problem:
- 💸 Wildly inconsistent pay for similar roles
- 🎭 Title inflation ("Senior" meaning different things everywhere)
- 🌍 No standard for global remote teams
- 🪙 Token compensation that's hard to value
- 📊 Existing salary data is locked behind expensive paywalls

### Our Solution

An **open-source, community-powered** compensation framework that:
1. **Evaluates roles objectively** using 5 weighted factors
2. **Maps to standardized levels** (IC1-IC6, M1-M2, D1-D2, VP)
3. **Shows real compensation data** from surveys + crowdsourced submissions
4. **Handles token compensation** with risk-adjusted valuations

---

## 🔬 How It Works

### The Evaluation Methodology

We adapted the **JobLink Points Factor System** (used by Fortune 500 companies) for crypto:

| Factor | Weight | What It Measures |
|--------|--------|------------------|
| **Knowledge & Application** | 30% | Required expertise and how it's applied |
| **Problem Solving** | 15% | Complexity of challenges faced |
| **Interaction** | 15% | Communication and influence required |
| **Impact** | 30% | Organizational scope and effect |
| **Accountability** | 10% | Financial/resource responsibility |

Each role scores **0-1000 points**, which maps to **Grades 1-15**, which maps to **Tech Levels**:

| Points | Grade | Level | Typical Titles |
|--------|-------|-------|----------------|
| 100-205 | 1-3 | IC1 | Junior, Associate, Engineer I |
| 206-329 | 4-5 | IC2 | Mid-level, Engineer II |
| 330-485 | 6-7 | IC3 | Senior, Engineer III |
| 486-641 | 8-9 | IC4 | Staff, Tech Lead |
| 642-790 | 10-11 | IC5 | Principal, Architect |
| 791-906 | 12-13 | IC6 | Distinguished, Fellow |
| 907-1000 | 14-15 | VP+ | VP, C-Level |

### Crypto-Specific Adjustments

- **🔗 Crypto-Native Bonus:** +5% to Knowledge score for roles requiring deep blockchain expertise
- **🔒 Security Uplift:** +10% to Problem Solving for security-critical roles (auditors, cryptographers)
- **🪙 Token Risk Adjustment:** Discounts LTI value based on token liquidity tier

---

## 📊 Features

### 1. Find Your Salary Range

**Two paths to get compensation data:**

- **📄 Paste a Job Description** — AI analyzes it and suggests:
  - Matched standard title from our catalog
  - Appropriate level (with confidence score)
  - Factor scores across all 5 dimensions
  - Flags for title/responsibility misalignment

- **🎯 Select from Dropdowns** — Manually choose:
  - Job family & subfamily
  - Seniority level
  - Company stage & size

### 2. Comprehensive Job Catalog

**7 Job Families, 24 Subfamilies, 100+ Standard Titles**

| Family | Subfamilies |
|--------|-------------|
| **Engineering** | Protocol/Core, Smart Contract, Backend, Frontend, Full Stack, DevOps, Security, Data/ML |
| **Product & Design** | Product Management, UX/UI Design, User Research |
| **Business** | Business Development, Partnerships, Sales |
| **Operations** | Legal/Compliance, Finance, HR/People, Operations |
| **Marketing** | Marketing, Community Management, Developer Relations |
| **Research** | Cryptography, Economics, Academic Research |
| **Governance** | Governance Lead, Delegate, DAO Operations, Tokenomics |

### 3. Compensation Breakdown

For each role evaluation, you get:

| Percentile | Base Salary | STI/Bonus | LTI/Equity | Total Comp |
|------------|-------------|-----------|------------|------------|
| 25th | $XXX,XXX | $XX,XXX | $XX,XXX | $XXX,XXX |
| 50th (Median) | $XXX,XXX | $XX,XXX | $XX,XXX | $XXX,XXX |
| 75th | $XXX,XXX | $XX,XXX | $XX,XXX | $XXX,XXX |
| 90th | $XXX,XXX | $XX,XXX | $XX,XXX | $XXX,XXX |

**Pay Mix by Level:**
- IC1-IC2: 85% Base / 10% STI / 5% LTI
- IC3-IC4: 75% Base / 15% STI / 10% LTI
- IC5-IC6: 65% Base / 15% STI / 20% LTI
- Directors: 60% Base / 15% STI / 25% LTI
- VP+: 50% Base / 20% STI / 30% LTI

### 4. Crowdsourced Data Submission

Help improve the platform by anonymously contributing your compensation:

- **Job title matching** with autocomplete
- **Company anonymization** option ("Anonymous Series B Protocol")
- **Multiple verification methods:**
  - X/Twitter profile link
  - LinkedIn profile link
  - Employer verification letter
  - Honor system (marked as unverified)
- **Minimum 5 submissions** before data is shown for a role

---

## 🏗️ Technical Architecture

### Built With
- **React 18** — UI framework
- **Vite** — Build tool
- **Pure CSS** — Custom design system (no Tailwind)
- **LocalStorage** — Data persistence (MVP)

### Project Structure
```
mycryptodevpay/
├── src/
│   ├── App.jsx                    # Main application
│   ├── components/
│   │   ├── LandingChoice.jsx      # Home page with 3 paths
│   │   ├── JDUploadFlow.jsx       # AI job description analysis
│   │   ├── DropdownFlow.jsx       # Manual selection flow
│   │   ├── SubmitCompFlow.jsx     # Crowdsource submission
│   │   ├── ResultsView.jsx        # Compensation display
│   │   └── ComparisonView.jsx     # Role comparison (coming soon)
│   ├── data/
│   │   └── jobCatalog.js          # Job families, titles, levels
│   ├── utils/
│   │   ├── evaluationEngine.js    # JobLink scoring logic
│   │   └── aiAnalyzer.js          # JD parsing & matching
│   └── styles/
│       └── main.css               # Design system
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Deployment

The app is deployed on Vercel: **[mycryptodevpay.vercel.app](https://mycryptodevpay.vercel.app)**

### Run Locally
```bash
git clone https://github.com/KerberusPrime/mycryptodevpay.git
cd mycryptodevpay
npm install
npm run dev
# Open http://localhost:3000
```

### Deploy Your Own
1. Fork this repository
2. Connect to [Vercel](https://vercel.com)
3. Import the project
4. Deploy (auto-configured for Vite)

---

## 🗺️ Roadmap

### Phase 1 (Current) — MVP ✅
- [x] Job catalog with 100+ titles
- [x] Points-factor evaluation engine
- [x] AI job description analyzer
- [x] Two input flows (JD upload / dropdown)
- [x] Compensation results display
- [x] Crowdsource submission flow
- [x] PWA support

### Phase 2 — Data Infrastructure
- [ ] Supabase/Firebase backend
- [ ] Survey data import (Radford, Pave, OpenComp)
- [ ] Admin dashboard
- [ ] Data export API

### Phase 3 — Enhanced Features
- [ ] CoinMarketCap API integration for token prices
- [ ] Token Risk Adjustment Factor calculator
- [ ] Role comparison tool
- [ ] Company benchmarking
- [ ] Geographic cost-of-labor adjustments (optional)

### Phase 4 — Community
- [ ] User accounts
- [ ] Saved searches
- [ ] Salary alerts
- [ ] Company reviews

---

## 📄 Data Sources

| Source | Type | Status |
|--------|------|--------|
| **Radford** | Industry Survey | To be imported |
| **Pave** | Industry Survey | To be imported |
| **OpenComp** | Industry Survey | To be imported |
| **Independent Survey** | Industry Survey | To be imported |
| **Community Submissions** | Crowdsourced | Live |

*Survey data is kept separate and proprietary. Only aggregated results are shown.*

---

## 🤝 Contributing

This is an open-source project under the MIT license. Contributions welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Priority Contributions Needed
- [ ] Backend integration (Supabase preferred)
- [ ] Additional job titles for the catalog
- [ ] Factor scoring calibration
- [ ] UI/UX improvements
- [ ] Mobile optimization

---

## 📜 License

MIT License — Use it however you want.

---

## 🙏 Acknowledgments

- **JobLink Points Factor System** by Aon — The foundation of our evaluation methodology
- **Radford, Pave, OpenComp** — Industry compensation data
- **The Crypto Community** — For contributing salary data

---

## 📬 Contact

- **Repository:** [github.com/KerberusPrime/mycryptodevpay](https://github.com/KerberusPrime/mycryptodevpay)
- **Issues:** [Report bugs or request features](https://github.com/KerberusPrime/mycryptodevpay/issues)

---

*Built with 💜 for the crypto community*
