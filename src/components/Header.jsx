import React from 'react'

export default function Header({ onNavigate, currentView }) {
  const isFindSalary = ['landing', 'jd-upload', 'dropdown', 'results'].includes(currentView)

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo" onClick={() => onNavigate('landing')}>
          <div className="logo-mark">⬡</div>
          <span className="logo-text">MyCryptoDevPay</span>
        </div>

        <nav className="nav-links">
          <span
            className={`nav-link ${isFindSalary ? 'active' : ''}`}
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
          <a
            href="https://github.com/KerberusPrime/mycryptodevpay"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
          >
            GitHub ↗
          </a>
        </nav>
      </div>
    </header>
  )
}
