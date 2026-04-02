export default interface EntryHook {
  nameHook?: (title: string) => string,
  idHook?: (id: string) => string,
  categoryHook?: (category: string) => string,
  tagHook?: (tag: string[]) => string[],
}