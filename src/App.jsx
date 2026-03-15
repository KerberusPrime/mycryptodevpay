import React, { useState, useEffect } from 'react'
import Header        from './components/Header.jsx'
import LandingChoice from './components/LandingChoice.jsx'
import JDUploadFlow  from './components/JDUploadFlow.jsx'
import DropdownFlow  from './components/DropdownFlow.jsx'
import SubmitCompFlow from './components/SubmitCompFlow.jsx'
import ResultsView   from './components/ResultsView.jsx'
import { evaluateRole }    from './utils/evaluationEngine.js'
import { loadCompData }    from './utils/dataService.js'
import { baseCompData }    from './data/jobCatalog.js'

export default function App() {
  const [currentView, setCurrentView]     = useState('landing')
  const [evaluationData, setEvaluationData] = useState(null)
  const [compData, setCompData]           = useState(null)

  // Load any CSV-imported comp data from localStorage on mount
  useEffect(() => {
    loadCompData().then(data => {
      setCompData(data)  // null → evaluationEngine will use bundled baseCompData
    })
  }, [])

  const handleEvaluationComplete = (params) => {
    const result = evaluateRole({
      ...params,
      compDataOverride: compData?.[params.level] ?? null,
    })
    // Preserve display names passed from the flow
    setEvaluationData({
      ...result,
      familyName:    params.familyName,
      subfamilyName: params.subfamilyName,
      jobTitle:      params.jobTitle,
      isCryptoNative: params.isCryptoNative,
      isSecurityRole: params.isSecurityRole,
    })
    setCurrentView('results')
  }

  const handleSubmissionComplete = () => {
    alert('Thank you! Your compensation data has been submitted.')
    setCurrentView('landing')
  }

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingChoice onSelect={setCurrentView} />

      case 'jd-upload':
        return (
          <JDUploadFlow
            onComplete={handleEvaluationComplete}
            onBack={() => setCurrentView('landing')}
          />
        )

      case 'dropdown':
        return (
          <DropdownFlow
            onComplete={handleEvaluationComplete}
            onBack={() => setCurrentView('landing')}
          />
        )

      case 'submit':
        return (
          <SubmitCompFlow
            onComplete={handleSubmissionComplete}
            onBack={() => setCurrentView('landing')}
          />
        )

      case 'results':
        return (
          <ResultsView
            evaluation={evaluationData}
            onBack={() => setCurrentView('landing')}
            onSubmitData={() => setCurrentView('submit')}
          />
        )

      default:
        return <LandingChoice onSelect={setCurrentView} />
    }
  }

  return (
    <div className="app-container">
      <Header onNavigate={setCurrentView} currentView={currentView} />
      <main className="main-content">{renderView()}</main>
      <footer className="app-footer">
        <p>MyCryptoDevPay © 2025 · Open Source Compensation Framework · MIT License</p>
        <p className="footer-note">All data is aggregated and anonymized. Benchmarks are indicative only.</p>
      </footer>
    </div>
  )
}
