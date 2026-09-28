import './ProgressBar.css';

export default function ProgressBar({ value, max = 100, color, showLabel = true, size = 'medium' }) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  let barColor = color;
  if (!barColor) {
    if (percentage >= 100) barColor = 'danger';
    else if (percentage >= 75) barColor = 'warning';
    else if (percentage >= 50) barColor = 'info';
    else barColor = 'success';
  }

  return (
    <div className={`progress-container progress-${size}`}>
      <div className="progress-bar-track">
        <div
          className={`progress-bar-fill bar-${barColor}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className={`progress-label label-${barColor}`}>
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
}
