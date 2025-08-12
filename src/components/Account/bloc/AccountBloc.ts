import { AccountSubject, defaultDataSubjectAccount } from '../types/AccountSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
export default class AccountBloc extends BaseBloc<AccountSubject> {
  providerProps: OutletContextType;

  constructor(props: OutletContextType) {
    super(defaultDataSubjectAccount);
    this.providerProps = props;
  }

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
  };
}
