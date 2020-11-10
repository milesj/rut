import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

interface FeatureProps {
  title: string;
  description: React.ReactNode;
  imageUrl?: string;
}

const features: FeatureProps[][] = [
  [
    {
      title: '♻️ Pattern based testing',
      description: (
        <>
          Encourages the Arrange-Act-Assert testing pattern for a clear separation of concerns, to
          clarify attention and intent, and make assertions much more readable and obvious.
        </>
      ),
    },
    {
      title: '🔋 Side-effects aware',
      description: (
        <>
          Testing React components and their side-effects can be tricky, but with Rut and its
          async-first and side-effect aware implementation, it becomes a breeze.
        </>
      ),
    },
    {
      title: '🧩 Custom renders',
      description: (
        <>
          Whether you target the DOM or Native, Rut supports any type of React renderer through a
          pluggable and type-safe abstraction layer.
        </>
      ),
    },
  ],
];

function Feature({ imageUrl, title, description }: FeatureProps) {
  const imgUrl = useBaseUrl(imageUrl);

  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title="React testing made easy." description={siteConfig.tagline}>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--secondary button--lg', styles.getStarted)}
              to={useBaseUrl('docs/')}
            >
              Get started
            </Link>

            <iframe
              src="https://ghbtns.com/github-btn.html?user=milesj&repo=rut&type=star&count=true&size=large"
              frameBorder="0"
              scrolling="0"
              title="GitHub"
            ></iframe>
          </div>
        </div>
      </header>

      <main>
        {features.map((items, i) => (
          <section key={i} className={styles.features}>
            <div className="container">
              <div className="row">
                {items.map((props, x) => (
                  <Feature key={x} {...props} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </main>
    </Layout>
  );
}
