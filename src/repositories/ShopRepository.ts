import { Shop } from '@ComponentsRoot/Shop/types/Shop';
import NodeApiDS from '@DataSource/NodeApiDS';
import { simulateContract, writeContract, WriteContractReturnType } from '@wagmi/core';
import { Address, parseEther, parseUnits } from 'viem';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import { farmingMetadata } from '@ComponentsRoot/core/blockchain/abi/Farming_ABI';
import { MaterialBoxToBuy } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import { PoolGeneral_Metadata } from '@ComponentsRoot/core/blockchain/abi/GeneralPool_ABI';
import { USDT_Metadata } from '@ComponentsRoot/core/blockchain/abi/USDT_ABI';
export default class ShopRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  getShopContent = async (): Promise<Shop> => {
    try {
      return (await this.nodeApiDS.callApi(`shop`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  purchaseMaterialBoxToBuy = async (materialBoxToBuyId: string): Promise<MaterialBoxToBuy> => {
    try {
      return (await this.nodeApiDS.callApi(`shop/buyMaterialBox`, 'post', { mBoxToBuyId: materialBoxToBuyId })).data;
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

  buyMaterialBoxOnSC = async (boxId: string, costBox: number, uuid: string): Promise<WriteContractReturnType> => {
    try {
      await this.approvPoolGeneralSC(PoolGeneral_Metadata.address, '100');
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: farmingMetadata.abi,
        address: farmingMetadata.address,
        functionName: 'buyMaterialBox',
        args: [boxId, uuid, parseUnits(String(costBox), 6)],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };
}
