import { MainGameLayoutSubject } from '../types/MainGameLayoutSubjectType';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { MainGameLayoutProviderPropsType } from '@ComponentsRoot/core/types/MainProvidersPropTypes';
import AuthRepository from '@Repositories/AuthRepository';
import AccountRepository from '@Repositories/AccountRepository';
import { isExpiredTokenFromAxiosResponse } from '@ComponentsRoot/ErrorHandler/bloc/ErrorHandlerBloc';
import { AxiosResponse } from 'axios';

const defaultSubjectData: MainGameLayoutSubject = {
  isMainMenuOpen: false,
  isLoading: false,
  userSignedToken: null,
  accountData: null,
  hasError: null,
};
export default class MainGameLayoutBloc extends BaseBloc<MainGameLayoutSubject> {
  providerProps: MainGameLayoutProviderPropsType;
  authRepository: AuthRepository;
  accountRepository: AccountRepository;

  constructor(props: MainGameLayoutProviderPropsType) {
    super(defaultSubjectData);
    this.providerProps = props;
    this.authRepository = props.repositoryManager.getAuthRepository();
    this.accountRepository = props.repositoryManager.getAccountRepository();
  }

  toggleOpenMainMenu = () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ isMainMenuOpen: !prevState.isMainMenuOpen });
  };

  setUserSignedToken = (token: string, account: string) => {
    try {
      this.authRepository.saveTokenOnLocalStorageAndSetupHeaders(token, account);
      this.setNextSubjectValue({ userSignedToken: token });
    } catch (error) {
      console.log(error);
    }
  };

  setAccountData = async () => {
    try {
      const accountData = await this.accountRepository.getAccountData();
      this.setNextSubjectValue({ userColony: accountData.colony, accountData: accountData.account });
    } catch (error) {
      const isTokenExpiredAxiosError = isExpiredTokenFromAxiosResponse((error as any).response as AxiosResponse);
      if (isTokenExpiredAxiosError) {
        this.clearUserSignedToken();
      } else {
        this.setErrorOnBloc(error);
      }
    }
  };

  clearUserSignedToken = () => {
    this.setNextSubjectValue({ hasError: null, userSignedToken: null, accountData: null });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
    (async () => {
      await this.setAccountData();
    })();
  };
}
