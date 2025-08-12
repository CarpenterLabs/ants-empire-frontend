import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { MarketListing, MarketResponse } from './MarketListing';
import { MarketFilters } from './MarketFilters';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';

export type MarketSubject = {
  isLoading: boolean;
  marketData: MarketResponse | null;
  hasError: null | any;
  toastr: ToastrSubjectType;
  activeFilters: MarketFilters | undefined;
  antToBuy: Ant | undefined;
  listingToBuy: MarketListing | undefined;
  activeTab: string,
};

export const defaultDataSubjectMarket: MarketSubject = {
  isLoading: false,
  marketData: null,
  hasError: null,
  toastr: toastrObjDefValue,
  activeFilters: undefined,
  antToBuy: undefined,
  listingToBuy: undefined,
  activeTab: 'Market'
};
