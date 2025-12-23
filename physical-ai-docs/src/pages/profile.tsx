import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { useAuth } from '../lib/AuthContext';
import BackgroundInfoEditForm from '../components/BackgroundInfoEditForm';
import PersonalizationHistory from '../components/PersonalizationHistory';
import { fetchBackgroundInfo, fetchPersonalizedContent } from '../services/background-service';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface BackgroundInfo {
  softwareExperienceLevel?: string;
  hardwareExperienceLevel?: string;
  preferredDevelopmentEnvironments?: string[];
  technicalSkills?: string[];
  hardwareSpecs?: string;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  level: string;
  tags: string[];
  relevanceScore: number;
  url: string;
}

function ProfilePage() {
  const { session, user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [backgroundInfo, setBackgroundInfo] = useState<BackgroundInfo | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session && user) {
      loadProfileData();
    }
  }, [session, user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Set basic user profile
      setUserProfile({
        id: user?.id || '',
        email: user?.email || '',
        name: user?.name || '',
        image: user?.image || ''
      });

      // Fetch background information
      const bgResponse = await fetchBackgroundInfo();
      if (bgResponse.success) {
        setBackgroundInfo({
          softwareExperienceLevel: bgResponse.softwareExperienceLevel,
          hardwareExperienceLevel: bgResponse.hardwareExperienceLevel,
          preferredDevelopmentEnvironments: bgResponse.preferredDevelopmentEnvironments,
          technicalSkills: bgResponse.technicalSkills,
          hardwareSpecs: bgResponse.hardwareSpecs
        });
      } else {
        console.warn('Could not fetch background info:', bgResponse.error);
        setBackgroundInfo({});
      }

      // Fetch personalized content
      const contentResponse = await fetchPersonalizedContent(5, 1);
      if (contentResponse.success) {
        setPersonalizedContent(contentResponse.content);
      } else {
        console.warn('Could not fetch personalized content:', contentResponse.error);
        setPersonalizedContent([]);
      }
    } catch (err: any) {
      console.error('Error loading profile data:', err);
      setError(err.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundUpdate = (updatedInfo: BackgroundInfo) => {
    setBackgroundInfo(updatedInfo);
    // Optionally reload personalized content after update
    loadProfileData();
  };

  if (!session) {
    return (
      <Layout title="Profile" description="User profile page">
        <main className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Profile</h1>
              <p>Please log in to view your profile.</p>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout title="Profile" description="User profile page">
        <main className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Loading Profile...</h1>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Profile" description="User profile page">
        <main className="container margin-vert--lg">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <h1>Profile Error</h1>
              <p>Error: {error}</p>
            </div>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Profile" description="User profile page">
      <main className="container margin-vert--lg">
        <div className="row">
          <div className="col col--8 col--offset-2">
            <h1>User Profile</h1>

            <div className="profile-section">
              <h2>Account Information</h2>
              <div className="profile-info">
                <p><strong>Name:</strong> {userProfile?.name || 'Not provided'}</p>
                <p><strong>Email:</strong> {userProfile?.email}</p>
              </div>
            </div>

            <div className="profile-section">
              <h2>Background Information</h2>
              {backgroundInfo ? (
                <BackgroundInfoEditForm
                  initialData={backgroundInfo}
                  onUpdate={handleBackgroundUpdate}
                />
              ) : (
                <BackgroundInfoEditForm
                  initialData={{}}
                  onUpdate={handleBackgroundUpdate}
                />
              )}
            </div>

            {personalizedContent.length > 0 && (
              <div className="profile-section">
                <h2>Recommended Content Based on Your Profile</h2>
                <div className="content-recommendations">
                  {personalizedContent.map((item) => (
                    <div key={item?.id || Math.random().toString()} className="content-item">
                      <h3>
                        <a href={item?.url || '#'}>{item?.title || 'Untitled'}</a>
                      </h3>
                      <p>{item?.description || ''}</p>
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
              </div>
            )}

            <div className="profile-section">
              <h2>Personalization History</h2>
              <PersonalizationHistory />
            </div>
          </div>
        </div>

        <style>{`
          .profile-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
          }

          .profile-info {
            margin: 1rem 0;
          }

          .profile-info p {
            margin: 0.5rem 0;
          }

          .content-recommendations {
            margin-top: 1rem;
          }

          .content-item {
            border-bottom: 1px solid #eee;
            padding: 1rem 0;
          }

          .content-item:last-child {
            border-bottom: none;
          }

          .content-meta {
            display: flex;
            justify-content: space-between;
            margin: 0.5rem 0;
            font-size: 0.875rem;
            color: #666;
          }

          .tags {
            margin-top: 0.5rem;
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
        `}</style>
      </main>
    </Layout>
  );
}

export default ProfilePage;