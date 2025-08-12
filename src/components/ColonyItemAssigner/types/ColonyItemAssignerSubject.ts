import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';

export type ColonyItemAssignerSubject = {
  isLoading: boolean;
  coloniesData: Colony[] | null;
  selectedColony: Colony | null;
  hasError: null | any;
  toastr: ToastrSubjectType;
  assignModalErrorData?: {
    errors: AddToColonyExceedErrorType[];
  };
};

export const defaultSubjDataColItemAssignerBloc: ColonyItemAssignerSubject = {
  isLoading: false,
  coloniesData: null,
  selectedColony: null,
  hasError: null,
  toastr: toastrObjDefValue,
};

export type AddToColonyExceedErrorType = {
  roomId: number;
  roomAvailableCapacity: number;
  exceededCount: number;
  availablePwrToBeAllocated: number;
  exceededPowerBy: number;
  i18nError: {
    errorText: string;
    code: string;
  };
  destinationColonyId: string;
};
