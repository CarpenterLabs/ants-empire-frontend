import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { Inventory } from './Inventory';

export type InventorySubject = {
  isLoading: boolean;
  inventoryData: Inventory | undefined;
  multiSelectEnabled: boolean;
  assignerOpenFromPurchasedMaterialBoxBtn: boolean;
  isOpenAssignToColonyModal: boolean;
  packToOpen: PurchasedPack | undefined;
  antToOpenDetail: Ant | undefined;
  hasError: null | any;
  toastr: ToastrSubjectType;
  antToListMarket: Ant | undefined;
};

export const defaultSubjDataInventoryBloc: InventorySubject = {
  inventoryData: undefined,
  isLoading: false,
  isOpenAssignToColonyModal: false,
  assignerOpenFromPurchasedMaterialBoxBtn: false,
  packToOpen: undefined,
  toastr: toastrObjDefValue,
  antToOpenDetail: undefined,
  antToListMarket: undefined,
  multiSelectEnabled: false,
  hasError: null,
};
