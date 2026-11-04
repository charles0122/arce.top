import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';

import JsonLd from '@site/src/components/JsonLd';

const TITLE = '关于 Arce';
const DESCRIPTION =
  '白日梦想家 / Arce TV：独立开发者 Arce（charles0122）的个人站点，分享应用、游戏、学习笔记与创意实验。';

const faq = [
  {
    q: '这个网站是做什么的？',
    a: 'Arce TV（白日梦想家）是我的个人站点：放博客、学习笔记、独立应用与游戏项目。',
  },
  {
    q: '你主要做什么技术方向？',
    a: '以 Flutter / Unity / 全栈与游戏开发为主，也会写 Rust、Shader 等探索笔记。',
  },
  {
    q: '作品和源码在哪里看？',
    a: '站内可看「作品」与「产品」；开源项目多在 GitHub @charles0122。',
  },
  {
    q: '如何联系你？',
    a: '优先通过 GitHub 联系；博客文章也可留言讨论。',
  },
];

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: 'Arce',
    alternateName: ['白日梦想家', 'charles0122'],
    url: 'https://www.arce.top/about',
    image: 'https://avatars.githubusercontent.com/u/70085736?v=4',
    sameAs: [
      'https://github.com/charles0122',
      'https://www.arce.top/',
    ],
    jobTitle: 'Indie developer',
    description: DESCRIPTION,
  },
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function AboutPage(): React.JSX.Element {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <Head>
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="Arce TV" />
      </Head>
      <JsonLd data={[personLd, faqLd]} />
      <main className="container margin-vert--lg">
        <header className="margin-bottom--lg">
          <p className="hero__subtitle">ARCE / ABOUT</p>
          <h1>{TITLE}</h1>
          <p>
            你好，我是 <strong>Arce</strong>（GitHub{' '}
            <a href="https://github.com/charles0122" target="_blank" rel="noreferrer">
              @charles0122
            </a>
            ）。这个站也叫「白日梦想家 / Arce TV」，用来记录我做应用、游戏和学习笔记的过程。
          </p>
          <p>
            如果你在找可玩的产品，去看 <Link to="/apps">产品</Link>；想看项目合集，去看{' '}
            <Link to="/project">作品</Link>；技术长文在 <Link to="/blog">博客</Link>。
          </p>
        </header>

        <section className="margin-bottom--xl">
          <h2>常见问题</h2>
          {faq.map((item) => (
            <div key={item.q} className="margin-bottom--md">
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </div>
          ))}
        </section>

        <p>
          <Link className="button button--primary" to="/project">
            浏览作品 ↗
          </Link>{' '}
          <Link className="button button--secondary" to="/blog">
            阅读博客 ↗
          </Link>
        </p>
      </main>
    </Layout>
  );
}
