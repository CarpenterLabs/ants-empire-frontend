import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { OracleDataFullValues } from '../../CPanelStandard/types/ControlPanelSubject';
import { CPanelOracleSubject, CPanelOracleBlocProps, defaultCPanelOracleSubjData } from '../types/CPanelOracleSubject';

export default class CPanelOracleBloc extends BaseBloc<CPanelOracleSubject> {
  providerProps: CPanelOracleBlocProps;
  constructor(props: CPanelOracleBlocProps) {
    super(defaultCPanelOracleSubjData);
    this.providerProps = props;
  }

  setOracleTempData = (initialData: OracleDataFullValues) => {
    this.setNextSubjectValue({ oracleData: initialData, initialData: initialData });
  };


  setOracleNewData= (initialData: OracleDataFullValues) => {
    this.setNextSubjectValue({ oracleData: initialData});
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultCPanelOracleSubjData.toastr });
  };
}
