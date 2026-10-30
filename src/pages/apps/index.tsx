import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import styles from './styles.module.css';
import AppNavbar from './_components/AppNavbar';
import {apps} from '@site/src/data/apps';

const TITLE = '产品';
const DESCRIPTION = '以下产品均由本人独立开发。';

function AppCard({app}: {app: (typeof apps)[number]}) {
  return (
    <div className={clsx('card shadow--md', styles.appCard)}>
      <Link to={`/apps/${app.slug}`} className={styles.appCardHeader}>
        <img src={app.icon} alt={`${app.name} 图标`} className={styles.appIcon} />
        <div>
          <h3 className={styles.appName}>{app.name}</h3>
          <p className={styles.tagline}>{app.tagline}</p>
        </div>
      </Link>
      <p className={styles.description}>{app.description}</p>
      <div className={styles.links}>
        <Link to={`/apps/${app.slug}/privacy`}>隐私政策</Link>
        <Link to={`/apps/${app.slug}/support`}>支持与反馈</Link>
      </div>
    </div>
  );
}

export default function AppsIndex(): React.JSX.Element {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <AppNavbar />
      <main className={styles.pageMain}>
        <div className="container margin-vert--lg">
        <section className="margin-top--lg margin-bottom--lg text--center">
          <h1>{TITLE}</h1>
          <p>{DESCRIPTION}</p>
        </section>
        <div className={styles.appGrid}>
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
        </div>
      </main>
    </Layout>
  );
}
