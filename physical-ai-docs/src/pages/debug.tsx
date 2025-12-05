import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function DebugPage() {
  const { siteConfig } = useDocusaurusContext();
  const customFields = siteConfig.customFields || {};

  return (
    <Layout title="Deployment Debug" description="Debug deployment configuration">
      <div style={{ padding: '2rem' }}>
        <h1>Deployment Configuration Debugger</h1>
        <p>Please share a screenshot of this page if you are facing issues.</p>
        
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', background: '#f9f9f9', color: '#000' }}>
          <h3>Environment Variables (Client-Side)</h3>
          <ul>
            <li><strong>Auth Server URL (authBaseUrl):</strong> {customFields.authBaseUrl as string || 'UNDEFINED'}</li>
            <li><strong>Chat Backend URL (apiBaseUrl):</strong> {customFields.apiBaseUrl as string || 'UNDEFINED'}</li>
            <li><strong>Site URL:</strong> {siteConfig.url}</li>
            <li><strong>Base URL:</strong> {siteConfig.baseUrl}</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
            <h3>Troubleshooting Checklist</h3>
            <ol>
                <li>If <strong>Auth Server URL</strong> is showing <code>localhost</code> or is empty, your Vercel Environment Variables are not set or you didn't redeploy.</li>
                <li>If it looks correct, copy the <strong>Auth Server URL</strong> and open it in a new tab adding <code>/api/auth/health</code> (e.g., <code>https://.../api/auth/health</code>). You should see <code>{ "status": "ok" }</code>.</li>
            </ol>
        </div>
      </div>
    </Layout>
  );
}
