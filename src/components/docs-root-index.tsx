import Link from "next/link";

import { getDocsHomeDescription, getDocsHomeTitle } from "@/src/lib/docs/config";
import { resolveSidebar } from "@/src/lib/docs/resolve-sidebar";
import { buildDocPath } from "@/src/lib/docs/routing";
import type { LocaleCode, VersionSlug } from "@/src/lib/docs/types";

interface DocsRootIndexProps {
  locale: LocaleCode;
  version: VersionSlug;
}

export function DocsRootIndex({ locale, version }: DocsRootIndexProps) {
  const docsTitle = getDocsHomeTitle(locale);
  const docsDescription = getDocsHomeDescription(locale);
  const docsHref = buildDocPath(locale, version);
  const headerItems = resolveSidebar(locale, version, []).headerItems;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-8">
        <header className="space-y-4 rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium tracking-[0.2em] text-stone-500 uppercase">Croparia IF Docs</p>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight">{docsTitle}</h1>
            <p className="max-w-3xl text-sm leading-7 text-stone-600">{docsDescription}</p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {headerItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-200 hover:text-stone-950"
              >
                {item.text}
              </Link>
            ))}
          </nav>
        </header>

        <article className="rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight">{docsTitle}</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-stone-700">
            <p>当前页面以站点根路由呈现对应语言的文档根 Index 语义，但不会主动跳转到文档完整路径。</p>
            <p>搜索引擎与规范化链接仍然会指向完整文档路径，方便避免根路径与文档子树之间形成重复收录。</p>
            <p>如果你想进入正式文档空间，可以继续访问下面的入口。</p>
          </div>
          <div className="mt-6">
            <Link
              href={docsHref}
              className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              打开完整文档路径
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
