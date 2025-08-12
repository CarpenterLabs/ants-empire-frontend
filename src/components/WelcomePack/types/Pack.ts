export type Pack = {
  _id?: string; //master key
  imguri: string;
  description: string;
  num_mints: number;
  packToBuyId: string;
  price: number;
  published: boolean;
  max_buy_qty: number;
  pub_dates: Date;
  ant_type: [string, number];
  ant_rarity: [string, number];
  family: string;
  title: string;
  priceDiscount?: number;
  percentDiscount?: number;
  ant_guaranteed?: [{ ant_type: [string, number], ant_rarity: [string, number] }];
  available?: boolean;
  queen_rarity?: [string, number];
  error?: string;
};