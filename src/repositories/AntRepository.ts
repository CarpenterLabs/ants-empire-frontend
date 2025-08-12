// import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { antNftMetadata } from '@ComponentsRoot/core/blockchain/abi/ANT_NFT_PURE_ABI';
import { Nectar_Metadata } from '@ComponentsRoot/core/blockchain/abi/Nectar_ABI';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import NodeApiDS from '@DataSource/NodeApiDS';
import { simulateContract, watchContractEvent, writeContract, WriteContractReturnType } from '@wagmi/core';
import { Address, parseEther } from 'viem';

export default class AntRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  generatAnts = async (valToMint: number, uuid: string): Promise<WriteContractReturnType> => {
    try {

      await this.approveAntNFTSC(antNftMetadata.address, '3');

      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: antNftMetadata.abi,
        address: antNftMetadata.address,
        functionName: 'genPendingMintForNFT',
        args: [uuid],
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  approveAntNFTSC = async (spenderAddress: Address, amount: string) => {
    const { request } = await simulateContract(wagmiProviderConfigLast, {
      abi: Nectar_Metadata.abi,
      address: Nectar_Metadata.address,
      functionName: 'approve',
      args: [spenderAddress, parseEther(amount)], // Pass spender and amount
    });
    const hash = await writeContract(wagmiProviderConfigLast, request);
    return hash;
  };

  getPriceMint = async () => {
    try {
      const res = await this.nodeApiDS.callApi('admin/getCacheData', 'get');
      return res.data.packToBuyMint.price;
    } catch (error) {
      throw error;
    }
  };

  // Initialize mint event listener
  initializeANTSCEventsListeners = (updateAntsFn: any, currentPlayerWallet: string) => {

    const unwatchMintEventListener = watchContractEvent(wagmiProviderConfigLast, {
      address: antNftMetadata.address,
      abi: antNftMetadata.abi,
      eventName: 'Transfer',
      onLogs(logs) {
        console.log('New Minted NFT for user!', logs);
        logs.forEach((event) => {
          const { from, to, tokenId } = event.args;
          // Only log events related to the specific wallet
          if (
            from!.toLowerCase() === currentPlayerWallet.toLowerCase() ||
            to!.toLowerCase() === currentPlayerWallet.toLowerCase()
          ) {
            console.log(`Transfer detected for wallet ${currentPlayerWallet}:`, {
              from,
              to,
              tokenId: tokenId!.toString(),
            });
            updateAntsFn();
          }
        });
      },
    });

    return unwatchMintEventListener;
  };
}
