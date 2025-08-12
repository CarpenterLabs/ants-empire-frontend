import NodeApiDS from '@DataSource/NodeApiDS';
import { simulateContract, watchContractEvent, writeContract, WriteContractReturnType } from '@wagmi/core';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import { Faucet_Metadata } from '@ComponentsRoot/core/blockchain/abi/Faucet_ABI';
export default class FaucetRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  claim = async (): Promise<WriteContractReturnType> => {
    try {
      const { request } = await simulateContract(wagmiProviderConfigLast, {
        abi: Faucet_Metadata.abi,
        address: Faucet_Metadata.address,
        functionName: 'claimTokens',
      });
      const hash = await writeContract(wagmiProviderConfigLast, request);
      return hash;
    } catch (error) {
      throw error;
    }
  };

  subscribeToSuccessFullClaim = (currentPlayerWallet: string, showToastrSuccessClaim: () => void) => {
    return watchContractEvent(wagmiProviderConfigLast, {
      address: Faucet_Metadata.address,
      abi: Faucet_Metadata.abi,
      eventName: 'TokensClaimed',
      onLogs(logs) {
        //   console.log('Tokens claimed for user!', logs);
        logs.forEach((event) => {
          const { user, amount } = event.args;
          // Only log events related to the specific wallet
          if (user === currentPlayerWallet) {
            console.log(`Tokens claimed for for wallet ${currentPlayerWallet}:`, {
              user,
              amount,
            });
            showToastrSuccessClaim();
          }
        });
      },
    });

  };
}
