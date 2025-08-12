import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import ControlPanelBloc from '../../CPanelStandard/bloc/ControlPanelBloc';
import CPanelMaterialBoxesBloc from '../bloc/CPanelMaterialBoxesBloc';
import { MaterialBoxToBuy } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';

export type CPanelMaterialBoxesBlocProps = {
  cpanelBloc: ControlPanelBloc;
  data: MaterialBoxToBuy[];
};

export type CPanelMaterialBoxesViewProps = {
  bloc: CPanelMaterialBoxesBloc;
  subjectValue: CPanelMaterialBoxesSubject;
  materialBoxesTempTabData: MaterialBoxToBuy[];
};

export type CPanelMaterialBoxesSubject = {
  isLoading: boolean;
  hasError: null | any;
  toastr: ToastrSubjectType;
  saveBtnDisabled: boolean;
  materialBoxes: MaterialBoxToBuy[] | null;
  initialData: MaterialBoxToBuy[] | null;
  wantReset: boolean;
};

export const defaultCPanelMBoxesSubjData: CPanelMaterialBoxesSubject = {
  isLoading: false,
  hasError: null,
  toastr: toastrObjDefValue,
  saveBtnDisabled: true,
  materialBoxes: null,
  initialData: null,
  wantReset: false,
};

export const getNewMaterialBoxToBuyTemplate = (n_newMBoxes: number) => {
  return {
    _id: undefined,
    imguri: '',
    description: '',
    name: 'Nueva MaterialBox',
    mBoxToBuyId: `newMBox_${n_newMBoxes}`,
    createdMBox_id: `newMBox_${n_newMBoxes}`,
    action: 'create',
    isTemporary: true,
    materials: [
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ],
    price: 1.0,
    available: true,
    published: true,
  };
};
