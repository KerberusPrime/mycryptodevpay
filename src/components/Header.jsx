import React, { useState } from 'react'

const NAV_ITEMS = [
  { id: 'landing',      label: 'Find Salary',    match: ['landing', 'jd-upload', 'dropdown', 'results'] },
  { id: 'offer-check',  label: 'Check Offer',    match: ['offer-check'] },
  { id: 'token-calc',   label: 'Token Calc',     match: ['token-calc'] },
  { id: 'methodology',  label: 'Methodology',    match: ['methodology'] },
  { id: 'faq',          label: 'FAQ',             match: ['faq'] },
  { id: 'submit',       label: 'Submit Data',    match: ['submit'] },
]

export default function Header({ onNavigate, currentView }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (item) => item.match.includes(currentView)

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="logo" onClick={() => { onNavigate('landing'); setMenuOpen(false) }}>
            <div className="logo-mark">⬡</div>
            <span className="logo-text">MyCryptoDevPay</span>
          </div>

          {/* Desktop nav */}
          <nav className="nav-links">
            {NAV_ITEMS.map(item => (
              <span
                key={item.id}
                className={`nav-link ${isActive(item) ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </span>
            ))}
            <a
              href="https://github.com/KerberusPrime/mycryptodevpay"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
            >
              GitHub ↗
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-nav">
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`mobile-nav-item ${isActive(item) ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); setMenuOpen(false) }}
            >
              {item.label}
            </div>
          ))}
          <a
            href="https://github.com/KerberusPrime/mycryptodevpay"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-nav-item"
            style={{ textDecoration: 'none' }}
          >
            GitHub ↗
          </a>
        </div>
      )}
    </>
  )
}
