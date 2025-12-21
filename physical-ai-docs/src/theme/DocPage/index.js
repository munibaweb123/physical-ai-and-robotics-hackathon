import React from 'react';
import {useDoc} from '@docusaurus/theme-common/internal';
import DocPage from '@theme-original/DocPage';
import PersonalizationToggle from '../components/PersonalizationToggle';
import ChapterTranslator from '../../components/ChapterTranslator';

// Get the chapter ID from the document's metadata or path
const getChapterId = (doc) => {
  // Use the document's slug as the chapter ID
  // Or extract from the document's metadata if available
  return doc.metadata.slug || doc.metadata.permalink || 'unknown';
};

export default function DocPageWrapper(props) {
  const {content: DocContent} = props;
  const {metadata} = DocContent;

  // Only show personalization toggle for docs, not for other pages
  const showPersonalization = metadata.frontMatter.showPersonalization !== false;

  // Only show translation toggle for docs, not for other pages
  const showTranslation = metadata.frontMatter.showTranslation !== false;

  // Extract chapter ID from document metadata
  const chapterId = getChapterId({ metadata });

  return (
    <>
      <DocPage {...props} />
      <div className="doc-page-extensions">
        {showTranslation && (
          <div className="translation-toggle-container" style={{
            marginTop: '1rem',
            marginBottom: '1.5rem',
            padding: '0.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            border: '1px solid #dee2e6'
          }}>
            <ChapterTranslator
              chapterId={chapterId}
            >
              {/* Pass the main content as children for translation */}
              {DocContent()}
            </ChapterTranslator>
          </div>
        )}
        {showPersonalization && (
          <div className="personalization-toggle-container" style={{
            marginTop: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <PersonalizationToggle
              chapterId={chapterId}
              onToggle={(active) => {
                // Optional: Handle toggle state changes
                console.log(`Personalization ${active ? 'activated' : 'deactivated'} for chapter: ${chapterId}`);
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}