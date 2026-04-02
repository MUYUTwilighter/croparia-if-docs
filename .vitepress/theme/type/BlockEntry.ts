export interface NormalizedBlockEntry {
  id?: string;
  tag?: string;
  properties: {
    [key: string]: string
  };
}

export type BlockEntry = NormalizedBlockEntry | {
  id?: string;
  tag?: string;
  properties?: {
    [key: string]: string
  };
} | string;

export const BlockEntry = {
  normalize(blockSlot: BlockEntry): NormalizedBlockEntry {
    if (typeof blockSlot === 'string') {
      return blockSlot.startsWith('#') ? {
        tag: blockSlot,
        properties: {},
      } : {
        id: blockSlot,
        properties: {},
      };
    } else if (blockSlot.tag && blockSlot.id) {
      throw new Error('Tag and ID cannot be both set');
    } else {
      return {
        properties: {},
        ...blockSlot,
      };
    }
  }
}