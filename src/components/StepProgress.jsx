import React from 'react'

/**
 * StepProgress — numbered step indicator for multi-step flows.
 *
 * steps: [{ label: string }]
 * current: 1-based current step number
 */
export default function StepProgress({ steps, current }) {
  return (
    <div className="step-progress">
      {steps.map((step, idx) => {
        const num    = idx + 1
        const status = num < current ? 'done' : num === current ? 'active' : 'upcoming'

        return (
          <React.Fragment key={num}>
            <div className="step-item">
              <div className={`step-dot ${status}`}>
                {status === 'done' ? '✓' : num}
              </div>
              <span className={`step-label ${status}`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`step-connector ${status === 'done' ? 'done' : ''}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
