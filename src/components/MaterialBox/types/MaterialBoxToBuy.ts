export type MaterialBoxToBuy = {
  _id?: string; //master key
  imguri: string;
  description: string;
  mBoxToBuyId: string;
  price: number; //Nectar price
  published: boolean;
  max_buy_qty: number;
  pub_dates: Date;
  name: string;
  // priceDiscount?: number;
  // percentDiscount?: number;
  materials: [number, number][];
  available: boolean;
  action?: "update" | "create" | "remove";
  isTemporary?: boolean;
  createdMBox_id?: string;
};

export const materialEmojisRelation: { [key: number]: string } = {
  1: "🍃",
  2: "🗻",
  3: "🧱",
  4: "💧",
  5: "🌱",
};