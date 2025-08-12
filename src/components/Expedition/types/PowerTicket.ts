import { Ant } from '@ComponentsRoot/Ant/types/Ant';

export type PowerTicket = {
  _id?: string;
  powerAmount: number;
  maxBuyQty: number;
  rarity: Ant['rarity'];
};

export type PurchasedPowerTicket = {
  _id?: string;
  owner: string;
  buyedPwrTicket: string; //ObjectId of the purchased ticket relation
  destinationId?: number;
  colonyId: string;
  price: number;
  date: Date;
  winCount?: number;
  used: boolean;
  powerAmount: number;
  rarity: Ant['rarity'];
};
