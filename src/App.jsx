import React, { useState, useEffect } from 'react'
import Header          from './components/Header.jsx'
import LandingChoice   from './components/LandingChoice.jsx'
import JDUploadFlow    from './components/JDUploadFlow.jsx'
import DropdownFlow    from './components/DropdownFlow.jsx'
import SubmitCompFlow  from './components/SubmitCompFlow.jsx'
import ResultsView     from './components/ResultsView.jsx'
import OfferCheckFlow  from './components/OfferCheckFlow.jsx'
import ComparisonView  from './components/ComparisonView.jsx'
import TokenCalculator from './components/TokenCalculator.jsx'
import MethodologyPage from './components/MethodologyPage.jsx'
import FAQPage         from './components/FAQPage.jsx'
import { evaluateRole }   from './utils/evaluationEngine.js'
import { loadCompData }   from './utils/dataService.js'
import { readResultsFromURL, clearURL, pushResultsToURL } from './utils/urlState.js'
import { jobFamilies }    from './data/jobCatalog.js'

function getSubmissionCount() {
  try {
    const stored = localStorage.getItem('mcdp_submissions')
    return stored ? JSON.parse(stored).length : 0
  } catch { return 0 }
}

export default function App() {
  const [currentView, setCurrentView]       = useState('landing')
  const [evaluationData, setEvaluationData] = useState(null)
  const [compData, setCompData]             = useState(null)
  const [submissionCount, setSubmissionCount] = useState(0)

  // Load comp data from localStorage and check URL state on mount
  useEffect(() => {
    loadCompData().then(data => setCompData(data))
    setSubmissionCount(getSubmissionCount())

    // Auto-restore from shareable URL
    const params = readResultsFromURL()
    if (params) {
      const fam = jobFamilies[params.family]
      const sub = fam?.subfamilies?.[params.subfamily]
      if (fam && sub) {
        const result = evaluateRole({
          ...params,
          compDataOverride: null,
        })
        setEvaluationData({
          ...result,
          family:        params.family,
          subfamily:     params.subfamily,
          familyName:    fam.name,
          subfamilyName: sub.name,
          isCryptoNative: sub.cryptoNative,
          isSecurityRole: sub.securityRole,
        })
        setCurrentView('results')
      }
    }
  }, [])

  const handleEvaluationComplete = (params) => {
    const result = evaluateRole({
      ...params,
      compDataOverride: compData?.[params.level] ?? null,
    })
    const evalData = {
      ...result,
      family:        params.family,
      subfamily:     params.subfamily,
      familyName:    params.familyName,
      subfamilyName: params.subfamilyName,
      jobTitle:      params.jobTitle,
      isCryptoNative: params.isCryptoNative,
      isSecurityRole: params.isSecurityRole,
    }
    setEvaluationData(evalData)
    pushResultsToURL({
      level:                params.level,
      family:               params.family,
      subfamily:            params.subfamily,
      companyStage:         params.companyStage,
      companySizeIndicator: params.companySizeIndicator,
    })
    setCurrentView('results')
  }

  const handleSubmissionComplete = () => {
    setSubmissionCount(getSubmissionCount())
    setCurrentView('landing')
  }

  const navigateTo = (view) => {
    if (view === 'landing') clearURL()
    setCurrentView(view)
  }

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingChoice
            onSelect={navigateTo}
            submissionCount={submissionCount}
          />
        )

      case 'jd-upload':
        return (
          <JDUploadFlow
            onComplete={handleEvaluationComplete}
            onBack={() => navigateTo('landing')}
          />
        )

      case 'dropdown':
        return (
          <DropdownFlow
            onComplete={handleEvaluationComplete}
            onBack={() => navigateTo('landing')}
          />
        )

      case 'submit':
        return (
          <SubmitCompFlow
            onComplete={handleSubmissionComplete}
            onBack={() => navigateTo('landing')}
          />
        )

      case 'results':
        return (
          <ResultsView
            evaluation={evaluationData}
            onBack={() => navigateTo('landing')}
            onSubmitData={() => navigateTo('submit')}
            onCompare={() => navigateTo('comparison')}
            onTokenCalc={() => navigateTo('token-calc')}
          />
        )

      case 'offer-check':
        return (
          <OfferCheckFlow
            onBack={() => navigateTo(evaluationData ? 'results' : 'landing')}
          />
        )

      case 'comparison':
        return (
          <ComparisonView
            initialEvaluation={evaluationData}
            onBack={() => navigateTo(evaluationData ? 'results' : 'landing')}
          />
        )

      case 'token-calc':
        return (
          <TokenCalculator
            onBack={() => navigateTo(evaluationData ? 'results' : 'landing')}
          />
        )

      case 'methodology':
        return (
          <MethodologyPage
            onBack={() => navigateTo('landing')}
          />
        )

      case 'faq':
        return (
          <FAQPage
            onBack={() => navigateTo('landing')}
            onNavigate={navigateTo}
          />
        )

      default:
        return <LandingChoice onSelect={navigateTo} submissionCount={submissionCount} />
    }
  }

  return (
    <div className="app-container">
      <Header onNavigate={navigateTo} currentView={currentView} />
      <main className="main-content">{renderView()}</main>
      <footer className="app-footer">
        <p>MyCryptoDevPay © 2025 · Open Source Compensation Framework · MIT License</p>
        <p className="footer-note">All data is aggregated and anonymized. Benchmarks are indicative only.</p>
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => navigateTo('methodology')}>Methodology</span>
          <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => navigateTo('faq')}>FAQ</span>
          <a href="https://github.com/KerberusPrime/mycryptodevpay" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub ↗</a>
        </div>
      </footer>
    </div>
  )
}
