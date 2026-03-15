import React from 'react'

export default function Header({ onNavigate, currentView }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo" onClick={() => onNavigate('landing')}>
          <span>💰</span>
          <span>MyCryptoDevPay</span>
        </div>
        <nav className="nav-links">
          <span
            className={`nav-link ${currentView === 'landing' || currentView === 'jd-upload' || currentView === 'dropdown' || currentView === 'results' ? 'active' : ''}`}
            onClick={() => onNavigate('landing')}
          >
            Find Salary
          </span>
          <span
            className={`nav-link ${currentView === 'submit' ? 'active' : ''}`}
            onClick={() => onNavigate('submit')}
          >
            Submit Data
          </span>
        </nav>
      </div>
    </header>
  )
}
