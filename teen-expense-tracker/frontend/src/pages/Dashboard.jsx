import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import analyticsService from '../services/analyticsService';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatCurrency, formatDate } from '../utils/helpers';
import './Dashboard.css';

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#14b8a6'];

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [summaryRes, categoryRes] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getCategoryBreakdown(),
      ]);
      setSummary(summaryRes.data);
      setCategoryData(categoryRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;
  if (error) return (
    <div className="error-state">
      <p>😕 {error}</p>
      <button className="btn btn-primary" onClick={fetchDashboard}>Try Again</button>
    </div>
  );

  const recentTransactions = summary?.recentTransactions || [];
  const pieData = (categoryData?.expenses || []).slice(0, 6).map((c) => ({
    name: c.name,
    value: c.amount,
  }));

  return (
    <div className="dashboard">
      <div className="page-title">
        <h1>Dashboard</h1>
        <Link to="/transactions" className="btn btn-primary btn-sm">+ Add Transaction</Link>
      </div>

      {/* Summary Cards */}
      <div className="cards-grid">
        <DashboardCard icon="💰" title="Balance" value={formatCurrency(summary?.balance || 0)} color="primary" />
        <DashboardCard icon="📈" title="Income this month" value={formatCurrency(summary?.monthlyIncome || 0)} color="success" />
        <DashboardCard icon="📉" title="Expenses this month" value={formatCurrency(summary?.monthlyExpenses || 0)} color="danger" />
        <DashboardCard icon="🎯" title="Budget remaining" value={formatCurrency(summary?.remainingBudget || 0)} color="warning" />
        <DashboardCard icon="🏆" title="Total saved" value={formatCurrency(summary?.totalSaved || 0)} color="purple" />
        <DashboardCard
          icon="📊"
          title="Savings rate"
          value={`${summary?.savingsRate || 0}%`}
          color="info"
          subtitle="of monthly income"
        />
      </div>

      <div className="dashboard-grid">
        {/* Category Pie Chart */}
        <div className="dashboard-section">
          <h2>Spending by Category</h2>
          {pieData.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {pieData.map((item, i) => (
                  <div className="legend-item" key={item.name}>
                    <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="legend-label">{item.name}</span>
                    <span className="legend-value">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState icon="📊" title="No expense data yet" message="Add expenses to see your spending breakdown" />
          )}
        </div>

        {/* Recent Transactions */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/transactions" className="link-sm">View all →</Link>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="recent-list">
              {recentTransactions.map((t) => (
                <div className="recent-item" key={t.id}>
                  <div className="recent-icon">{t.categories?.icon || '📦'}</div>
                  <div className="recent-info">
                    <span className="recent-desc">{t.description || t.categories?.name || 'Transaction'}</span>
                    <span className="recent-date">{formatDate(t.transaction_date)}</span>
                  </div>
                  <span className={`recent-amount ${t.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📝" title="No transactions yet" message="Start tracking by adding your first transaction" />
          )}
        </div>
      </div>
    </div>
  );
}
