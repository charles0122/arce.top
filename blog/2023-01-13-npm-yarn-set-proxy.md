---
slug: npm-yarn-set-proxy
title: yarn npm 代理 设置
author: Arce
author_title: 独立游戏开发者
author_url: https://github.com/charles0122
author_image_url: https://avatars.githubusercontent.com/u/70085736?v=4
description: 包管理器 yarn npm 设置代理
tags: [npm, yarn]
oid: oid
---

### npm 和 yarn 转换淘宝源和官方源

```shell
npm config set registry http://registry.npm.taobao.org/
npm config set registry https://registry.npmjs.org/

yarn config set registry http://registry.npm.taobao.org/
yarn config set registry https://registry.npmjs.org/
```
<!-- truncate -->

### npm 设置代理

```shell
npm config set proxy http://127.0.0.1:8001
npm config set https-proxy http://127.0.0.1:8001
```

### npm 删除代理

```shell
npm config delete proxy
npm config delete https-proxy
```

### yarn 设置代理

```shell
yarn config set proxy http://127.0.0.1:8001
yarn config set https-proxy http://127.0.0.1:8001
```

### yarn 删除代理

```shell
yarn config delete proxy
yarn config delete https-proxy
```
