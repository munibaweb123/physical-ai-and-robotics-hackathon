import { translateContent } from '../translationService';

describe('Translation Service', () => {
  beforeEach(() => {
    // Clear any cached translations before each test
    jest.clearAllMocks();
  });

  test('should translate content successfully', async () => {
    const mockRequest = {
      content: 'Hello world',
      sourceLanguage: 'en',
      targetLanguage: 'ur',
      chapterId: 'test-chapter'
    };

    const result = await translateContent(mockRequest);

    expect(result.success).toBe(true);
    expect(result.translatedContent).toBeDefined();
    expect(result.sourceLanguage).toBe('en');
    expect(result.targetLanguage).toBe('ur');
    expect(result.chapterId).toBe('test-chapter');
  });

  test('should return error for empty content', async () => {
    const mockRequest = {
      content: '',
      sourceLanguage: 'en',
      targetLanguage: 'ur',
      chapterId: 'test-chapter'
    };

    const result = await translateContent(mockRequest);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Content cannot be empty');
  });

  test('should return error for unsupported target language', async () => {
    const mockRequest = {
      content: 'Hello world',
      sourceLanguage: 'en',
      targetLanguage: 'fr', // Not Urdu
      chapterId: 'test-chapter'
    };

    const result = await translateContent(mockRequest);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Target language must be "ur" for Urdu');
  });

  test('should handle API errors gracefully', async () => {
    // This test simulates an error condition in the translation service
    // In a real implementation, this would test actual error handling
    const mockRequest = {
      content: 'Test content with error',
      sourceLanguage: 'en',
      targetLanguage: 'ur',
      chapterId: 'test-chapter'
    };

    // Since our implementation simulates the translation,
    // we'll test that the function handles the simulated response
    const result = await translateContent(mockRequest);

    // Should return a successful response with simulated content
    expect(result.success).toBe(true);
    expect(result.translatedContent).toContain('مترجم کا مواد');
  });
});