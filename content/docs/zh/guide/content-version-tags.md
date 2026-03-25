---
title: 版本标签生成
outline: deep
modVersions:
  - 1.1.0a
---

# 版本标签生成

这是当前仓库新的多版本维护方式。

## 规则

- 在 `content/docs/` 中直接维护文档
- 使用 frontmatter 的 `modVersions` 声明兼容版本
- 没有 `modVersions` 的页面会被视为固定页面，只生成一份到常规路由

## 示例

```yaml
---
title: Example Page
modVersions:
  - 1.1.0a
  - 1.0.0
---
```

这表示页面兼容 `1.1.0a` 和 `1.0.0`。生成时：

- 如果 `1.1.0a` 是当前版本，这篇页面会输出到当前路径
- 如果 `1.0.0` 是历史版本，这篇页面会输出到 `/versions/1.0.0/...`

## 维护建议

- 大多数稳定页面直接标多个版本
- 真正发生变化时，再拆出单独页面并写不同的 `modVersions`
- 固定页面例如版本策略、SEO 说明等可以不写 `modVersions`
