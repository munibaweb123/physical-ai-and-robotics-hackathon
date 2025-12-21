import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TranslationToggle from '../index';

// Mock the translation context
jest.mock('../../../contexts/TranslationContext', () => ({
  useTranslation: () => ({
    isTranslated: false,
    isTranslating: false,
    translatedContent: null,
    originalContent: null,
    translateChapter: jest.fn(),
    toggleTranslation: jest.fn(),
    setError: jest.fn(),
    error: null
  })
}));

// Mock the translation service
jest.mock('../../../services/translationService', () => ({
  translateContent: jest.fn(() => Promise.resolve({
    success: true,
    translatedContent: 'مترجم کا مواد',
    sourceLanguage: 'en',
    targetLanguage: 'ur',
    chapterId: 'test-chapter',
    translationQuality: 95,
    translatedAt: new Date().toISOString()
  }))
}));

describe('TranslationToggle Component', () => {
  const defaultProps = {
    chapterId: 'test-chapter',
    content: 'Hello, this is test content',
    sourceLanguage: 'en',
    targetLanguage: 'ur',
    onTranslationStart: jest.fn(),
    onTranslationComplete: jest.fn(),
    onTranslationError: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders translation toggle button', () => {
    render(<TranslationToggle {...defaultProps} />);

    const button = screen.getByRole('button', { name: /translate content to urdu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Translate to Urdu');
  });

  test('button text changes when translating', () => {
    // Since we're mocking the context, we need to update the mock for this test
    jest.mock('../../../contexts/TranslationContext', () => ({
      useTranslation: () => ({
        isTranslated: false,
        isTranslating: true,
        translatedContent: null,
        originalContent: null,
        translateChapter: jest.fn(),
        toggleTranslation: jest.fn(),
        setError: jest.fn(),
        error: null
      })
    }), { virtual: true });

    // Re-import to pick up the updated mock
    const { default: TranslationToggleMock } = require('../index');
    render(<TranslationToggleMock {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Translating...');
  });

  test('calls translateChapter when button is clicked', async () => {
    const translateChapterMock = jest.fn(() => Promise.resolve());

    jest.mock('../../../contexts/TranslationContext', () => ({
      useTranslation: () => ({
        isTranslated: false,
        isTranslating: false,
        translatedContent: null,
        originalContent: null,
        translateChapter: translateChapterMock,
        toggleTranslation: jest.fn(),
        setError: jest.fn(),
        error: null
      })
    }), { virtual: true });

    const { default: TranslationToggleMock } = require('../index');
    render(<TranslationToggleMock {...defaultProps} />);

    const button = screen.getByRole('button', { name: /translate content to urdu/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(translateChapterMock).toHaveBeenCalledWith(
        'Hello, this is test content',
        'test-chapter'
      );
    });
  });

  test('shows retry button when there is an error', () => {
    // Mock context with error state
    jest.mock('../../../contexts/TranslationContext', () => ({
      useTranslation: () => ({
        isTranslated: false,
        isTranslating: false,
        translatedContent: null,
        originalContent: null,
        translateChapter: jest.fn(),
        toggleTranslation: jest.fn(),
        setError: jest.fn(),
        error: 'Translation failed'
      })
    }), { virtual: true });

    const { default: TranslationToggleMock } = require('../index');
    render(<TranslationToggleMock {...defaultProps} />);

    const errorElement = screen.getByText(/translation failed/i);
    expect(errorElement).toBeInTheDocument();

    const retryButton = screen.getByRole('button', { name: /retry translation/i });
    expect(retryButton).toBeInTheDocument();
  });
});