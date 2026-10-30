import React from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import styles from './styles.module.css';
import type {AppMeta} from '@site/src/data/apps';

export default function AppNavbar({app}: {app?: AppMeta}) {
  const links = app
    ? [
        {to: '/apps', label: '全部产品'},
        {to: `/apps/${app.slug}/privacy`, label: '隐私政策'},
        {to: `/apps/${app.slug}/support`, label: '支持与反馈'},
      ]
    : [];

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.inner}>
          <Link to={app ? `/apps/${app.slug}` : '/apps'} className={styles.brand}>
            {app && <img src={app.icon} alt="" className={styles.icon} />}
            <span>{app ? app.name : '产品'}</span>
          </Link>
          <div className={styles.links}>
            {links.map((link) => (
              <Link key={link.to} to={link.to} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
