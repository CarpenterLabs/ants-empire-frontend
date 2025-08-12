export type MetamaskAntsConnectorSubject = {
  isLoading: boolean;
  needToSignContract: boolean;
  signature: string | null;
  hasError: null | any;
  nectarBalanceOnChain?: string;
  usdtBalanceOnChain?: string;
};
