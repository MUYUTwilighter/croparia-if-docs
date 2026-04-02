export interface NormalizedItemEntry {
  id?: string;
  tag?: string;
  components: {
    [key: string]: any
  };
  amount: number;
}

export type ItemEntry = NormalizedItemEntry | {
  id?: string;
  tag?: string;
  components?: {
    [key: string]: any
  };
  amount?: number;
} | string;

export const ItemEntry = {
  normalize(itemInput: ItemEntry): NormalizedItemEntry {
    if (typeof itemInput === 'string') {
      return itemInput.startsWith('#') ? {
        tag: itemInput,
        components: {},
        amount: 1,
      } : {
        id: itemInput,
        components: {},
        amount: 1,
      };
    } else if (itemInput.tag && itemInput.id) {
      throw new Error('Tag and ID cannot be both set');
    } else {
      return {
        id: itemInput.id,
        tag: itemInput.tag,
        components: itemInput.components ?? {},
        amount: itemInput.amount ?? 1,
      };
    }
  }
}