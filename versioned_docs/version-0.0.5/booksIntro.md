---
id: book-translations
title: 翻译书籍
# slug: /tools
# hide_title: true
hide_title: true
hide_table_of_contents: true
sidebar_label: 翻译书籍
description: 翻译书籍
keywords:
  - translations
  - book
---
:::tip 点击以下链接跳转

:::

```mdx-code-block

import BookCard from '@site/src/components/BookCard'
import BookCardCover1 from "./books/cover/unityuiandimplementation.jpeg"

<BookCard
book={{
  name:"Unity用户界面设计与实现",
  cover:BookCardCover1,
  type:"eBook",
  link:"https://unity.com/cn/resources/user-interface-design-and-implementation-in-unity"
  }} to="User-Interface-Design-and-Implementation-in-Unity"/>

```

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<DocCardList items={useCurrentSidebarCategory().items}/>
