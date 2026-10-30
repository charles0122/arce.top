import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';
import legalPageStyles from '../AppLanding/styles.module.css';
import AppNavbar from '../AppNavbar';
import type {AppMeta, AppLegalSection} from '@site/src/data/apps';

export type AppLegalPageProps = {
  app: AppMeta;
  title: string;
  updated?: string;
  intro?: string;
  sections: AppLegalSection[];
};

function Section({section}: {section: AppLegalSection}) {
  return (
    <section className={styles.section}>
      <h2>{section.heading}</h2>
      {section.paragraphs?.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      {section.list && (
        <ul>
          {section.list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function AppLegalPage({
  app,
  title,
  updated,
  intro,
  sections,
}: AppLegalPageProps) {
  return (
    <Layout title={`${title} - ${app.name}`} description={`${app.name} 的${title}`}>
      <AppNavbar app={app} />
      <main className={legalPageStyles.pageMain}>
        <div className={`container margin-vert--lg ${styles.legal}`}>
          <h1>{title}</h1>
          {updated && <p className={styles.updated}>最近更新：{updated}</p>}
          {intro && <p>{intro}</p>}
          {sections.map((section) => (
            <Section key={section.heading} section={section} />
          ))}
          <Link to={`/apps/${app.slug}`}>← 返回 {app.name}</Link>
        </div>
      </main>
    </Layout>
  );
}
