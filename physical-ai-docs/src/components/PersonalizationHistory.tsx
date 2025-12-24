import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { getPersonalizationHistory } from '../services/personalization-service';

interface PersonalizationHistoryItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  personalizationActive: boolean;
  engagementMetrics: {
    timeSpent: number;
    scrollDepth: number;
    completions: number;
    helpRequests: number;
  };
  adaptationsCount: number;
  relevanceScore: number;
  personalizedAt: string;
  viewedAt: string;
}

interface PersonalizationHistoryProps {
  limit?: number;
  page?: number;
  className?: string;
}

const PersonalizationHistory: React.FC<PersonalizationHistoryProps> = ({
  limit = 10,
  page = 1,
  className = ''
}) => {
  const { session, user } = useAuth();
  const [history, setHistory] = useState<PersonalizationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    limit: limit
  });

  useEffect(() => {
    if (session) {
      loadHistory();
    }
  }, [session, page, limit]);

  const loadHistory = async () => {
    if (!session) return;

    try {
      setLoading(true);
      setError(null);

      const result = await getPersonalizationHistory(limit, page);

      if (result.success) {
        setHistory(result.history);
        setPagination({
          total: result.total,
          currentPage: result.page,
          limit: result.limit
        });
      } else {
        setError(result.error || 'Failed to load personalization history');
      }
    } catch (err: any) {
      console.error('Error loading personalization history:', err);
      setError(err.message || 'Failed to load personalization history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`personalization-history ${className}`}>
        <div className="loading">Loading personalization history...</div>
      </div>
    );
  }

  return (
    <div className={`personalization-history ${className}`}>
      <h3>Personalization History</h3>
      <p className="section-description">
        Track your personalization usage and engagement metrics across chapters.
      </p>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {history.length === 0 ? (
        <div className="no-history">
          No personalization history found. Start personalizing chapters to see your history here.
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item?.id || Math.random().toString()} className="history-item">
              <div className="item-header">
                <h4>{item?.chapterTitle || 'Unknown Chapter'}</h4>
                <span className={`status-badge ${item?.personalizationActive ? 'active' : 'inactive'}`}>
                  {item?.personalizationActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="item-details">
                <div className="metrics">
                  <div className="metric">
                    <span className="metric-label">Adaptations:</span>
                    <span className="metric-value">{item?.adaptationsCount || 0}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Relevance:</span>
                    <span className="metric-value">{item?.relevanceScore ? (item.relevanceScore * 100).toFixed(0) : '0'}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Time:</span>
                    <span className="metric-value">{item?.engagementMetrics?.timeSpent ? Math.round(item.engagementMetrics.timeSpent / 60) : 0} min</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Scroll:</span>
                    <span className="metric-value">{item?.engagementMetrics?.scrollDepth ? (item.engagementMetrics.scrollDepth * 100).toFixed(0) : '0'}%</span>
                  </div>
                </div>

                <div className="timestamps">
                  <div className="timestamp">
                    <span className="timestamp-label">Personalized:</span>
                    <span className="timestamp-value">{formatDate(item?.personalizedAt || new Date().toISOString())}</span>
                  </div>
                  <div className="timestamp">
                    <span className="timestamp-label">Viewed:</span>
                    <span className="timestamp-value">{formatDate(item?.viewedAt || new Date().toISOString())}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.total > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} - {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of {pagination.total} items
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setPagination(prev => ({...prev, currentPage: Math.max(1, prev.currentPage - 1)}))}
              disabled={pagination.currentPage <= 1}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="page-info">
              Page {pagination.currentPage} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <button
              onClick={() => setPagination(prev => ({...prev, currentPage: Math.min(Math.ceil(pagination.total / pagination.limit), prev.currentPage + 1)}))}
              disabled={pagination.currentPage >= Math.ceil(pagination.total / pagination.limit)}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <style>{`
        .personalization-history {
          max-width: 800px;
          margin: 1rem 0;
          padding: 1.5rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fafafa;
        }

        .section-description {
          margin-bottom: 1.5rem;
          color: #666;
        }

        .loading {
          padding: 1rem;
          text-align: center;
          color: #666;
        }

        .no-history {
          padding: 1rem;
          text-align: center;
          color: #888;
          font-style: italic;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .history-item {
          padding: 1rem;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          background-color: white;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .item-header h4 {
          margin: 0;
          font-size: 1.1rem;
          color: #333;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .status-badge.active {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .status-badge.inactive {
          background-color: #ffebee;
          color: #c62828;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .metric {
          display: flex;
          flex-direction: column;
          min-width: 80px;
        }

        .metric-label {
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .metric-value {
          font-weight: bold;
          color: #333;
        }

        .timestamps {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .timestamp {
          display: flex;
          flex-direction: column;
        }

        .timestamp-label {
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 0.25rem;
        }

        .timestamp-value {
          font-weight: normal;
          color: #555;
        }

        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .pagination-info {
          color: #666;
          font-size: 0.9rem;
        }

        .pagination-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pagination-button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          background-color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-button:hover:not(:disabled) {
          background-color: #f0f0f0;
        }

        .page-info {
          padding: 0 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .error-message {
          padding: 0.75rem;
          margin-bottom: 1rem;
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
        }
      `}</style>
    </div>
  );
};

export default PersonalizationHistory;