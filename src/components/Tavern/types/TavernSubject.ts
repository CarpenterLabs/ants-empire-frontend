import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { FarmingNPC } from './farmingNPC/FarmingNPC';
import { PurchasedPack } from '@ComponentsRoot/ControlPanel/components/CPanelStandard/types/Cache';

export type TavernSubject = {
  isLoading: boolean;
  npcsData: FarmingNPC[] | null;
  hasError: null | any;
  toastr: ToastrSubjectType;
  isOpenMintPackRewardModal: boolean;
  mintPackResult?: PurchasedPack;
};

export const defaultDataSubjectTavern = {
  isLoading: false,
  npcsData: null,
  hasError: null,
  toastr: toastrObjDefValue,
  isOpenMintPackRewardModal: false,
  mintPackResult: undefined
};
