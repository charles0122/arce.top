# arce.top

「白日梦想家」个人博客，基于 [Docusaurus](https://docusaurus.io/) 构建，单语言（zh-Hans）。

## 本地开发

```bash
pnpm install
pnpm start
```

本地开发服务器默认地址 <http://localhost:3000>，大部分改动实时热更新。

## 构建

```bash
pnpm build
```

静态产物输出到 `build/` 目录，可部署到任意静态托管服务。

## 本地预览构建产物

```bash
pnpm serve
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm clear` | 清理 Docusaurus 缓存与生成物 |
| `pnpm run swizzle` | 弹出（eject）主题组件 |
| `pnpm run write-heading-ids` | 为文档 Markdown 添加标题锚点 id |

## 注意事项

- 多语言与文档版本管理已移除，不要再引入 `versions.json` / `i18n/` 结构；`docusaurus.config.ts` 中保留的 `i18n` 配置仅用于输出正确的 `html lang`，利于 SEO。
- `src/theme/BlogPostPage` 是唯一 swizzle 定制的主题组件（追加 Giscus 评论与返回顶部按钮），升级 Docusaurus 版本时需要重新 swizzle 并回填。
- 升级依赖时同时升级所有 `@docusaurus/*` 包，版本保持一致。
