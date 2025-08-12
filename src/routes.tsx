import ConfigManager from '@ComponentsRoot/core/ConfigManager';
import { MainGameWrapperWithUseOutletContext } from '@ComponentsRoot/core/CryptoAntsPropsInjector';
import React from 'react';
import { useIntl } from 'react-intl';
import { useRoutes } from 'react-router-dom';

const Account = React.lazy(() => import('@ComponentsRoot/Account/providers/AccountProvider'));
const Ant = React.lazy(() => import('@ComponentsRoot/Ant/providers/AntProvider'));
const ControlPanel = React.lazy(() => import('@ControlPanelComponents/CPanelStandard/providers/ControlPanelProvider'));
const InventoryProvider = React.lazy(() => import('@ComponentsRoot/Inventory/providers/InventoryProvider'));
const WelcomePack = React.lazy(() => import('@ComponentsRoot/WelcomePack/providers/WelcomePackProvider'));
const Colonies = React.lazy(() => import('@ComponentsRoot/Colonies/providers/ColoniesProvider'));
const ColonyDetail = React.lazy(() => import('@ComponentsRoot/Colony/providers/ColonyProvider'));
const ColonyDetailStyle = React.lazy(() => import('@ComponentsRoot/ColonyNewStyle/providers/ColonyProvider'));
const ShopProvider = React.lazy(() => import('@ComponentsRoot/Shop/providers/ShopProvider'));
const FaucetProvider = React.lazy(() => import('@ComponentsRoot/Faucet/providers/FaucetProvider'));
const MarketProvider = React.lazy(() => import('@ComponentsRoot/Market/providers/MarketProvider'));

const GameHome = React.lazy(() => import('@ComponentsRoot/Game/providers/MainGameLayoutProvider'));
const Layout3 = React.lazy(() => import('@Layout/views/Layout3/Layout3'));

const AntsEmpireRouter = () => {
  const cfgManager = new ConfigManager();
  const routesRelationObj = cfgManager.getRoutesRelation();
  const intl = useIntl();
  const routes = useRoutes([
    { path: '/', element: <Layout3 intl={intl} configManager={cfgManager} /> },
    {
      path: routesRelationObj.MAINGAME.relPath,
      element: <GameHome intl={intl} />,
      // Nested routes use a children property, which is also
      // the same as <Route>
      children: [
        {
          path: routesRelationObj.ACCOUNT.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <Account />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.ANT.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <Ant />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.INVENTORY.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <InventoryProvider />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.CPANEL.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <ControlPanel />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.WELCOME_PACK.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <WelcomePack />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.COLONIES.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <Colonies />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.COLONY_DETAIL.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <ColonyDetail />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.COLONY_DETAIL_STYLE.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <ColonyDetailStyle />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.SHOP.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <ShopProvider />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.FAUCET.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <FaucetProvider />
            </MainGameWrapperWithUseOutletContext>
          ),
        },
        {
          path: routesRelationObj.MARKET.relPath,
          element: (
            <MainGameWrapperWithUseOutletContext>
              <MarketProvider />
            </MainGameWrapperWithUseOutletContext>
          ),
        }       
      ],
    },
    { path: '*', element: <p>Not FOUND</p> },
    // ...
  ]);
  return routes;
};

export { AntsEmpireRouter };
