import React, { useEffect, useMemo } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';
import TranslationToggle from '../TranslationToggle';
import '../../css/rtl.css'; // Import RTL styles

interface ChapterTranslatorProps {
  chapterId: string;
  children: React.ReactNode;
  defaultLanguage?: string; // default: 'en'
  targetLanguage?: string;  // default: 'ur'
}

const ChapterTranslator: React.FC<ChapterTranslatorProps> = ({
  chapterId,
  children,
  defaultLanguage = 'en',
  targetLanguage = 'ur'
}) => {
  const {
    isTranslated,
    translatedContent,
    originalContent,
    error,
    setError
  } = useTranslation();

  // Serialize React children to string for translation service
  const contentString = useMemo(() => {
    if (typeof children === 'string') {
      return children;
    } else if (React.isValidElement(children)) {
      // For this implementation, we'll convert the element to a simple string representation
      // In a real implementation, you might need a more sophisticated serialization method
      return JSON.stringify(children.props);
    } else if (Array.isArray(children)) {
      return children.map(child =>
        typeof child === 'string' ? child :
        React.isValidElement(child) ? JSON.stringify(child.props) :
        String(child)
      ).join(' ');
    }
    return String(children);
  }, [children]);

  // Function to render content based on translation state
  const renderContent = () => {
    if (error) {
      return (
        <div className="translation-error">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>Try Again</button>
        </div>
      );
    }

    if (isTranslated && translatedContent) {
      // Render translated content with RTL support
      return (
        <div className="urdu-content translated-content">
          <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
        </div>
      );
    }

    // Render original content
    return (
      <div className="original-content">
        {children}
      </div>
    );
  };

  return (
    <div className="chapter-translator">
      <div className="translation-controls">
        <TranslationToggle
          chapterId={chapterId}
          content={contentString}
          targetLanguage={targetLanguage}
        />
      </div>

      <div className="chapter-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ChapterTranslator;