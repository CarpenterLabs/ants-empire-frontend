import { PackToBuy, PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import ExpeditionBloc from '@ComponentsRoot/Expedition/bloc/ExpeditionBloc';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { ExpeditionReward } from '@ComponentsRoot/Expedition/types/ExpeditionReward';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';

export type PackSubject = {
  isLoading: boolean;
  WelcomePackData: {
    available: PackToBuy[],
    purchased: PurchasedPack | null
  };
  hasError: null | any;
  toastr: ToastrSubjectType;
  isRevealedModalOpen: boolean;
  fromLogin: boolean;
  warningBurningModal: boolean;
  newPlayerModal: boolean;
  selectedPack: Pick<PackToBuy, "family" | "packToBuyId">;
};

export const defaultDataSubjectWelcomePack: PackSubject = {
  isLoading: false,
  WelcomePackData: {
    available: [],
    purchased: null,
  },
  hasError: null,
  toastr: toastrObjDefValue,
  isRevealedModalOpen: false,
  fromLogin: false,
  warningBurningModal: false,
  newPlayerModal: false,
  selectedPack: {
    family: "",
    packToBuyId: ""
  }
}

export type PackCardState = {
  buyPack: ExpeditionBloc['buyPack'];
  togglerModal?: () => void;
  packRevealed: Ant[] | null;
  colonyId: string;
  expeReward: ExpeditionReward;
  outletVal: OutletContextType
}