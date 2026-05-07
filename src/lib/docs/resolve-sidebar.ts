import { cache } from "react";

import { getDocsHomeTitle } from "@/src/lib/docs/config";
import { buildDocPath } from "@/src/lib/docs/routing";
import { listDocumentSlugs, resolveDoc } from "@/src/lib/docs/resolve-doc";
import type { LocaleCode, ResolvedDoc, ResolvedSidebar, SidebarItem, VersionSlug } from "@/src/lib/docs/types";

type SidebarTreeNode = {
  segment: string;
  slug: string[];
  doc: ResolvedDoc | null;
  children: Map<string, SidebarTreeNode>;
};

type SectionAccumulator = {
  key: string;
  slug: string[];
  doc: ResolvedDoc | null;
  children: Map<string, SidebarTreeNode>;
};

type HeaderItem = ResolvedSidebar["headerItems"][number];

function normalizePathSeparators(value: string) {
  return value.replace(/\\/g, "/");
}

function isSectionRootDoc(doc: ResolvedDoc) {
  if (doc.requestedSlug.length !== 1) {
    return false;
  }

  const segment = doc.requestedSlug[0];

  if (!segment) {
    return false;
  }

  const normalizedSourcePath = normalizePathSeparators(doc.relativeSourcePath);
  return normalizedSourcePath.endsWith(`/${segment}/index.mdx`) || normalizedSourcePath.endsWith(`/${segment}/index.md`);
}

function humanizeSegment(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim() || "未命名";
}

function isPrefix(prefix: string[], target: string[]) {
  return prefix.length <= target.length && prefix.every((segment, index) => target[index] === segment);
}

function startsWithAnyPrefix(target: string[], prefixes: string[][]) {
  return prefixes.some((prefix) => isPrefix(prefix, target));
}

function slugDepthWeight(slug: string[]) {
  return slug.length === 0 ? -1 : slug.length;
}

function docSortWeight(doc: ResolvedDoc | null) {
  return doc?.frontmatter.navOrder ?? 0;
}

function nodeSortWeight(node: SidebarTreeNode) {
  return docSortWeight(node.doc);
}

function compareDocs(left: ResolvedDoc, right: ResolvedDoc) {
  return (
    docSortWeight(left) - docSortWeight(right) ||
    slugDepthWeight(left.requestedSlug) - slugDepthWeight(right.requestedSlug) ||
    (left.frontmatter.title ?? humanizeSegment(left.requestedSlug.at(-1) ?? "index")).localeCompare(
      right.frontmatter.title ?? humanizeSegment(right.requestedSlug.at(-1) ?? "index"),
      "zh-Hans-CN",
    )
  );
}

function compareNodes(left: SidebarTreeNode, right: SidebarTreeNode) {
  return (
    nodeSortWeight(left) - nodeSortWeight(right) ||
    slugDepthWeight(left.slug) - slugDepthWeight(right.slug) ||
    (left.doc?.frontmatter.title ?? humanizeSegment(left.segment)).localeCompare(
      right.doc?.frontmatter.title ?? humanizeSegment(right.segment),
      "zh-Hans-CN",
    )
  );
}

function buildSidebarItems(nodes: SidebarTreeNode[], locale: LocaleCode, version: VersionSlug): SidebarItem[] {
  return nodes
    .sort(compareNodes)
    .map((node) => {
      const childItems = buildSidebarItems([...node.children.values()], locale, version);
      const href = node.doc
        ? buildDocPath(locale, version, node.slug)
        : childItems[0]?.href ?? buildDocPath(locale, version, node.slug);

      return {
        text: node.doc?.frontmatter.title ?? humanizeSegment(node.segment),
        href,
        items: childItems.length > 0 ? childItems : undefined,
      };
    });
}

function buildSectionRootItem(section: SectionAccumulator, locale: LocaleCode, version: VersionSlug): SidebarItem | null {
  if (!section.doc) {
    return null;
  }

  return {
    text: section.doc.frontmatter.title ?? humanizeSegment(section.key),
    href: buildDocPath(locale, version, section.slug),
  };
}

function resolveSectionTitle(section: SectionAccumulator) {
  return section.doc?.frontmatter.title ?? humanizeSegment(section.key);
}

function resolveSectionHref(section: SectionAccumulator, locale: LocaleCode, version: VersionSlug) {
  if (section.doc) {
    return buildDocPath(locale, version, section.slug);
  }

  if (section.children.size > 0) {
    const firstChild = [...section.children.values()].sort(compareNodes)[0];

    if (firstChild) {
      return buildDocPath(locale, version, firstChild.slug);
    }
  }

  return buildDocPath(locale, version, section.slug);
}

function buildHeaderItems(input: {
  locale: LocaleCode;
  version: VersionSlug;
  topLevelDocs: ResolvedDoc[];
  sections: SectionAccumulator[];
  currentSlug: string[];
}): HeaderItem[] {
  const items: HeaderItem[] = [];
  const currentTopLevelSegment = input.currentSlug[0] ?? null;

  items.push({
    key: "home",
    text: getDocsHomeTitle(input.locale),
    href: buildDocPath(input.locale, input.version),
    isCurrent: input.currentSlug.length === 0,
    kind: "home",
  });

  for (const doc of input.topLevelDocs.sort(compareDocs)) {
    items.push({
      key: doc.requestedSlug[0] ?? doc.relativeSourcePath,
      text: doc.frontmatter.title ?? humanizeSegment(doc.requestedSlug[0] ?? "doc"),
      href: buildDocPath(input.locale, input.version, doc.requestedSlug),
      isCurrent: doc.requestedSlug.length === 1 && currentTopLevelSegment === doc.requestedSlug[0],
      kind: "page",
    });
  }

  for (const section of input.sections) {
    items.push({
      key: section.key,
      text: resolveSectionTitle(section),
      href: resolveSectionHref(section, input.locale, input.version),
      isCurrent: currentTopLevelSegment === section.key,
      kind: "section",
    });
  }

  return items;
}

const resolveSidebarCached = cache((locale: LocaleCode, version: VersionSlug, slugKey: string): ResolvedSidebar => {
  const slugs = listDocumentSlugs();
  const resolvedDocs = slugs
    .map((slug) => resolveDoc({ locale, version, slug }))
    .filter((doc): doc is ResolvedDoc => Boolean(doc));

  const childSlugPrefixes = resolvedDocs
    .filter((doc) =>
      resolvedDocs.some(
        (candidate) => candidate.requestedSlug.length > doc.requestedSlug.length && isPrefix(doc.requestedSlug, candidate.requestedSlug),
      ),
    )
    .filter((doc) => doc.frontmatter.nonav && doc.requestedSlug.length > 0)
    .map((doc) => doc.requestedSlug);

  const visibleDocs = resolvedDocs.filter((doc) => doc.isNavVisible && !startsWithAnyPrefix(doc.requestedSlug, childSlugPrefixes));
  const sectionKeys = new Set(
    visibleDocs
      .filter((doc) => doc.requestedSlug.length > 1 || isSectionRootDoc(doc))
      .map((doc) => doc.requestedSlug[0] ?? null)
      .filter((value): value is string => Boolean(value)),
  );
  const topLevelDocs = visibleDocs.filter((doc) => doc.requestedSlug.length === 1 && !sectionKeys.has(doc.requestedSlug[0] ?? ""));
  const sectionRootDocs = visibleDocs.filter((doc) => doc.requestedSlug.length === 1 && sectionKeys.has(doc.requestedSlug[0] ?? ""));
  const sectionsMap = new Map<string, SectionAccumulator>();

  for (const sectionKey of sectionKeys) {
    sectionsMap.set(sectionKey, {
      key: sectionKey,
      slug: [sectionKey],
      doc: null,
      children: new Map<string, SidebarTreeNode>(),
    });
  }

  for (const doc of sectionRootDocs) {
    const sectionKey = doc.requestedSlug[0];

    if (!sectionKey) {
      continue;
    }

    const section = sectionsMap.get(sectionKey);

    if (section) {
      section.doc = doc;
    }
  }

  for (const doc of visibleDocs.filter((candidate) => candidate.requestedSlug.length > 1)) {
    const sectionKey = doc.requestedSlug[0];

    if (!sectionKey) {
      continue;
    }

    const section = sectionsMap.get(sectionKey);

    if (!section) {
      continue;
    }

    const relativeSlug = doc.requestedSlug.slice(1);
    let cursor = section.children;

    for (let index = 0; index < relativeSlug.length; index += 1) {
      const segment = relativeSlug[index];
      const requestedPath = [sectionKey, ...relativeSlug.slice(0, index + 1)];
      const currentNode =
        cursor.get(segment) ??
        ({
          segment,
          slug: requestedPath,
          doc: null,
          children: new Map<string, SidebarTreeNode>(),
        } satisfies SidebarTreeNode);

      if (!cursor.has(segment)) {
        cursor.set(segment, currentNode);
      }

      if (index === relativeSlug.length - 1) {
        currentNode.doc = doc;
      }

      cursor = currentNode.children;
    }
  }

  const sections = [...sectionsMap.values()]
    .filter((section) => !(section.doc?.frontmatter.nonav ?? false))
    .sort(
      (left, right) =>
        docSortWeight(left.doc) - docSortWeight(right.doc) ||
        resolveSectionTitle(left).localeCompare(resolveSectionTitle(right), "zh-Hans-CN"),
    );

  const slug = slugKey.length === 0 ? [] : slugKey.split("/");
  const currentTopLevelSegment = slug[0] ?? null;
  const currentSectionKey = currentTopLevelSegment && sections.some((section) => section.key === currentTopLevelSegment)
    ? currentTopLevelSegment
    : null;
  const currentSection = sections.find((section) => section.key === currentSectionKey) ?? null;

  return {
    headerItems: buildHeaderItems({
      locale,
      version,
      topLevelDocs,
      sections,
      currentSlug: slug,
    }),
    currentSectionKey,
    currentSectionTitle: currentSection ? resolveSectionTitle(currentSection) : null,
    items: currentSection
      ? [
          ...[buildSectionRootItem(currentSection, locale, version)].filter((item): item is SidebarItem => Boolean(item)),
          ...buildSidebarItems([...currentSection.children.values()], locale, version),
        ]
      : [],
  };
});

export function resolveSidebar(locale: LocaleCode, version: VersionSlug, slug: string[] = []): ResolvedSidebar {
  return resolveSidebarCached(locale, version, slug.join("/"));
}
