import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { PackToBuy } from '../../CPanelStandard/types/Cache';
import ControlPanelBloc from '../../CPanelStandard/bloc/ControlPanelBloc';
import CPanelPacksBloc from '../bloc/CPanelPacksBloc';

export type CPanelPacksBlocProps = {
  cpanelBloc: ControlPanelBloc,
  data: allPacksResponseType
}

export type allPacksResponseType = {
  packs: PackToBuy[],
  families: string[],
  discount_wpack: number[]
}

export type CPanelPacksViewProps = {
  bloc: CPanelPacksBloc;
  subjectValue: CPanelPacksSubject; 
  packsTempTabData: allPacksResponseType;
};

export type CPanelPacksSubject = {
  packsCreated: PackToBuy[]
  isLoading: boolean;
  hasError: null | any;
  toastr: ToastrSubjectType;
  selectorFamily: string;
  packsSaveBtnDisabled: boolean;
  newFamilyBtnDisabled: boolean;
  packsTempTabData: {
    packs: PackToBuy[],
    families: string[],
    discount_wpack: number[]

  } | null;
  initialData: {
    packs: PackToBuy[],
    families: string[],
    discount_wpack: number[]
  } | null;
  newFamilyValue: string;
  discountEditable: number | null;
};

export const defaultCPanelPacksSubjData: CPanelPacksSubject = {
  packsCreated: [],
  isLoading: false,
  hasError: null,
  toastr: toastrObjDefValue,
  packsSaveBtnDisabled: true,
  newFamilyBtnDisabled: true,
  selectorFamily: "all",
  packsTempTabData: null,
  initialData: null,
  newFamilyValue: "",
  discountEditable: null
};
