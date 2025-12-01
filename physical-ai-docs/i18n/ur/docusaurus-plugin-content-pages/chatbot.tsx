import React from 'react';
import Layout from '@theme/Layout';
import Chatbot from '@site/src/components/Chatbot';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function ChatbotPage() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`AI Assistant | ${siteConfig.title}`}
      description="Interactive AI Assistant for Physical AI Course">
      <main>
        <div className="container margin-vert--lg">
          <div className="text--center margin-bottom--lg">
            <h1>AI Course Assistant</h1>
            <p>Ask questions about the course material, ROS 2, or simulation setups.</p>
          </div>
          <Chatbot />
        </div>
      </main>
    </Layout>
  );
}