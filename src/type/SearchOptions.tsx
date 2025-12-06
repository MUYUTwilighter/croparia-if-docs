export interface Pageable {
  page: number;
  size: number;
}

export interface SearchOptions extends Pageable {
  id?: string;
  types?: string[];
  tier?: number;
  material?: string;
  dependencies?: string[];
  versions?: string[];
}