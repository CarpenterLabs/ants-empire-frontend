import '@rainbow-me/rainbowkit/styles.css';

import { RainbowKitProvider, darkTheme, Theme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';

const queryClient = new QueryClient();

export const RainBowKitWrapper = (props: any) => {
  const baseTheme = darkTheme({
    accentColor: '#4f3727',
    borderRadius: 'medium',
  });
  const myCustomTheme: Theme = {
    ...baseTheme,
    fonts: {
      ...baseTheme.fonts,
      body: 'inherit',
    },
  };
  return (
    <WagmiProvider config={wagmiProviderConfigLast}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myCustomTheme}>{props.children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
