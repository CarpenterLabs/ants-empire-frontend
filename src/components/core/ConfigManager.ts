// import { bscTestnet } from 'viem/chains';
import { IntlShape } from 'react-intl';
import { localChainHome } from './blockchain/wagmiConfig';

export type RoutesRelationType = { [key: string]: { relPath: string; absolutePath: string } };
export default class ConfigManager {
  isRightChainIdSelected = (chainId: number): boolean => {
    return !(chainId !== localChainHome.id);
  };

  getApiEndpointByEnvironment = () => {
    const currentEnv = (import.meta.env.VITE_HOST_ENV as string).trim().toUpperCase();

    switch (currentEnv) {
      case 'LOCAL':
        return import.meta.env.VITE_API_ENDPOINT_LOCAL;
      case 'PROD':
        return import.meta.env.VITE_API_ENDPOINT_PROD;
      case 'NAS':
        return import.meta.env.VITE_API_ENDPOINT_NAS;
      default:
        return import.meta.env.VITE_API_ENDPOINT_LOCAL;
    }
  };

  getRoutesRelation = (): RoutesRelationType => {
    return {
      MAINGAME: {
        absolutePath: '/game',
        relPath: '/game',
      },
      ACCOUNT: {
        absolutePath: '/game/account',
        relPath: 'account',
      },
      ANT: {
        absolutePath: '/game/ant',
        relPath: 'ant',
      },
      INVENTORY: {
        absolutePath: '/game/inventory',
        relPath: 'inventory',
      },
      CPANEL: {
        absolutePath: '/game/control-panel',
        relPath: 'control-panel',
      },
      WELCOME_PACK: {
        absolutePath: '/game/welcome-pack',
        relPath: 'welcome-pack',
      },
      COLONIES: {
        absolutePath: '/game/colonies',
        relPath: 'colonies',
      },
      COLONY_DETAIL: {
        absolutePath: '/game/colony/:id',
        relPath: 'colony/:id',
      },
      COLONY_DETAIL_STYLE: {
        absolutePath: '/game/colonyStyle/:id',
        relPath: 'colonyStyle/:id',
      },
      SHOP: {
        absolutePath: '/game/shop',
        relPath: 'shop',
      },
      FAUCET: {
        absolutePath: '/game/faucet',
        relPath: 'faucet',
      },
      MARKET: {
        absolutePath: '/game/market',
        relPath: 'market',
      },
    };
  };

  getHelmetConfigByRoutes = (intl: IntlShape) => {
    const routesRel = this.getRoutesRelation();
    return [
      { path: routesRel.MAINGAME.absolutePath, hemletCfg: { title: 'Game', description: 'main game desc' } },
      {
        path: routesRel.ANT.absolutePath,
        hemletCfg: { title: intl.formatMessage({ id: 'meta.antlist.title' }), description: 'ant page description' },
      },
      { path: routesRel.ACCOUNT.absolutePath, hemletCfg: { title: 'Account', description: 'account page description' } },
      {
        path: routesRel.INVENTORY.absolutePath,
        hemletCfg: { title: intl.formatMessage({ id: 'inventory.title' }), description: 'inventory page description' },
      },
      {
        path: routesRel.WELCOME_PACK.absolutePath,
        hemletCfg: { title: 'Welcome Packs', description: 'wpacks page description' },
      },
      { path: routesRel.COLONIES.absolutePath, hemletCfg: { title: 'Colonies', description: 'Colonies page description' } },
      { path: routesRel.COLONY_DETAIL.absolutePath, hemletCfg: { title: 'Your Colony', description: 'Colony page description' } },
      { path: routesRel.SHOP.absolutePath, hemletCfg: { title: 'Shop', description: 'shop page description' } },
      {
        path: routesRel.FAUCET.absolutePath,
        hemletCfg: { title: 'Nectar Faucet', description: 'Nectar faucet to claim NCTR TST' },
      },
      { path: routesRel.MARKET.absolutePath, hemletCfg: { title: 'Market', description: 'Market to sell and buy Ants NFTs' } },
      { path: routesRel.CPANEL.absolutePath, hemletCfg: { title: 'Cpanel', description: 'cpanel page description' } }, //TODELETE
    ];
  };
}
