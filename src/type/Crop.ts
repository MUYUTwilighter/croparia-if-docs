import Material from "@site/src/type/Material";

export default interface Crop {
  id: string;
  tier: number;
  material: string | Material;
  color: string;
  type: string;
  translations: {
    [key: string]: string;
  },
  dependencies: {
    [key: string]: string;
  }
}