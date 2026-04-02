import {ItemEntry} from "./ItemEntry";

export class MojItemInput {
  item?: string;
  tag?: string;
  components?: {
    [k: string]: any
  };

  static toItemEntry(item: MojItemInput) {
    return ItemEntry.normalize({
      id: item.item,
      tag: item.tag,
      components: item.components
    });
  }
}