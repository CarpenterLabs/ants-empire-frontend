import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';

export type FaucetSubject = {
  isLoading: boolean;
  faucetBalance?: string;
  hasError: null | any;
  toastr: ToastrSubjectType;
};

export const defaultDataSubjectFaucet: FaucetSubject = {
  isLoading: false,
  hasError: null,
  toastr: toastrObjDefValue,
};
