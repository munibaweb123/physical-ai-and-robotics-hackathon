import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={clsx('hero__subtitle', styles.heroDescription)}>
          Explore the fascinating convergence of digital intelligence and physical embodiment. This course provides a comprehensive curriculum for mastering humanoid robotics, from foundational mechanics to advanced cognitive AI.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/foundations/era-of-physical-ai">
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageMainContent() {
  return (
    <section className={clsx('margin-bottom--xl', styles.homepageSection)}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h2" className={styles.sectionTitle}>
              Unleash the Future of Robotics
            </Heading>
            <p className={styles.sectionDescription}>
              Dive deep into the core principles of Physical AI, learning to build intelligent agents that can perceive, understand, and interact with the physical world. Our curriculum covers everything from ROS 2 fundamentals and advanced simulation techniques to NVIDIA Isaac platform integration and cognitive planning with large language models.
            </p>
            <p className={styles.sectionDescription}>
              Whether you're a seasoned developer or new to robotics, this platform offers a structured path to becoming an expert in embodied intelligence. Prepare to transform abstract AI concepts into functional, autonomous humanoid systems.
            </p>
            <Link
              className="button button--primary button--lg"
              to="/docs/foundations/era-of-physical-ai">
              Explore Chapters
            </Link>
          </div>
          <div className="col col--6 text--center">
            <img src="/physical-ai-and-robotics-hackathon/img/robot-hand-ai.png" alt="Robot hand and AI visual" className={styles.sectionImage} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="The official documentation site for the Physical AI & Humanoid Robotics course.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageMainContent />
      </main>
    </Layout>
  );
}