import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';

export type HospitalSubject = {
  isLoading: boolean;
  hospitalData: any;
  hasError: null | any;
  toastr: ToastrSubjectType;
  colonyData: Colony | null;
  antsAvailableOnHospital: Ant[];
  currentPool: number;
  buttonCureIsDisabled: boolean;
  initialHospitalData: InitialHospitalData | {};
};

export type InitialHospitalData = {
  antsAvailableOnHospital: Ant[],
  currentPool: number,
  buttonCureIsDisabled: boolean,
};

export const defaultDataSubjectHospital = {
  isLoading: false,
  hospitalData: null,
  hasError: null,
  toastr: toastrObjDefValue,
  colonyData: null,
  antsAvailableOnHospital: [],
  currentPool: 0,
  buttonCureIsDisabled: true,
  initialHospitalData: {}
};