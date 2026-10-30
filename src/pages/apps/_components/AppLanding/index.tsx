import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import styles from './styles.module.css';
import AppNavbar from '../AppNavbar';
import type {AppMeta} from '@site/src/data/apps';

function StoreButtons({stores}: {stores: AppMeta['stores']}) {
  const buttons = [
    stores.appStore && {href: stores.appStore, label: '📱 App Store 下载'},
    stores.googlePlay && {href: stores.googlePlay, label: '▶️ Google Play 下载'},
  ].filter(Boolean) as {href: string; label: string}[];

  if (buttons.length === 0) {
    return <p className={styles.comingSoon}>🚀 即将上线，敬请期待</p>;
  }

  return (
    <div className={styles.storeButtons}>
      {buttons.map((button) => (
        <a
          key={button.label}
          className="button button--primary button--lg"
          href={button.href}
          target="_blank"
          rel="noreferrer">
          {button.label}
        </a>
      ))}
    </div>
  );
}

export default function AppLanding({app}: {app: AppMeta}) {
  return (
    <Layout title={app.name} description={app.tagline}>
      <AppNavbar app={app} />
      <main className={styles.pageMain}>
        <header
          className={styles.hero}
          style={{'--app-accent': app.accentColor} as React.CSSProperties}>
          <div className="container text--center">
            <img className={styles.appIcon} src={app.icon} alt={`${app.name} 图标`} />
            <h1 className={styles.appName}>{app.name}</h1>
            <p className={styles.tagline}>{app.tagline}</p>
            <p className={styles.description}>{app.description}</p>
            <StoreButtons stores={app.stores} />
          </div>
        </header>

        <section className={clsx('container', styles.features)}>
          <h2 className="text--center">主要功能</h2>
          <div className={styles.featureGrid}>
            {app.features.map((feature) => (
              <div key={feature.title} className={clsx('card shadow--md', styles.featureCard)}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className={styles.appFooter}>
          <div className="container text--center">
            <nav className={styles.footerLinks}>
              <Link to={`/apps/${app.slug}/privacy`}>隐私政策</Link>
              <Link to={`/apps/${app.slug}/support`}>支持与反馈</Link>
              <Link to="/apps">全部产品</Link>
            </nav>
            <p className={styles.footerNote}>
              © {new Date().getFullYear()} {app.name}
            </p>
          </div>
        </footer>
      </main>
    </Layout>
  );
}
