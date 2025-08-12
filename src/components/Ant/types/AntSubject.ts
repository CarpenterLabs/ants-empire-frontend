import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { Ant } from './Ant';

export type AntSubject = {
  isLoading: boolean;
  mintData: Ant[] | undefined;
  hasError: null | any;
  toastr: ToastrSubjectType;
  price: number | undefined;
};

export const defaultSubjDataAntBloc: AntSubject = {
  mintData: undefined,
  isLoading: false,
  hasError: null,
  toastr: toastrObjDefValue,
  price: undefined
};
