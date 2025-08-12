import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { MetamaskAntsConnectorSubject } from '../types/MetamaskAntsConnectorSubject';
import AccountRepository from '@Repositories/AccountRepository';
import { getStatementText } from '../entity/Statement';
import { AntsWalletConnectorProviderProps } from '../provider/AntsWalletConnectorProvider';
import { Address, formatEther, formatUnits, TypedData } from 'viem';
import { signTypedData } from '@wagmi/core';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';

const defaultSubjData: MetamaskAntsConnectorSubject = {
  signature: null,
  isLoading: false,
  hasError: null,
  needToSignContract: false,
};
export default class MetamaskAntsConnectorBloc extends BaseBloc<MetamaskAntsConnectorSubject> {
  providerProps: AntsWalletConnectorProviderProps;
  accountRepository: AccountRepository;
  constructor(props: AntsWalletConnectorProviderProps) {
    super(defaultSubjData);
    this.providerProps = props;
    this.accountRepository = props.mainProviderProps.repositoryManager.getAccountRepository();
  }

  formatCuttedAccount = (acc: string) => {
    if (typeof acc === 'string') {
      return `0x...${acc.substring(acc.length - 4, acc.length)}`;
    }
    return '';
  };

  signMessageTypedUseCase = async (walletId: string) => {
    try {
      // EIP-712 typed data for session
      const domain = {
        name: 'AntsEmpire',
        version: '1',
        chainId: 1337, // Replace with your chain ID
      };
      const types = {
        AuthSession: [
          { name: 'address', type: 'address' },
          { name: 'timestamp', type: 'uint256' },
          { name: 'contents', type: 'string' },
        ],
      } as const satisfies TypedData;

      const timestamp = Math.floor(Date.now() / 1000);
      const value = {
        address: walletId as Address, // Replace with connected wallet address
        timestamp: BigInt(timestamp), // Current timestamp
        contents: getStatementText(walletId),
      };

      const signature = await signTypedData(wagmiProviderConfigLast, {
        account: walletId as Address,
        domain,
        primaryType: 'AuthSession',
        types,
        message: value,
      });

      // here call login auth node endpoint
      const token = await this.accountRepository.loginAuth(value.address, timestamp, value.contents, signature);

      this.setNextSubjectValue({ needToSignContract: false, signature: token });
      this.providerProps.setTokenFn(token, walletId);
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  cleanSignature = () => {
    this.setNextSubjectValue({ signature: null });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
  };

  performSignTokenFlowNew = (walletId: string) => {
    try {
      // aqui llegamos si estamos connected y en la chain correcta

      // 1st check if we have token setted on local storage
      const web3Tkn = localStorage.getItem(`wb3tkn__${walletId}`);

      if (web3Tkn) {
        // IF WE HAVE TOKEN, we have to set the headers
        this.setNextSubjectValue({ signature: web3Tkn, needToSignContract: false });
        this.providerProps.setTokenFn(web3Tkn, walletId);
      } else {
        // SET needToSignContract to true on subject
        this.setNextSubjectValue({ needToSignContract: true });
      }
    } catch (err) {
      this.setErrorOnBloc(err);
    }
  };

  clearContractToSignNewOne = () => {
    this.setNextSubjectValue({ needToSignContract: true, signature: null });
  };

  getUSDTBalance = async (walletId: Address) => {
    try {
      const usdtBalance = await this.accountRepository.getUSDTBalance(walletId);
      this.setNextSubjectValue({ usdtBalanceOnChain: formatUnits(usdtBalance.toString(), 6) });
    } catch (err) {
      this.setErrorOnBloc(err);
    }
  };

  getNectarBalance = async (walletId: Address) => {
    try {
      const nectarBalance = await this.accountRepository.getNectarBalance(walletId);
      this.setNextSubjectValue({ nectarBalanceOnChain: formatEther(nectarBalance.toString()) });
    } catch (err) {
      this.setErrorOnBloc(err);
    }
  };
}
