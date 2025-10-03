export default interface Crop {
  id: string;
  tier: number;
  material: string;
  color: string;
  type: string;
  translations: {
    [key: string]: string;
  },
  dependencies: {
    [key: string]: string;
  }
}