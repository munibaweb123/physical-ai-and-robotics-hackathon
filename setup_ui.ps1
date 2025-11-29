$files = @{
    "physical-ai-coursework/src/pages/index.tsx" = @'
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro/preamble">
            Start the Course
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Physical AI & Humanoid Robotics Course">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
'@
    "physical-ai-coursework/src/components/HomepageFeatures/index.tsx" = @'
import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'ROS 2 Nervous System',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        The fundamental middleware for robot control and inter-process communication.
        Learn Nodes, Topics, and Services.
      </>
    ),
  },
  {
    title: 'NVIDIA Isaac Sim',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Training in the matrix. Master the art of the Digital Twin with photorealistic
        simulation and synthetic data.
      </>
    ),
  },
  {
    title: 'Embodied AI',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Vision-Language-Action models. Bridge the gap between digital intelligence
        and physical actuation.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
'@
    "physical-ai-coursework/src/css/custom.css" = @'
:root {
  --ifm-color-primary: #00a8e8;
  --ifm-color-primary-dark: #0097d1;
  --ifm-color-primary-darker: #008fca;
  --ifm-color-primary-darkest: #0076a6;
  --ifm-color-primary-light: #1ab1eb;
  --ifm-color-primary-lighter: #27b5ed;
  --ifm-color-primary-lightest: #4fc4f2;
  --ifm-code-font-size: 95%;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.1);
}

[data-theme='dark'] {
  --ifm-color-primary: #00c3ff;
  --ifm-color-primary-dark: #00afff;
  --ifm-color-primary-darker: #00a5f2;
  --ifm-color-primary-darkest: #0088c7;
  --ifm-color-primary-light: #26cbff;
  --ifm-color-primary-lighter: #39cfff;
  --ifm-color-primary-lightest: #70dbff;
  --docusaurus-highlighted-code-line-bg: rgba(0, 0, 0, 0.3);
  --ifm-background-color: #0a0a12;
}
'@
}

foreach ($key in $files.Keys) {
    $files[$key] | Out-File -FilePath $key -Encoding utf8 -Force
}
