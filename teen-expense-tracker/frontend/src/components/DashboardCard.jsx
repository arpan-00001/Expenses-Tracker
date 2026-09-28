import './DashboardCard.css';

export default function DashboardCard({ icon, title, value, subtitle, color = 'primary', trend }) {
  return (
    <div className={`dashboard-card card-${color}`}>
      <div className="card-icon-wrap">
        <span className="card-icon">{icon}</span>
      </div>
      <div className="card-info">
        <span className="card-title">{title}</span>
        <span className="card-value">{value}</span>
        {subtitle && <span className="card-subtitle">{subtitle}</span>}
        {trend && (
          <span className={`card-trend ${trend.positive ? 'trend-up' : 'trend-down'}`}>
            {trend.positive ? '↑' : '↓'} {trend.text}
          </span>
        )}
      </div>
    </div>
  );
}
