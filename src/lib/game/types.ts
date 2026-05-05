export interface LocaleMap {
  zh?: string;
  en?: string;
  es?: string;
  [locale: string]: string | undefined;
}

export interface ItemPayload {
  name: LocaleMap;
  registerName: string;
  CreativeTabName: LocaleMap;
  OredictList: string | string[];
  smallIcon: string;
  largeIcon: string;
  maxStacksSize: number;
  minTool?: string;
}

export interface ItemData {
  name: LocaleMap;
  registerName: string;
  CreativeTabName: LocaleMap;
  OredictList: string[];
  smallIcon: string;
  largeIcon: string;
  smallIconSrc: string;
  largeIconSrc: string;
  maxStacksSize: number;
  minTool?: string;
}

export interface EntryHooks {
  nameHook?: (title: string, locale: string) => string;
  idHook?: (id: string, locale: string) => string;
  categoryHook?: (category: string, locale: string) => string;
  tagHook?: (tags: string[], locale: string) => string[];
}

export interface NormalizedItemEntry {
  id?: string;
  tag?: string;
  components: Record<string, unknown>;
  amount: number;
}

export type ItemEntryInput =
  | NormalizedItemEntry
  | {
      id?: string;
      tag?: string;
      components?: Record<string, unknown>;
      amount?: number;
    }
  | string;

export interface NormalizedBlockEntry {
  id?: string;
  tag?: string;
  properties: Record<string, string>;
}

export type BlockEntryInput =
  | NormalizedBlockEntry
  | {
      id?: string;
      tag?: string;
      properties?: Record<string, string>;
    }
  | string;

export interface RecipeBase {
  type: string;
}

export interface MojItemInput {
  item?: string;
  tag?: string;
  components?: Record<string, unknown>;
}

export interface MojItemOutput {
  id?: string;
  count?: number;
  components?: Record<string, unknown>;
}

export interface NormalizedCraftingRecipe extends RecipeBase {
  input: Array<NormalizedItemEntry | undefined>;
  output: NormalizedItemEntry;
}

export interface ShapedCraftingRecipe extends RecipeBase {
  key: Record<string, MojItemInput>;
  pattern: string[];
  result: MojItemOutput;
}

export interface ShapelessCraftingRecipe extends RecipeBase {
  ingredients: MojItemInput[];
  result: MojItemOutput;
}

export interface NormalizedInfusorRecipe extends RecipeBase {
  element: NormalizedItemEntry;
  ingredient: NormalizedItemEntry;
  result: NormalizedItemEntry;
}

export interface InfusorRecipeInput extends RecipeBase {
  element: string;
  ingredient: ItemEntryInput;
  result: ItemEntryInput;
}

export interface NormalizedRitualRecipe extends RecipeBase {
  ritual: NormalizedBlockEntry;
  ingredient: NormalizedItemEntry;
  block: NormalizedBlockEntry;
  result: NormalizedItemEntry;
}

export interface RitualRecipeInput extends RecipeBase {
  ritual: BlockEntryInput;
  ingredient: ItemEntryInput;
  block: BlockEntryInput;
  result: ItemEntryInput;
}

export interface NormalizedSoakRecipe extends RecipeBase {
  element: NormalizedItemEntry;
  input: NormalizedBlockEntry;
  output: NormalizedBlockEntry;
  probability: number;
}

export interface SoakRecipeInput extends RecipeBase {
  element: string;
  input: BlockEntryInput;
  output: BlockEntryInput;
  probability: number;
}

export interface NormalizedRitualStructure extends RecipeBase {
  keys: Record<string, NormalizedBlockEntry>;
  pattern: string[][];
}

export interface RitualStructureInput extends RecipeBase {
  ritual: BlockEntryInput;
  keys: Record<string, BlockEntryInput>;
  pattern: string[][];
}

export type AnyNormalizedRecipe =
  | NormalizedCraftingRecipe
  | NormalizedInfusorRecipe
  | NormalizedRitualRecipe
  | NormalizedSoakRecipe
  | NormalizedRitualStructure;
