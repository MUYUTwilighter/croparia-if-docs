import {ItemEntry} from "./ItemEntry";

export class MojItemOutput {
  id?: string;
  count?: number;
  components?: {
    [k: string]: any
  };

  static toItemEntry(item: MojItemOutput) {
    return ItemEntry.normalize({
      id: item.id,
      amount: item.count,
      components: item.components
    });
  }
}