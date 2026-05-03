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

export function SpecialDocChrome({ children }: { children: React.ReactNode }) {
  const { doc } = useDocContext();
  const { headerItems } = useDocNavigation();
  const { isFallback, message } = useFallbackNotice();
  const { isNavVisible, isSitemapIncluded, isHidden } = useDiscoveryState();
  const localeSwitcher = useLocaleSwitcher();
  const versionSwitcher = useVersionSwitcher();

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-8">
        <header className="space-y-4 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium tracking-[0.2em] text-stone-500 uppercase">Croparia IF Docs</p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">{doc.frontmatter.title ?? "未知标题"}</h1>
            <p className="max-w-3xl text-sm leading-7 text-stone-600">{doc.frontmatter.desc ?? ""}</p>
          </div>
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
              {!isNavVisible ? " `nonav: true` 已将它从导航中排除；" : ""}
              {!isSitemapIncluded ? " `sitemap: false` 已将它从 sitemap 和默认索引策略中排除。" : ""}
            </div>
          ) : null}
          {!isHidden && isFallback && message ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950">
              {message} 此类 fallback 页面默认使用真实来源页的 canonical，并以 `noindex,follow` 暴露给搜索引擎。
            </div>
          ) : null}
        </header>

        <article className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <div className="doc-content">{children}</div>
        </article>
      </div>
    </main>
  );
}
