---
id: read-book-feeling
title: 读书有感
# slug: /tools
hide_title: true
hide_table_of_contents: true
sidebar_label: 读书有感
description: 读书有感
keywords:
  - read
  - feeling
---

:::success 点击以下链接跳转
:::

```mdx-code-block

import BookCard from '@site/src/components/BookCard'

import HuoLuanCover from "./notes/cover/El Amor En Los Tiempos Del Colera.jpeg"

<BookCard book={{cover:HuoLuanCover }} to="love-in-times-of-cholera" />

```

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
