import { FarmingNPC } from '@ComponentsRoot/Tavern/types/farmingNPC/FarmingNPC';
import { ExecuteQuestProcessResult, FarmingQuestHistory } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuestHistory';
import NodeApiDS from '@DataSource/NodeApiDS';
import { simulateContract, writeContract, WriteContractReturnType } from '@wagmi/core';
import { Address, parseEther } from 'viem';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import { farmingMetadata } from '@ComponentsRoot/core/blockchain/abi/Farming_ABI';
import { Nectar_Metadata } from '@ComponentsRoot/core/blockchain/abi/Nectar_ABI';
export default class FarmingQuestRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  getTavernData = async (colonyId: string): Promise<FarmingNPC[]> => {
    try {
      return (await this.nodeApiDS.callApi(`questing/farming/${colonyId}`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  executeQuest = async (colonyId: string, questId: string, npcId: number): Promise<ExecuteQuestProcessResult> => {
    try {
      const body = { questId, colonyId, npcId };
      return (await this.nodeApiDS.callApi(`questing/farming/executeQuest`, 'post', body)).data;
    } catch (error) {
      throw error;
    }
  };

  skipQuest = async (colonyId: string, questId: string, npcId: number): Promise<FarmingNPC[]> => {
    try {
      const body = { questId, colonyId, npcId };
      return (await this.nodeApiDS.callApi(`questing/farming/skipQuest`, 'post', body)).data;
    } catch (error) {
      throw error;
    }
  };

  approveFarmingSC = async (spenderAddress: Address, amount: string) => {
    const { request } = await simulateContract(wagmiProviderConfigLast, {
      abi: Nectar_Metadata.abi,
      address: Nectar_Metadata.address,
      functionName: 'approve',
      args: [spenderAddress, parseEther(amount)], // Pass spender and amount
    });
    const hash = await writeContract(wagmiProviderConfigLast, request);
    return hash;
  };

  completeQuestForNectarOnSC = async (
    colonyId: string,
    questId: string,
    questType: string,
    questCost: string,
    npcId: number,
    uuid: string
  ): Promise<WriteContractReturnType> => {
    try {
      // call approve to allow Farming SC to spend the nectar amount
      await this.approveFarmingSC(farmingMetadata.address, '100');

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: farmingMetadata.abi,
        address: farmingMetadata.address,
        functionName: 'completeQuestForNectar',
        args: [colonyId, questId, questType, BigInt(npcId), uuid, parseEther(questCost)],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  completeFreeQuestOnSC = async (
    colonyId: string,
    questId: string,
    questType: FarmingQuestHistory["typeQuest"],
    npcId: number,
    uuid: string,
    wantRandom: boolean,
    nWords: number
  ): Promise<WriteContractReturnType> => {
    try {
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: farmingMetadata.abi,
        address: farmingMetadata.address,
        functionName: 'completeFreeQuest',
        args: [colonyId, questId, questType, BigInt(npcId), uuid, wantRandom, nWords],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

}
