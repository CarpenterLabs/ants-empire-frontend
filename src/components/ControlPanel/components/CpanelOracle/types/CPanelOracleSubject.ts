import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { OracleDataFullValues } from '../../CPanelStandard/types/ControlPanelSubject';
import CPanelOracleBloc from '../bloc/CpanelOracleBloc';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import ControlPanelBloc from '../../CPanelStandard/bloc/ControlPanelBloc';

export type CPanelOracleBlocProps = {
  cpanelBloc: ControlPanelBloc;
  data: OracleDataFullValues;
};

export type CPanelOracleViewProps = {
  bloc: CPanelOracleBloc;
  subjectValue: CPanelOracleSubject;
  cpanelOracleData: OracleDataFullValues;
};

export type CPanelOracleSubject = {
  isLoading: boolean;
  hasError: null | any;
  toastr: ToastrSubjectType;
  oracleData: OracleDataFullValues | null;
  initialData: OracleDataFullValues | null;
};

export const defaultCPanelOracleSubjData: CPanelOracleSubject = {
  isLoading: false,
  hasError: null,
  toastr: toastrObjDefValue,
  initialData: null,
  oracleData: null,
};
