export type Ant = {
  _id?: string;
  // specie: string; //number
  type: string; //number
  power: number;
  rarity: string; //number
  usedtimes: number;
  tokenId: number;
  max_usedtimes: number;
  imguri: string;
  colonyId: null | string;
  roomid: number | string;
  owner: string; //master key
  bchainid: string;
  image: string;
  isBlockedUntil?: Date;
  inMarket: boolean; // LINKED to MARKET EVENTS. if listed/delisted this field will reflect that also
  isUpgraded: boolean;
};

export const rarityEmojisRelation: { [key: string]: string } = {
  common: '🎖️',
  rare: '🥉',
  epic: '🥈',
  legendary: '🥇',
};

export const powerTypeSteps = [50, 100, 150, 200];

export interface Attribute {
  trait_type?: string; // The name of the trait (e.g., "Color", "Size")
  value: string | number; // The value of the trait (e.g., "Red", 10)
  display_type?: string; // Optional display type for the attribute (e.g., "boost_number", "boost_percentage")
}
