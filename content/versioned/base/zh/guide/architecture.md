---
title: 文档架构
outline: deep
---

# 文档架构

当前文档站已经从“直接手写路由页面”升级成“源内容 + 生成输出”的结构。

## 目录分层

- `content/versioned/base/`：所有版本都可以共享的正文
- `content/versioned/releases/<version>/`：某个版本自己的覆盖内容
- `content/global/`：不参与版本继承、只在站点固定位置输出的页面
- `.generated/`：准备脚本生成后的 VitePress 实际读取目录

## 构建流程

1. `npm run docs:prepare`
2. 按语言和版本关系把共享内容与覆盖内容合成到 `.generated/`
3. VitePress 通过 `srcDir: '.generated'` 读取最终页面

## 为什么这样做

- 不变的文档只维护一份
- 某个版本有差异时，只需要补差异页
- 新增历史版本时，不必复制整套 Markdown
