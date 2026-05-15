import PropTypes from 'prop-types'
import './dashboard.css'

export default function XPBar({ current, max }) {
  const safeMax = max > 0 ? max : 1
  const safeCurrent = Math.min(Math.max(current, 0), safeMax)
  const percentage = (safeCurrent / safeMax) * 100

  return (
    <div className="dashboard-xp">
      <div className="dashboard-xp__meta">
        <span>XP</span>
        <strong>
          {safeCurrent}/{safeMax}
        </strong>
      </div>
      <div className="dashboard-xp__track" aria-hidden="true">
        <div className="dashboard-xp__fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

XPBar.propTypes = {
  current: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
}