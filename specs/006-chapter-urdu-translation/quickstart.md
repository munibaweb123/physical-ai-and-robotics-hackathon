# Quickstart Guide: Chapter Urdu Translation

## Overview
This guide provides instructions for implementing Urdu translation functionality in chapter content. Users will be able to translate content to Urdu by clicking a button at the start of each chapter.

## Prerequisites
- Docusaurus project set up and running
- Access to translation API (Google Cloud Translation, AWS Translate, or similar)
- API credentials for translation service
- Node.js 18+ (for frontend)
- React knowledge for component development

## Setup Instructions

### 1. Environment Configuration
```bash
# In physical-ai-docs/.env
TRANSLATION_API_KEY=your_translation_api_key
TRANSLATION_API_ENDPOINT=https://translation-service-provider.com/api
TRANSLATION_PROVIDER=google|aws|azure  # Choose one
```

### 2. Install Required Dependencies
```bash
# In physical-ai-docs directory
npm install @google-cloud/translate  # For Google Cloud Translation
# OR
npm install aws-sdk  # For AWS Translate
# OR other translation service SDK
```

### 3. Component Structure Setup
```bash
# Create the necessary component directories
mkdir -p src/components/TranslationToggle
mkdir -p src/components/ChapterTranslator
mkdir -p src/services
```

## Implementation Process

### 1. Create Translation Service
Create a service that handles API communication with the translation provider:

```javascript
// src/services/translationService.ts
// Implementation for translation API calls
```

### 2. Develop Translation Components
Create React components for:
- Translation toggle button
- Translation loading states
- Content rendering with RTL support for Urdu

### 3. Integrate with Docusaurus
Add the translation components to chapter pages using Docusaurus' theme customization.

## Key Components for Translation

### Translation Management
- `TranslationToggle` - Button to initiate translation
- `ChapterTranslator` - Component that handles the translation process
- `translationService` - Service for API communication

### User Preference Management
- Store translation preferences in browser storage
- Maintain user's preferred language settings

## Development Workflow

### 1. Translation Service Implementation
Key files for translation implementation:
- `physical-ai-docs/src/services/translationService.ts` - Translation API integration
- `physical-ai-docs/src/components/TranslationToggle/index.tsx` - Translation toggle button
- `physical-ai-docs/src/components/ChapterTranslator/index.tsx` - Translation functionality
- `physical-ai-docs/src/theme/DocPage/index.tsx` - Integration with Docusaurus theme

### 2. Testing the Translation
```bash
# 1. Run development server
npm run start

# 2. Test translation functionality
# Navigate to any chapter and click the Urdu translation button

# 3. Verify RTL text rendering
# Check that Urdu content displays correctly with right-to-left text direction
```

### 3. Right-to-Left Text Configuration
- Configure CSS for RTL support
- Ensure proper text alignment and layout for Urdu content
- Test with various content types (headings, lists, code blocks)

## Common Tasks

### Adding Translation Button to Chapters
1. Update Docusaurus theme to include translation toggle
2. Ensure button appears at the start of each chapter
3. Handle translation state and content switching

### Managing Translation Preferences
1. Store user's language preference in browser storage
2. Apply preference across chapter navigation
3. Provide option to reset to original language

### Handling Translation Failures
1. Implement fallback content display
2. Show user-friendly error messages
3. Provide retry mechanism

## Post-Implementation Optimization
- Set up translation caching to improve performance
- Monitor translation API usage and costs
- Optimize content preservation during translation
- Add analytics for translation feature usage