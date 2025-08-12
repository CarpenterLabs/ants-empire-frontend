import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { Address } from 'viem';
export type MarketListing = {
  nftId: number;
  owner: Address;
  price: number;
  listingDate: Date;
  isUpgraded: Ant['isUpgraded'];
  power: Ant['power'];
  type: Ant['type'];
  hp: Ant['usedtimes']; //HP
  rarity: Ant['rarity'];
  listingId: number; // Listing id on the blockchain
};

export type MarketResponse = {
  listings: MarketListing[];
  ants: Ant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

