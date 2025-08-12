import { PackToBuy, PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { allPacksResponseType } from '@ControlPanelComponents/CPanelPacks/types/CPanelPacksSubject';
import CPanelPacksBloc from '@ComponentsRoot/ControlPanel/components/CPanelPacks/bloc/CPanelPacksBloc';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import WelcomePackBloc from '../bloc/WelcomePackBloc';
import ControlPanelBloc from '@ComponentsRoot/ControlPanel/components/CPanelStandard/bloc/ControlPanelBloc';

export type WelcomePackSubject = {
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
  selectedPack: Pick<PackToBuy, "family" | "packToBuyId" | "num_mints">;
};

export const defaultDataSubjectWelcomePack: WelcomePackSubject = {
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
    packToBuyId: "",
    num_mints: 0
  }
}

export type WelcomePackCardState = {
  pack: PackToBuy;
  purchased?: PurchasedPack | null;
  manageBuyWP: WelcomePackBloc['manageBuyWP'];
  togglerModal?: () => void;
}

export type EditWelcomePackCardState = {
  pack: PackToBuy;
  purchased: PurchasedPack | null;
  manageBuyWP: WelcomePackBloc['manageBuyWP'];
  togglerModal: () => void;
  updateDataPacks: CPanelPacksBloc["updateDataPacks"];
  handleChangePack: CPanelPacksBloc["handleChangePack"];
  setEditable: CPanelPacksBloc["setEditable"];
  handleChangeRemove: CPanelPacksBloc["handleChangeRemove"];
  addNewPack: CPanelPacksBloc["addNewPack"];
  addNewGuaranteedAnt: CPanelPacksBloc["addNewGuaranteedAnt"];
  setEditableAntProb: CPanelPacksBloc["setEditableAntProb"];
  handleChangeAntProb: CPanelPacksBloc["handleChangeAntProb"];
  handleRemoveGuaranteed: CPanelPacksBloc["handleRemoveGuaranteed"];
  checkErrorAntProb: CPanelPacksBloc["checkErrorAntProb"];
  setBoxStatus: CPanelPacksBloc["setBoxStatus"];
  checkErrorField: CPanelPacksBloc["checkErrorField"];
  initialData: allPacksResponseType;
  edited: string
  families: string[]
  diff: Partial<PackToBuy>
  formatMessage: ControlPanelBloc["providerProps"]["intl"]["formatMessage"]
}