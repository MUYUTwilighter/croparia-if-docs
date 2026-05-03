# Croparia IF Docs

基于 Next.js App Router 的版本感知文档系统原型。

这个项目当前不是“纯静态 Markdown 站”，而是一个围绕文档解析器组织的内容系统，核心能力包括：

- 多语言路由预留
- 多版本回退解析
- `content/` 驱动的导航与路由编排
- 真实来源驱动的 canonical / sitemap / 搜索
- 面向页面消费层的 `Provider + hooks`

## 开发命令

```bash
npm run dev
npm run lint
npm run build
npm run test:run
```

`npm run dev` 已接入 `content/` 监听，修改文档内容会触发开发期热更新。  
测试基于 Next 官方推荐的 Vitest 方案，并额外适配了当前 Windows 环境下的运行限制。

## 路由约定

正式文档路径统一位于 `/doc/...`：

- `/doc`
- `/doc/[locale]`
- `/doc/[locale]/[version]`
- `/doc/[locale]/[version]/[...slug]`
- `/doc/[version]/...`
- `/doc/[...slug]`

所有短路径最终都会归一化到完整路径：

- `/doc/[locale]/[version]/[...slug]`

此外，根路径保留了一组“特殊文档页”入口：

- `/`
- `/[locale]`
- `/[root-doc]`
- `/[locale]/[root-doc]`

这里的 `[root-doc]` 指文档根目录下、与栏目目录平级的独立文档页面。

这组路径的行为是：

- URL 保持在根路径下
- 页面直接渲染对应文档内容
- 不显示 sidebar
- canonical 仍然指向完整 `/doc/[locale]/[version]/...` 路径

其余根路径文档风格 URL 仅作为兼容跳转层存在，不应继续作为新链接生成目标。

## 内容目录

文档源统一放在：

```text
content/
  [locale]/
    [version]/
      ...
```

其中：

- `locale` 表示文档语言
- `version` 表示该语言下的文档版本层
- `slug` 由实际文件路径决定

文档、导航、搜索索引和 SEO 元数据都从这棵内容树推导。

## 文档解析规则

请求文档时，解析顺序为：

- 版本优先
- 在每一层版本内做语言回退
- 全部失败后进入 404

也就是说，解析器总是尽量先保留用户请求的版本语义，再在该版本层内查找可用语言内容，然后再继续向更早的回退版本前进。

## 首页与根级文档规则

站点首页不再来自 `content/.../index.mdx` 的直接路由绑定。

现在根路径与本地化根路径会作为“特殊文档页”渲染入口：

- `/`
- `/<locale>`

它们会：

- 选择对应语言的根 Index 语义内容
- 不主动跳转到 `/doc/...`
- canonical 仍然指向完整文档路径

正式文档入口页位于：

- `/doc/[locale]/[version]`

同时：

- 顶层独立文档与栏目目录平级
- 两者都可以进入 header 导航
- 只有栏目会参与左侧 sidebar
- 根级独立文档支持通过根路径特殊入口无跳转渲染

## Frontmatter 约定

一般文档页支持这些字段：

- `title`
  - 默认取文档中的第一个一级标题
  - 没有时使用 `未知标题`
- `desc`
  - 默认取第一个一级标题后紧跟的正文段落
  - 没有时为空
- `nonav`
  - 默认不填，视为 `false`
  - 填 `true` 后，该页不进入导航
- `navOrder`
  - 排序权重，默认按 `0` 处理
- `sitemap`
  - 默认 `true`
- `metadata`
  - 其他简单标量 frontmatter 会保留进 metadata

索引文档页同样使用这些字段，但语义上主要用于目录命名与目录排序。

## 导航规则

导航完全由 `content/` 下的文档结构和 frontmatter 推导：

- 顶层独立页：进入 header，不进入 sidebar
- 栏目页：进入 header
- 栏目内部页：进入 sidebar
- 打开某个栏目的页面时，sidebar 只显示当前栏目的导航

不再依赖手写的站点侧栏配置文件来维护目录结构。

## 标题与 SEO

- 根 Index 与根级独立文档在根路径下渲染时，仍然按文档 metadata 生成标题
- 普通文档页浏览器标题格式为：
  - `当前页标题 | 文档首页标题`
- canonical 始终指向真实来源页的完整路径
- sitemap 默认只收录完整 `/doc/[locale]/[version]/...` 路径
- fallback 页默认 `noindex,follow`

## 搜索

站内搜索接口：

```text
GET /api/search?q=关键词&locale=<locale>&version=<version>&limit=<n>
```

搜索索引按真实来源页去重生成：

- `href`：当前上下文下可跳转的地址
- `canonicalHref`：真实来源页地址

## 消费层 Hooks

页面消费层已经从“页面内散落逻辑”收拢为 `Provider + hooks` 模式。

当前可复用的核心入口包括：

- `DocProvider`
- `useDocContext`
- `useOptionalDocContext`
- `useDocNavigation`
- `useFallbackNotice`
- `useDiscoveryState`
- `useLocaleSwitcher`
- `useVersionSwitcher`
- `useDocSearch`

约定是：

- 底层 `resolveDoc`、`resolveSidebar`、`routing`、`search` 等仍保持纯函数 / 服务端逻辑
- 页面和前端控件只消费 hooks 暴露出来的状态与跳转目标

这样后续实现语言选择器、版本选择器、fallback 提示条、导航组件和搜索框时，不需要重复拼接文档路由或复制解析规则。

## 测试

当前已补的测试重点覆盖：

- 文档回退顺序
- 路由归一化
- 导航与可见性规则
- canonical 规则
- 搜索参数与请求 URL 约定

如果后续继续扩展架构，建议优先继续围绕 resolver、routing 和 hooks 的纯逻辑层补测试，而不是先扩页面快照。
