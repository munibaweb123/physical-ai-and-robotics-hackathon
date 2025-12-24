import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {useWindowSize} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocItemPaginator from '@theme/DocItem/Paginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocItemFooter from '@theme/DocItem/Footer';
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile';
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop';
import DocItemContent from '@theme/DocItem/Content';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import ContentVisibility from '@theme/ContentVisibility';
import type {Props} from '@theme/DocItem/Layout';

import PersonalizationToggle from '@site/src/components/PersonalizationToggle';
import PersonalizedChapterContent from '@site/src/components/PersonalizedChapterContent';
import ChapterTranslator from '@site/src/components/ChapterTranslator';

import styles from './styles.module.css';

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const {frontMatter, toc} = useDoc();
  const windowSize = useWindowSize();

  const hidden = frontMatter.hide_table_of_contents;
  const canRender = !hidden && toc.length > 0;

  const mobile = canRender ? <DocItemTOCMobile /> : undefined;

  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined;

  return {
    hidden,
    mobile,
    desktop,
  };
}

export default function DocItemLayout({children}: Props): ReactNode {
  const docTOC = useDocTOC();
  const {metadata, frontMatter} = useDoc();

  // Remove leading slash from slug/permalink to match backend API expectations
  const rawChapterId = metadata.slug || metadata.permalink || 'unknown';
  const chapterId = rawChapterId.startsWith('/') ? rawChapterId.substring(1) : rawChapterId;
  const showPersonalization = (frontMatter as any).showPersonalization !== false;

  return (
    <div className="row">
      <div className={clsx('col', !docTOC.hidden && styles.docItemCol)}>
        <ContentVisibility metadata={metadata} />
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />

            <div className="doc-item-controls" style={{
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: 'var(--ifm-color-emphasis-100)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {showPersonalization && (
                <PersonalizationToggle chapterId={chapterId} />
              )}
            </div>

            {docTOC.mobile}

            {/* Wrap content with ChapterTranslator and PersonalizedChapterContent */}
            <ChapterTranslator chapterId={chapterId}>
              <PersonalizedChapterContent chapterId={chapterId}>
                <DocItemContent>{children}</DocItemContent>
              </PersonalizedChapterContent>
            </ChapterTranslator>

            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      {docTOC.desktop && <div className="col col--3">{docTOC.desktop}</div>}
    </div>
  );
}
