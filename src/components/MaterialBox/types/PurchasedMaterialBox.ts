export type PurchasedMaterialBox = {
  _id?: string; //master key
  materials: [number, number][];
  owner: string;
  state: "inventory" | "opened" | "colony";
  price: number;
  buyedMaterialBoxId: string; // ID MATERIALBOXTOBUY
  date: string;
  name: string;
};
