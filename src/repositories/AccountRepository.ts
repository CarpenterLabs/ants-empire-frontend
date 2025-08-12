import { Nectar_Metadata } from '@ComponentsRoot/core/blockchain/abi/Nectar_ABI';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import { Inventory } from '@ComponentsRoot/Inventory/types/Inventory';
import { AccountEntity } from '@ComponentsRoot/MetamaskAntsConnector/entity/AccountData';
import NodeApiDS from '@DataSource/NodeApiDS';
import { readContract, SignTypedDataReturnType } from '@wagmi/core';
import { Address } from 'viem';
import AuthRepository from './AuthRepository';
import { USDT_Metadata } from '@ComponentsRoot/core/blockchain/abi/USDT_ABI';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';

export default class AccountRepository {
  nodeApiDS: NodeApiDS;
  private readonly authRepo: AuthRepository;
  constructor(nodeApiDS: NodeApiDS, authRepo: AuthRepository) {
    this.nodeApiDS = nodeApiDS;
    this.authRepo = authRepo;
  }

  getAccountData = async (): Promise<{colony: Colony, account: AccountEntity}> => {
    try {
      const res = await this.nodeApiDS.callApi('account/', 'get');
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  getInventory = async (): Promise<Inventory> => {
    try {
      const res = await this.nodeApiDS.callApi('account/inventory', 'get');
      return res.data[0];
    } catch (error) {
      throw error;
    }
  };

  getNectarBalance = async (walletId: Address): Promise<any> => {
    const result = await readContract(wagmiProviderConfigLast, {
      abi: Nectar_Metadata.abi,
      address: Nectar_Metadata.address,
      functionName: 'balanceOf',
      args: [walletId],
    });

    return result;
  };


  getUSDTBalance = async (walletId: Address): Promise<any> => {
    const result = await readContract(wagmiProviderConfigLast, {
      abi: USDT_Metadata.abi,
      address: USDT_Metadata.address,
      functionName: 'balanceOf',
      args: [walletId],
    });

    return result;
  };


  loginAuth = async (
    userAddress: string,
    timestamp: number,
    contents: string,
    signature: SignTypedDataReturnType
  ): Promise<string> => {
    try {
      return (
        await this.nodeApiDS.callApi(
          `auth/login`,
          'post',
          JSON.stringify({ address: userAddress, timestamp: timestamp, contents, signature })
        )
      ).data;
    } catch (error) {
      throw error;
    }
  };

  refreshToken = async (userAddress: string) => {
    try {
      const newToken = (await this.nodeApiDS.callApi(`auth/refreshToken`, 'get')).data;
      await this.authRepo.saveTokenOnLocalStorageAndSetupHeaders(newToken, userAddress);
    } catch (error) {
      throw error;
    }
  };
}
