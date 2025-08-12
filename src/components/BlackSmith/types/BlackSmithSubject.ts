import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';

export type BlackSmithSubject = {
  isLoading: boolean;
  hasError: null | any;
  toastr: ToastrSubjectType;
};

export const defaultDataSubjectBlackSmith: BlackSmithSubject = {
  isLoading: false,
  hasError: null,
  toastr: toastrObjDefValue,
};
