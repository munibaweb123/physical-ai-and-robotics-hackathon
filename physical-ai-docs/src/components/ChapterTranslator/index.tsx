import React, { useEffect, useState, useRef } from 'react';
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
    error,
    setError
  } = useTranslation();

  const contentRef = useRef<HTMLDivElement>(null);
  const [extractedContent, setExtractedContent] = useState<string>("");

  // Extract text content from the DOM after render
  useEffect(() => {
    if (contentRef.current) {
      // Get the text content from the rendered DOM nodes
      // We use innerText to preserve some formatting (newlines)
      // or innerHTML if we want to preserve tags (but translation API might strictly need text)
      // For now, let's try innerText for a cleaner translation input
      const text = contentRef.current.innerText;
      if (text && text.trim().length > 0) {
        console.log(`Extracted text via DOM (len=${text.length}):`, text.substring(0, 50) + "...");
        setExtractedContent(text);
      }
    }
  }, [children, isTranslated]); // Re-extract if children change

  // Function to render content based on translation state
  const renderContent = () => {
    if (error) {
      return (
        <div className="translation-error">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>Try Again</button>
          <div className="original-content-fallback">
             {/* Show original content even on error so page isn't broken */}
             {children}
          </div>
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
    // We wrap it in a ref to extract text ONLY when not translated
    // Use a conditional ref to ensure we don't hold onto nodes React wants to remove
    return (
      <div className="original-content" ref={contentRef}>
        {children}
      </div>
    );
  };

  return (
    <div className="chapter-translator">
      <div className="translation-controls">
        <TranslationToggle
          chapterId={chapterId}
          content={extractedContent} // Pass the extracted DOM text
          targetLanguage={targetLanguage}
        />
      </div>

      <div className="chapter-content">
        {/* We use a key based on isTranslated to force a clean re-render of the container */}
        <div key={isTranslated ? 'translated' : 'original'}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ChapterTranslator;