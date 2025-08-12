import { PackToBuy, PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { Pack } from '@ComponentsRoot/WelcomePack/types/Pack';
import NodeApiDS from '@DataSource/NodeApiDS';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import { simulateContract, writeContract } from '@wagmi/core';
import { PackToBuyMetadata } from '@ComponentsRoot/core/blockchain/abi/PackToBuy_ABI';
import { parseEther, Address, parseUnits } from 'viem';
import { Nectar_Metadata } from '@ComponentsRoot/core/blockchain/abi/Nectar_ABI';
import { QuestTypeReward } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuest';
import { PoolGeneral_Metadata } from '@ComponentsRoot/core/blockchain/abi/GeneralPool_ABI';
import { USDT_Metadata } from '@ComponentsRoot/core/blockchain/abi/USDT_ABI';

export default class WelcomePackRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  getAvailableWelcomePack = async (): Promise<PackToBuy[]> => {
    try {
      return (await this.nodeApiDS.callApi(`packToBuy/getAvailablePacks/welcome_pack`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  getPurchasedPacks = async (): Promise<PurchasedPack[]> => {
    try {
      return (await this.nodeApiDS.callApi(`packToBuy/getPurchasedPacks`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  buyPack = async (pack: Pick<PackToBuy, 'family' | 'packToBuyId'>): Promise<Pack> => {
    try {
      return (await this.nodeApiDS.callApi(`packToBuy/buy`, 'post', pack)).data;
    } catch (error) {
      throw error;
    }
  };

  getPackNumMintsInside = async (questType: QuestTypeReward): Promise<number> => {
    try {
      return (await this.nodeApiDS.callApi(`packToBuy/pack/getMintNum/${questType}`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  approvPoolGeneralSC = async (spenderAddress: Address, amount: string) => {
    const { request } = await simulateContract(wagmiProviderConfigLast, {
      abi: USDT_Metadata.abi,
      address: USDT_Metadata.address,
      functionName: 'approve',
      args: [spenderAddress, parseEther(amount)], // Pass spender and amount
    });
    const hash = await writeContract(wagmiProviderConfigLast, request);
    return hash;
  };

  fireBuyWPackBchain = async (
    pack: Pick<PackToBuy, 'family' | 'packToBuyId' | 'num_mints'>,
    walletId: string,
    colonyId: string,
    price: number,
    uuid: string
  ): Promise<Address> => {
    try {
      await this.approvPoolGeneralSC(PoolGeneral_Metadata.address, '100');

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: PackToBuyMetadata.abi,
        address: PackToBuyMetadata.address,
        functionName: 'buyWelcomePack',
        args: [pack.packToBuyId, pack.family, colonyId!, pack.num_mints!, parseUnits(price.toString(), 6), uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  resolvePack = async (pack: Pick<PackToBuy, 'family' | 'packToBuyId'>): Promise<Pack> => {
    try {
      return (await this.nodeApiDS.callApi(`packToBuy/resolve`, 'post', pack)).data;
    } catch (error) {
      throw error;
    }
  };

  fireResolvePackBchain = async (
    walletId: string,
    pack: Pick<PackToBuy, 'family' | 'packToBuyId'>,
    uuid: string
  ): Promise<string> => {
    try {
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: PackToBuyMetadata.abi,
        address: PackToBuyMetadata.address,
        functionName: 'requestResolveWelcomePack',
        args: [walletId as Address, pack.packToBuyId, pack.family, uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  approvePackToBuySC = async (spenderAddress: Address, amount: string) => {
    const { request } = await simulateContract(wagmiProviderConfigLast, {
      abi: Nectar_Metadata.abi,
      address: Nectar_Metadata.address,
      functionName: 'approve',
      args: [spenderAddress, parseEther(amount)], // Pass spender and amount
    });
    const hash = await writeContract(wagmiProviderConfigLast, request);
    return hash;
  };

  firePurchasePackToBuyBchain = async (
    pack: Partial<PackToBuy>,
    walletId: string,
    colonyId: string,
    uuid: string
  ): Promise<Address> => {
    try {
      await this.approvePackToBuySC(PackToBuyMetadata.address, '100');
      const priceInWei = parseEther(pack.price!.toString());
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: PackToBuyMetadata.abi,
        address: PackToBuyMetadata.address,
        functionName: 'buyPack',
        args: [walletId as Address, colonyId!, pack.packToBuyId!, pack.family!, uuid, pack.num_mints!, priceInWei],
      });

      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };
}
