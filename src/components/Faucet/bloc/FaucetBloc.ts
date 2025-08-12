import { FaucetSubject, defaultDataSubjectFaucet } from '../types/FaucetSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import FaucetRepository from '@Repositories/FaucetRepository';
import AccountRepository from '@Repositories/AccountRepository';
import { Faucet_Metadata } from '@ComponentsRoot/core/blockchain/abi/Faucet_ABI';
import { formatEther } from 'viem';

export default class FaucetBloc extends BaseBloc<FaucetSubject> {
  faucetRepository: FaucetRepository;
  accountRepository: AccountRepository;
  providerProps: OutletContextType;
  constructor(props: OutletContextType) {
    super(defaultDataSubjectFaucet);
    this.providerProps = props;
    this.faucetRepository = props.repositoryManager.getFaucetRepository();
    this.accountRepository = props.repositoryManager.getAccountRepository();
  }

  claim = async () => {
    try {
      this.setLoading();
      await this.faucetRepository.claim();
      this.setLoading(false)
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  getFaucetBalance = async () => {
    try {
      const faucetBalance = await this.accountRepository.getNectarBalance(Faucet_Metadata.address);
      this.setNextSubjectValue({ faucetBalance: formatEther(faucetBalance) });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectFaucet.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
  };
}
