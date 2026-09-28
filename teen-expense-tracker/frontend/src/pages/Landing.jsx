import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">
          <span>💰</span>
          <span className="landing-logo-text">TeenTrack</span>
        </div>
        <div className="landing-nav-links">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Sign up free</Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Smart money management for teens</div>
          <h1>Take control of your<br /><span className="gradient-text">money like a pro</span></h1>
          <p className="hero-desc">
            Track your income and expenses, set budgets, save for goals,
            and get smart insights — all in one beautifully simple app.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Get Started — It's Free</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">I have an account</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card hero-card-1">
            <span className="hc-icon">💰</span>
            <div>
              <span className="hc-label">Balance</span>
              <span className="hc-value">₹8,450</span>
            </div>
          </div>
          <div className="hero-card hero-card-2">
            <span className="hc-icon">📊</span>
            <div>
              <span className="hc-label">Savings Goal</span>
              <span className="hc-value">75% done</span>
            </div>
          </div>
          <div className="hero-card hero-card-3">
            <span className="hc-icon">🎯</span>
            <div>
              <span className="hc-label">Budget Left</span>
              <span className="hc-value">₹3,200</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Everything you need to <span className="gradient-text">manage your money</span></h2>
        <div className="features-grid">
          {[
            { icon: '📝', title: 'Track Expenses', desc: 'Log every rupee you spend with categories, dates, and payment methods.' },
            { icon: '📊', title: 'Visual Analytics', desc: 'Beautiful charts showing where your money goes each month.' },
            { icon: '🎯', title: 'Set Budgets', desc: 'Create monthly budgets for each category and track your progress.' },
            { icon: '🏆', title: 'Savings Goals', desc: 'Save for headphones, games, trips — anything you want!' },
            { icon: '💡', title: 'Smart Insights', desc: 'Get personalized tips to help you spend smarter.' },
            { icon: '🔒', title: 'Private & Secure', desc: 'Your financial data is encrypted and only visible to you.' },
          ].map((f) => (
            <div className="feature-card" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>Made with ❤️ for teenagers who want to be smart with money</p>
        <p className="footer-sub">TeenTrack © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
