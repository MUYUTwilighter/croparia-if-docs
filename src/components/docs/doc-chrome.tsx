"use client";

import Link from "next/link";

import {
  useDiscoveryState,
  useDocContext,
  useDocNavigation,
  useFallbackNotice,
  useLocaleSwitcher,
  useVersionSwitcher,
} from "@/src/components/docs/doc-context";
import type { SidebarItem } from "@/src/lib/docs/types";

function SidebarTree({ items }: { items: SidebarItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.href} className="space-y-3">
          <Link
            href={item.href}
            className="block rounded-xl px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 hover:text-stone-950"
          >
            {item.text}
          </Link>
          {item.items && item.items.length > 0 ? (
            <div className="border-l border-stone-200 pl-3">
              <SidebarTree items={item.items} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function DocChrome({ children }: { children: React.ReactNode }) {
  const { doc, requestedPath, resolvedPath, canonicalPath } = useDocContext();
  const { headerItems, sidebarItems, currentSectionKey, currentSectionTitle } = useDocNavigation();
  const { isFallback, message } = useFallbackNotice();
  const { isNavVisible, isSitemapIncluded, isHidden } = useDiscoveryState();
  const localeSwitcher = useLocaleSwitcher();
  const versionSwitcher = useVersionSwitcher();

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-8">
        <header className="space-y-4 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium tracking-[0.2em] text-stone-500 uppercase">Croparia IF Docs</p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">{doc.frontmatter.title ?? "未设置标题的文档页面"}</h1>
            <p className="max-w-3xl text-sm leading-7 text-stone-600">
              页面已由统一 resolver 决定实际来源，同时复用同一份结果来生成 metadata、canonical、导航与搜索索引。
            </p>
          </div>
          <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-stone-100 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">请求路径</dt>
              <dd className="mt-2 break-all font-mono text-sm text-stone-900">{requestedPath}</dd>
            </div>
            <div className="rounded-2xl bg-stone-100 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">实际来源</dt>
              <dd className="mt-2 break-all font-mono text-sm text-stone-900">{resolvedPath}</dd>
            </div>
            <div className="rounded-2xl bg-stone-100 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">源文件</dt>
              <dd className="mt-2 break-all font-mono text-sm text-stone-900">{doc.relativeSourcePath}</dd>
            </div>
            <div className="rounded-2xl bg-stone-100 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">当前栏目</dt>
              <dd className="mt-2 break-all font-mono text-sm text-stone-900">{currentSectionKey ?? "无"}</dd>
            </div>
            <div className="rounded-2xl bg-stone-100 px-4 py-3 md:col-span-2 xl:col-span-4">
              <dt className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Canonical</dt>
              <dd className="mt-2 break-all font-mono text-sm text-stone-900">{canonicalPath}</dd>
            </div>
          </dl>
          <nav className="flex flex-wrap gap-2">
            {headerItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  item.isCurrent
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-950"
                }`}
              >
                {item.text}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-stone-500">语言</span>
              {localeSwitcher.locales.map((locale) => (
                <Link
                  key={locale.code}
                  href={locale.href}
                  className={`rounded-full px-3 py-1.5 transition ${
                    locale.isCurrent
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-950"
                  }`}
                >
                  {locale.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-stone-500">版本</span>
              {versionSwitcher.versions.map((version) => (
                <Link
                  key={version.slug}
                  href={version.href}
                  className={`rounded-full px-3 py-1.5 transition ${
                    version.isCurrent
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-stone-950"
                  }`}
                >
                  {version.label}
                </Link>
              ))}
            </div>
          </div>
          {isHidden ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-7 text-rose-950">
              该页面通过 frontmatter 控制可发现性：
              {!isNavVisible ? " `nonav: true` 已将它从侧栏导航中排除；" : ""}
              {!isSitemapIncluded ? " `sitemap: false` 已将它从 sitemap 和默认索引策略中排除。" : ""}
            </div>
          ) : null}
          {!isHidden && isFallback && message ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950">
              {message} 此类 fallback 页面默认使用真实来源页的 canonical，并以 `noindex,follow` 暴露给搜索引擎。
            </div>
          ) : null}
        </header>

        <section className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)_minmax(280px,1fr)]">
          <aside className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight">栏目导航</h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              这部分导航完全由 `content/` 下的文档结构与 frontmatter 推导。顶层文档与栏目同级显示在 header，而侧栏只负责当前栏目内部导航。
            </p>
            <h3 className="mt-6 text-sm font-semibold tracking-wide text-stone-500 uppercase">
              {currentSectionTitle ?? "当前页面不参与侧栏导航"}
            </h3>
            <nav className="mt-6">
              <SidebarTree items={sidebarItems} />
            </nav>
          </aside>

          <article className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight">文档正文</h2>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              这里渲染的是 resolver 最终命中的 MDX 内容源，所以即使 URL 保持在请求版本上，正文也可以来自回退链中的旧版本或默认语言。
            </p>
            <div className="doc-content mt-8">{children}</div>
          </article>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold tracking-tight">Fallback Trace</h2>
              <ol className="mt-4 space-y-3">
                {doc.fallbackTrace.map((attempt) => (
                  <li key={`${attempt.locale}-${attempt.version}`} className="rounded-2xl bg-stone-100 px-4 py-3">
                    <p className="font-mono text-sm text-stone-900">
                      {attempt.locale}/{attempt.version}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-stone-600">
                      尝试路径：{attempt.relativeCandidates.join(" -> ")}
                    </p>
                    <p className="mt-1 text-xs leading-6 text-stone-600">
                      {attempt.matchedRelativePath ? `命中：${attempt.matchedRelativePath}` : "未命中，继续向下回退"}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
