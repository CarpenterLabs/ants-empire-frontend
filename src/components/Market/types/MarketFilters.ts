import { SortFilterMarketOption } from "../views/MarketFilterPanel";

export interface MarketFilters {
  type: string;
  rarity: string;
  isUpgraded: boolean;
  minHP: number;
  maxHP: number;
  minPower: number;
  maxPower: number;
  page: number;
  owner: boolean;
  sortBy: SortFilterMarketOption;
  sortOrder: "desc" | "asc";
}
