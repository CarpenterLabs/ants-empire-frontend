import NodeApiDS from '@DataSource/NodeApiDS';
import { MarketFilters } from '@ComponentsRoot/Market/types/MarketFilters';
import { MarketResponse } from '@ComponentsRoot/Market/types/MarketListing';
import { simulateContract, writeContract } from '@wagmi/core';
import { MarketMetadata } from '@ComponentsRoot/core/blockchain/abi/Market_ABI';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import { Address, parseEther } from 'viem';
import { antNftMetadata } from '@ComponentsRoot/core/blockchain/abi/ANT_NFT_PURE_ABI';
import { Nectar_Metadata } from '@ComponentsRoot/core/blockchain/abi/Nectar_ABI';
export default class MarketRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  getMarketData = async (filters: MarketFilters): Promise<MarketResponse> => {
    try {
      const queryParams = this.buildMarketFiltersUrl(filters);
      return (await this.nodeApiDS.callApi(`market/listings?${queryParams}`, 'get')).data;
    } catch (error) {
      throw error;
    }
  };

  buildMarketFiltersUrl = (params: MarketFilters): string => {
    const queryParams = new URLSearchParams();

    queryParams.append('type', params.type!);
    queryParams.append('rarity', params.rarity!);
    queryParams.append('isUpgraded', String(params.isUpgraded));
    queryParams.append('minHP', String(params.minHP));
    queryParams.append('maxHP', String(params.maxHP));
    queryParams.append('minPower', String(params.minPower));
    queryParams.append('maxPower', String(params.maxPower));
    queryParams.append('page', String(params.page));
    queryParams.append('owner', String(params.owner));
    queryParams.append('sortBy', String(params.sortBy));
    queryParams.append('sortOrder', String(params.sortOrder));

    return queryParams.toString();
  };

  approveMarketSC = async (spenderAddress: Address, tokenId: number) => {
    const { request } = await simulateContract(wagmiProviderConfigLast, {
      abi: antNftMetadata.abi,
      address: antNftMetadata.address,
      functionName: 'approve',
      args: [spenderAddress, BigInt(tokenId)], // Pass spender and tokenId
    });
    const hash = await writeContract(wagmiProviderConfigLast, request);
    return hash;
  };

  approveNectarOnMarketSC = async (spenderAddress: Address, amount: string) => {
    const { request } = await simulateContract(wagmiProviderConfigLast, {
      abi: Nectar_Metadata.abi,
      address: Nectar_Metadata.address,
      functionName: 'approve',
      args: [spenderAddress, parseEther(amount)], // Pass spender and tokenId
    });
    const hash = await writeContract(wagmiProviderConfigLast, request);
    return hash;
  };

  listNFT = async (tokenId: number, price: number, uuid: string) => {
    try {
      // call approve to allow Farming SC to spend the nectar amount
      await this.approveMarketSC(MarketMetadata.address, tokenId);

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: MarketMetadata.abi,
        address: MarketMetadata.address,
        functionName: 'listNFT',
        args: [BigInt(tokenId), parseEther(price.toString()), uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  purchaseNFT = async (listingId: number, uuid: string) => {
    try {
      // call approve to allow Farming SC to spend the nectar amount
      // we set 100 nectar allowance at the moment, we will analize it globally on all usecases
      await this.approveNectarOnMarketSC(MarketMetadata.address, '1000');

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: MarketMetadata.abi,
        address: MarketMetadata.address,
        functionName: 'purchaseNFT',
        args: [BigInt(listingId), uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  updatePriceNFT = async (listingId: number, newPrice: number, uuid: string) => {
    try {
      // call approve to allow Farming SC to spend the nectar amount
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: MarketMetadata.abi,
        address: MarketMetadata.address,
        functionName: 'updateListingPrice',
        args: [BigInt(listingId), parseEther(newPrice.toString()), uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  delistNFT = async (listingId: number, uuid: string) => {
    try {
      // call approve to allow Farming SC to spend the nectar amount

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: MarketMetadata.abi,
        address: MarketMetadata.address,
        functionName: 'delistNFT',
        args: [BigInt(listingId), uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };
}
