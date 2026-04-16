import { computed, unref, type ComputedRef, type Ref } from "vue";

type LocaleInput = string | undefined | Ref<string | undefined> | ComputedRef<string | undefined>;
export type DocLocale = "zh";

function normalizeLocale(_input: string | undefined): DocLocale {
  return "zh";
}

export function useLocale(explicitLocale?: LocaleInput) {
  return computed<DocLocale>(() => {
    return normalizeLocale(unref(explicitLocale));
  });
}
