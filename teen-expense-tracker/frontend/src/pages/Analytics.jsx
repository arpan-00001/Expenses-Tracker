import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import analyticsService from '../services/analyticsService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatCurrency } from '../utils/helpers';
import './Analytics.css';

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#14b8a6'];

const tooltipStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '10px',
  fontSize: '0.85rem',
};

export default function Analytics() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [monthlyRes, catRes, trendRes] = await Promise.all([
        analyticsService.getMonthlyData(6),
        analyticsService.getCategoryBreakdown(),
        analyticsService.getTrends(30),
      ]);
      setMonthlyData(monthlyRes.data?.monthly || []);
      setCategoryData(catRes.data);
      setTrends(trendRes.data?.trends || []);
    } catch {
      // Silent fail, show empty states
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Crunching your numbers..." />;

  const pieData = (categoryData?.expenses || []).slice(0, 8).map((c) => ({
    name: c.name,
    value: c.amount,
    percentage: c.percentage,
  }));

  return (
    <div className="analytics-page">
      <div className="page-title">
        <h1>Analytics</h1>
      </div>

      <div className="analytics-grid">
        {/* Income vs Expenses */}
        <div className="chart-section">
          <h2>Income vs Expenses</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon="📊" title="No monthly data" message="Start adding transactions to see your monthly trends" />
          )}
        </div>

        {/* Category Breakdown */}
        <div className="chart-section">
          <h2>Spending by Category</h2>
          {pieData.length > 0 ? (
            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-legend-vertical">
                {pieData.map((item, i) => (
                  <div className="legend-row" key={item.name}>
                    <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="legend-name">{item.name}</span>
                    <span className="legend-pct">{item.percentage}%</span>
                    <span className="legend-amt">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState icon="🥧" title="No expense data" message="Add expenses to see category breakdown" />
          )}
        </div>

        {/* Spending Trend */}
        <div className="chart-section chart-wide">
          <h2>Daily Spending Trend (Last 30 Days)</h2>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} tickFormatter={(d) => d.slice(5)} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={2} dot={false} name="Spending" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon="📈" title="No trend data" message="Spend for a few days to see your spending trend" />
          )}
        </div>

        {/* Monthly Savings */}
        <div className="chart-section chart-wide">
          <h2>Monthly Savings</h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={tooltipStyle} />
                <Bar dataKey="savings" fill="#8b5cf6" name="Savings" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon="💜" title="No savings data" message="Keep tracking to see monthly savings" />
          )}
        </div>
      </div>
    </div>
  );
}
