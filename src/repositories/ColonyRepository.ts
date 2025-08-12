import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { AddToColonyBodyType } from '@ComponentsRoot/ColonyItemAssigner/types/AddToColonyBodyType';
import { ExpeditionHistory } from '@ComponentsRoot/Expedition/types/ExpeditionsHistory';
import { antsRestored } from '@ComponentsRoot/Hospital/types/AntRestored';
import NodeApiDS from '@DataSource/NodeApiDS';
import { simulateContract, writeContract, WriteContractReturnType } from '@wagmi/core';
import { parseEther, Address, parseUnits } from 'viem';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import { farmingMetadata } from '@ComponentsRoot/core/blockchain/abi/Farming_ABI';
import { Expedition_Metadata } from '@ComponentsRoot/core/blockchain/abi/Expedition_ABI';
import { Nectar_Metadata } from '@ComponentsRoot/core/blockchain/abi/Nectar_ABI';
import { USDT_Metadata } from '@ComponentsRoot/core/blockchain/abi/USDT_ABI';
import { PoolGeneral_Metadata } from '@ComponentsRoot/core/blockchain/abi/GeneralPool_ABI';

export default class ColonyRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  getUserColonies = async (): Promise<Colony[]> => {
    try {
      return (await this.nodeApiDS.callApi(`colony`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  getColonyDetail = async (id: string | undefined): Promise<Colony> => {
    try {
      return (await this.nodeApiDS.callApi(`colony/${id}`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  openPurchasedMaterialBox = async (mboxIdToOpen: string) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/openMaterialBox`, 'post', { mBoxToOpenId: mboxIdToOpen })).data;
    } catch (error) {
      throw error;
    }
  };

  addItemsToColony = async (addToColonyBody: AddToColonyBodyType) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/add`, 'post', addToColonyBody)).data;
    } catch (error) {
      throw error;
    }
  };

  upgradeRoom = async (roomId: number, colonyId: string) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/room/upgrade`, 'post', { roomId, colonyId })).data;
    } catch (error) {
      throw error;
    }
  };

  unlockRoom = async (roomId: number, colonyId: string) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/room/unlock`, 'post', { roomId, colonyId })).data;
    } catch (error) {
      throw error;
    }
  };

  collectSpot = async (spotNumber: number, colonyId: string) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/spot/collect`, 'post', { spotNumber, colonyId })).data;
    } catch (error) {
      throw error;
    }
  };

  unlockSpot = async (spotNumber: number, colonyId: string) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/spot/unlock`, 'post', { spotNumber, colonyId })).data;
    } catch (error) {
      throw error;
    }
  };

  executeTradeWithBlackSmith = async (colonyId: string, toolIdToTradeWith: number) => {
    try {
      return (
        await this.nodeApiDS.callApi(`colony/blackSmith/trade`, 'post', {
          colonyId: colonyId,
          trade: { toolId: toolIdToTradeWith },
        })
      ).data;
    } catch (error) {
      throw error;
    }
  };

  getAllAntsOnInventory = async (colonyId: string): Promise<Ant[]> => {
    try {
      return (await this.nodeApiDS.callApi(`colony/getAntsOnInventory`, 'post', { colonyId })).data;
    } catch (error) {
      throw error;
    }
  };

  restoreAnts = async (antsWithUsedTimes: antsRestored) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/hospital/restore`, 'post', antsWithUsedTimes)).data;
    } catch (error) {
      throw error;
    }
  };

  restorePack = async (restorePack: { colonyId: string; restorePackId: number }) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/hospital/buyRestorePack`, 'post', restorePack)).data;
    } catch (error) {
      throw error;
    }
  };

  getAllDestinations = async (colonyId: string) => {
    try {
      return (await this.nodeApiDS.callApi(`expedition/destinations`, 'post', { colonyId })).data;
    } catch (error) {
      throw error;
    }
  };

  startExpedition = async (colonyId: string, destinationId: number, antsIds: number[]) => {
    try {
      return (await this.nodeApiDS.callApi(`expedition/start`, 'post', { colonyId, destinationId, antsIds })).data;
    } catch (error) {
      throw error;
    }
  };

  fireStartExpeditionSC = async (
    walletId: Address,
    colonyId: string,
    destinationId: number,
    antsIds: number[],
    uuid: string,
    expeNectarCost: number
  ): Promise<WriteContractReturnType> => {
    try {
      await this.approveExpeditionSC(Expedition_Metadata.address, '100');

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: Expedition_Metadata.abi,
        address: Expedition_Metadata.address,
        functionName: 'executeExpedition',
        args: [
          walletId,
          BigInt(destinationId),
          colonyId,
          antsIds.map((antId) => BigInt(antId)),
          parseEther(expeNectarCost.toString()),
          uuid,
        ],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  getExpeditionHistory = async (colonyId: string): Promise<ExpeditionHistory[]> => {
    try {
      return (await this.nodeApiDS.callApi(`expedition/history/${colonyId}`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  getExpeditionRewardsData = async (colonyId: string) => {
    return (await this.nodeApiDS.callApi(`expedition/getExpeditionRewards/${colonyId}`, 'get')).data;
  };

  getPurchasedPowerTickets = async (colonyId: string) => {
    return (await this.nodeApiDS.callApi(`expedition/purchasedPowerTickets/${colonyId}`, 'get')).data;
  };

  buyPowerTicket = async (rewardId: string, colonyId: string): Promise<boolean> => {
    try {
      return (await this.nodeApiDS.callApi(`expedition/buyPowerTicket`, 'post', { colonyId: colonyId, expeRewardId: rewardId }))
        .data;
    } catch (error) {
      throw error;
    }
  };

  fireBuyPowerTicketSC = async (rewardId: string, colonyId: string, uuid: string, ticketPrice: number): Promise<string> => {
    try {
      // call approve to allow Farming SC to spend the nectar amount
      // we set 100 nectar allowance at the moment, we will analize it globally on all usecases
      await this.approveFarmingSC(farmingMetadata.address, '100');

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: farmingMetadata.abi,
        address: farmingMetadata.address,
        functionName: 'buyPowerTicket',
        args: [colonyId, rewardId, uuid, parseEther(ticketPrice.toString())],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  usePowerTicket = async (purchasedPwrTicketId: string, colonyId: string, antId: number, fromQuest: boolean): Promise<Ant> => {
    try {
      return (
        await this.nodeApiDS.callApi(`expedition/usePowerTicket`, 'post', {
          colonyId: colonyId,
          powerTicketId: purchasedPwrTicketId,
          antId: antId,
          ...(fromQuest && { fromQuest: true }),
        })
      ).data;
    } catch (error) {
      throw error;
    }
  };

  fireUsePowerTicketSC = async (
    purchasedPwrTicketId: string,
    colonyId: string,
    antId: number,
    fromQuest: boolean,
    uuid: string
  ): Promise<string> => {
    try {
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: farmingMetadata.abi,
        address: farmingMetadata.address,
        functionName: 'usePowerTicket',
        args: [purchasedPwrTicketId, colonyId, parseEther(antId.toString()), fromQuest, uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  buyPack = async (family: string, packToBuyId: string, colonyId: string): Promise<boolean> => {
    try {
      return (await this.nodeApiDS.callApi(`packToBuy/buy`, 'post', { family, packToBuyId, colonyId })).data;
    } catch (error) {
      throw error;
    }
  };

  moveAntToInventory = async (colonyId: string, antId: string) => {
    try {
      return (await this.nodeApiDS.callApi(`colony/sendAntInventory`, 'post', { colonyId, antId })).data;
    } catch (error) {
      throw error;
    }
  };

  add24hToCustomTimeStamp = async (colonyId: string) => {
    try {
      return (await this.nodeApiDS.callApi(`admin/timeStamp/add24h`, 'post', { colonyId })).data;
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

  approveExpeditionSC = async (spenderAddress: Address, amount: string) => {
    const { request } = await simulateContract(wagmiProviderConfigLast, {
      abi: Nectar_Metadata.abi,
      address: Nectar_Metadata.address,
      functionName: 'approve',
      args: [spenderAddress, parseEther(amount)], // Pass spender and amount
    });
    const hash = await writeContract(wagmiProviderConfigLast, request);
    return hash;
  };

  buyAxeOnSC = async (colonyId: string, costAxe: string, uuid: string): Promise<WriteContractReturnType> => {
    try {
      // call approve to allow Farming SC to spend the nectar amount
      // we set 100 nectar allowance at the moment, we will analize it globally on all usecases
      await this.approveFarmingSC(farmingMetadata.address, '100');

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: farmingMetadata.abi,
        address: farmingMetadata.address,
        functionName: 'buyAxe',
        args: [colonyId, uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
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

  buyHPPackOnSC = async (
    colonyId: string,
    packPrice: string,
    packId: number,
    socketHPPackUuid: string
  ): Promise<WriteContractReturnType> => {
    try {
      await this.approvPoolGeneralSC(PoolGeneral_Metadata.address, '100');
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: farmingMetadata.abi,
        address: farmingMetadata.address,
        functionName: 'buyHPPack',
        args: [colonyId, BigInt(packId), socketHPPackUuid, parseUnits(packPrice, 6)],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  payUpgradeRoomOnSC = async (
    nectarCost: string,
    roomId: number,
    colonyId: string,
    lvlToUpgrade: number,
    uuid: string
  ): Promise<WriteContractReturnType> => {
    try {
      await this.approveFarmingSC(farmingMetadata.address, '100');
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: farmingMetadata.abi,
        address: farmingMetadata.address,
        functionName: 'buyUpgradeRoom',
        args: [BigInt(roomId), colonyId, BigInt(lvlToUpgrade), uuid, parseEther(nectarCost)],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };
}
