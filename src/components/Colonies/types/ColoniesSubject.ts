import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { Colony } from './Colony';

export type ColoniesSubject = {
  isLoading: boolean;
  coloniesData: Colony[] | null;
  hasError: null | any;
  toastr: ToastrSubjectType;
};

export const defaultDataSubjectColonies: ColoniesSubject = {
  isLoading: false,
  coloniesData: null,
  hasError: null,
  toastr: toastrObjDefValue
}

export type ColonyCardState = {  
}