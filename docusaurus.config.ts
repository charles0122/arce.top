import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {Options as DocsOptions} from '@docusaurus/plugin-content-docs';
import type {Options as BlogOptions} from '@docusaurus/plugin-content-blog';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const REPO_EDIT_BASE = 'https://github.com/charles0122/arce.top/edit/main';

const config: Config = {
  title: '白日梦想家',
  tagline: '记录 Unity / Flutter / Java 全栈与游戏开发的学习笔记、踩坑经验与项目实践',
  favicon: '/img/favicon.ico',

  // Set the production url of your site here
  url: 'https://www.arce.top',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',
  // GitHub pages deployment config.
  organizationName: 'charles0122',
  projectName: 'arcetop',

  onBrokenLinks: 'throw',

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  // Single locale: only used to emit correct html lang & SEO metadata,
  // no extra /en/ build.
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/gt-walsheim-condensed-medium.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: '/fonts/gt-walsheim-condensed-ultra-bold.woff2',
        as: 'font',
        type: 'font/woff2',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'meta',
      attributes: {property: 'og:type', content: 'website'},
    },
    {
      tagName: 'meta',
      attributes: {property: 'og:site_name', content: 'Arce TV'},
    },
    {
      tagName: 'meta',
      attributes: {name: 'twitter:title', content: '白日梦想家 | Arce TV'},
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'docs',
          sidebarPath: './sidebars.ts',
          breadcrumbs: true,
          editUrl: `${REPO_EDIT_BASE}/docs`,
          include: ['**/*.md', '**/*.mdx'],
          exclude: [
            '**/_*.{js,jsx,ts,tsx,md,mdx}',
            '**/_*/**',
            '**/*.test.{js,jsx,ts,tsx}',
            '**/__tests__/**',
          ],
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          includeCurrentVersion: true,
        } satisfies DocsOptions,
        blog: {
          blogTitle: '博客',
          blogDescription: 'Unity / Flutter / 全栈与游戏开发的学习笔记、踩坑记录与项目实践。',
          blogSidebarTitle: '近期文章',
          showReadingTime: true,
          onInlineAuthors: 'ignore',
          editUrl: `${REPO_EDIT_BASE}/blog`,
          postsPerPage: 10,
          feedOptions: {
            type: 'all',
            title: '白日梦想家',
            description: 'Unity / Flutter / 全栈与游戏开发的学习笔记、踩坑记录与项目实践。',
            copyright: `Copyright © ${new Date().getFullYear()} Arce. All rights reserved.<p><a href="https://beian.miit.gov.cn/" class="footer_lin">赣ICP备2021008942号-1</a></p>`,
            createFeedItems: async (params) => {
              const {blogPosts, defaultCreateFeedItems, ...rest} = params;
              return defaultCreateFeedItems({
                // keep only the 10 most recent blog posts in the feed
                blogPosts: blogPosts.filter((item, index) => index < 10),
                ...rest,
              });
            },
          },
        } satisfies BlogOptions,
        sitemap: {
          // lastmod is what search engines actually use for recrawling
          lastmod: 'date',
          ignorePatterns: ['/tags/**'],
        },
        theme: {
          customCss: ['./src/css/custom.css', './src/css/reading.css'],
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    announcementBar: {
      id: 'announcementBar-arce',
      content: `🎉️ <b>有需要？随时来撩我，秒回（大概）</b> 🥳️`,
      isCloseable: true,
    },
    colorMode: {
      defaultMode: 'dark',
    },

    // Replace with your project's social card
    image: 'img/arce-social-card.jpg',
    navbar: {
      title: 'ARCE TV',
      hideOnScroll: true,
      items: [
        {to: 'blog', label: 'BLOG ↗', position: 'right'},
        {to: 'project', label: 'PROJECTS ↗', position: 'right'},
        {to: 'about', label: 'ABOUT ↗', position: 'right'},
        {type: 'search', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              label: '关于',
              to: '/about',
            },
            {
              label: '博客',
              to: '/blog',
            },
            {
              label: '作品',
              to: '/project',
            },
            {
              label: '产品',
              to: '/apps',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/charles0122',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Arcetop.`,
    },
    giscus: {
      repo: 'charles0122/discussions.arce.top',
      repoId: 'R_kgDOIeJrkw',
      category: 'General',
      categoryId: 'DIC_kwDOIeJrk84CSqrk',
      mapping: 'title',
      lang: 'zh-CN',
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: [
        'java',
        'csharp',
        'typescript',
        'powershell',
        'dart',
        'python',
      ],
      defaultLanguage: 'javascript',
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: {start: 'highlight-start', end: 'highlight-end'},
        },
        {
          className: 'code-block-error-line',
          line: 'This will error',
        },
      ],
    },
    zoom: {
      selector: '.markdown :not(em) > img',
      background: {
        light: 'rgb(255, 255, 255)',
        dark: 'rgb(50, 50, 50)',
      },
      config: {},
    },
  } satisfies Preset.ThemeConfig,
  plugins: [
    'docusaurus-plugin-sass',
    'image-zoom',
    [
      // 本地搜索：构建时生成索引，无需外部服务，支持中文分词
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        language: ['zh', 'en'],
        indexDocs: true,
        indexBlog: true,
        indexPages: true,
        docsRouteBasePath: '/docs',
        blogRouteBasePath: '/blog',
        highlightSearchTermsOnTargetPage: true,
      },
    ],
    [
      'content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: 'community',
        sidebarPath: './sidebarsCommunity.ts',
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        editUrl: `${REPO_EDIT_BASE}/community`,
      } satisfies DocsOptions,
    ],
  ],
  stylesheets: [
    {
      href: '/katex/katex.min.css',
      type: 'text/css',
    },
  ],
};

export default config;
