import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { authBaseUrl } from '../lib/auth-client';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  level: string;
  tags: string[];
  relevanceScore: number;
  url: string;
}

interface PersonalizedContentProps {
  limit?: number;
  showPagination?: boolean;
}

const PersonalizedContent: React.FC<PersonalizedContentProps> = ({
  limit = 5,
  showPagination = false
}) => {
  const { session } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = limit;

  useEffect(() => {
    if (session?.user) {
      fetchPersonalizedContent();
    }
  }, [session, currentPage]);

  const fetchPersonalizedContent = async () => {
    if (!session?.accessToken) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${authBaseUrl}/api/content/personalized?limit=${itemsPerPage}&page=${currentPage}`,
        {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch personalized content');
      }

      const data = await response.json();
      setContent(data.content || []);
    } catch (err: any) {
      console.error('Error fetching personalized content:', err);
      setError(err.message || 'An error occurred while fetching content');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="personalized-content">
        <p>Please log in to see personalized content recommendations.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="personalized-content">
        <p>Loading personalized content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="personalized-content">
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="personalized-content">
      <h2>Recommended for You</h2>
      {content.length === 0 ? (
        <p>No personalized content recommendations available. Update your profile to get better recommendations.</p>
      ) : (
        <div className="content-grid">
          {content.map((item) => (
            <div key={item?.id || Math.random().toString()} className="content-card">
              <h3>
                <a href={item?.url || '#'}>{item?.title || 'Untitled'}</a>
              </h3>
              <p className="description">{item?.description || ''}</p>
              <div className="content-meta">
                <span className="level">Level: {item?.level || 'N/A'}</span>
                <span className="relevance">Relevance: {item?.relevanceScore ? (item.relevanceScore * 100).toFixed(0) : '0'}%</span>
              </div>
              <div className="tags">
                {(item?.tags || []).map((tag, index) => (
                  <span key={index} className="tag">
                    {tag || ''}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showPagination && content.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      <style>{`
        .personalized-content {
          margin: 2rem 0;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .content-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 1.5rem;
          background-color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .content-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .content-card h3 a {
          color: #007cba;
          text-decoration: none;
        }

        .content-card h3 a:hover {
          text-decoration: underline;
        }

        .description {
          color: #666;
          margin: 0.5rem 0;
        }

        .content-meta {
          display: flex;
          justify-content: space-between;
          margin: 0.75rem 0;
          font-size: 0.875rem;
          color: #777;
        }

        .tags {
          margin-top: 0.75rem;
        }

        .tag {
          display: inline-block;
          background-color: #f0f0f0;
          color: #333;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .error {
          color: #e74c3c;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .pagination button {
          padding: 0.5rem 1rem;
          border: 1px solid #ccc;
          background-color: #fff;
          cursor: pointer;
          border-radius: 4px;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination button:not(:disabled):hover {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default PersonalizedContent;