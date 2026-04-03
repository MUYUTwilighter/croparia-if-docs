import { computed, unref, type ComputedRef, type Ref } from "vue";
import { useData } from "vitepress";

type LocaleInput = string | undefined | Ref<string | undefined> | ComputedRef<string | undefined>;
export type DocLocale = "zh" | "en";

function normalizeLocale(input: string | undefined): DocLocale {
  if (!input) {
    return "zh";
  }

  const lower = input.toLowerCase();
  if (lower.startsWith("en")) {
    return "en";
  }

  return "zh";
}

export function useLocale(explicitLocale?: LocaleInput) {
  const { lang } = useData();

  return computed<DocLocale>(() => {
    const provided = normalizeLocale(unref(explicitLocale));
    if (explicitLocale && unref(explicitLocale)) {
      return provided;
    }
    return normalizeLocale(lang.value);
  });
}
