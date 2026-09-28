import { useState, useEffect } from 'react';
import analyticsService from '../services/analyticsService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './Recommendations.css';

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRecommendations(); }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await analyticsService.getRecommendations();
      setRecommendations(res.data?.recommendations || []);
    } catch {
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Analyzing your spending..." />;

  return (
    <div className="recommendations-page">
      <div className="page-title">
        <h1>💡 Smart Insights</h1>
      </div>

      <p className="rec-intro">
        Personalized suggestions based on your actual spending data. These insights help you make smarter money decisions.
      </p>

      {recommendations.length === 0 ? (
        <EmptyState
          icon="💡"
          title="No insights yet"
          message="Add more transactions and set some budgets to get personalized spending insights!"
        />
      ) : (
        <div className="rec-list">
          {recommendations.map((rec, i) => (
            <div className={`rec-card priority-${rec.priority}`} key={i}>
              <div className="rec-icon">{rec.icon}</div>
              <div className="rec-content">
                <h3>{rec.title}</h3>
                <p>{rec.message}</p>
                <span className={`rec-priority badge-${rec.priority}`}>
                  {rec.priority === 'high' ? '🔴 High priority' : rec.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
