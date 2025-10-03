export default interface BlockInput {
  id?: string;
  tag?: string;
  properties?: {
    [key: string]: string;
  }
}