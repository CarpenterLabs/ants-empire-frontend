import { createConfig, http } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { type Chain } from 'viem';

export const localChainHome = {
  id: 1337,
  name: 'Ants Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['CONTENT REMOVED FOR PRIVACY AND SHOWCASE PURPOSES'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'CONTENT REMOVED FOR PRIVACY AND SHOWCASE PURPOSES' },
  },
} as const satisfies Chain;

export const wagmiProviderConfigLast = createConfig({
  chains: [bscTestnet, localChainHome],
  transports: {
    [localChainHome.id]: http(),
    '97': http(),
  },
});
