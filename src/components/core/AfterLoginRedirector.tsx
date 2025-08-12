import { useEffect, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import ConfigManager, { RoutesRelationType } from './ConfigManager';
import RepositoryManager from './RepositoryManager';
import { OutletContextType } from './types/OutletContextType';
import { AccountEntity } from '@ComponentsRoot/MetamaskAntsConnector/entity/AccountData';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';

export const AfterLoginRedirector = (props: {
  children: any;
  repositoryManager: RepositoryManager;
  navigate: OutletContextType['navigate'];
  location: OutletContextType['location'];
  cfgManager: ConfigManager;
}) => {
  // const cfgManager = new ConfigManager();
  const [needToRedirect, setNeedToRedirect] = useState<boolean>(true);
  useEffect(() => {
    (async () => {
      await runAfterLoginRedirectorFlow(
        props.repositoryManager,
        setNeedToRedirect,
        props.navigate,
        props.location.pathname,
        props.cfgManager.getRoutesRelation()
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return needToRedirect ? <></> : props.children;
};

const runAfterLoginRedirectorFlow = async (
  repositoryManager: RepositoryManager,
  setNeedToRedirect: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction,
  pathname: string,
  routesObj: RoutesRelationType
) => {
  try {
    // Check if the user is dev and goes to cpanel

    let account: AccountEntity | null = null;
    let accResp: { colony: Colony; account: AccountEntity } | undefined;
    if (pathname.includes('control-panel')) {
      accResp = await repositoryManager.getAccountRepository().getAccountData();
      account = accResp.account;
    }

    if (account && account.dev) {
      setNeedToRedirect(false);
    } else {
      // Check for user Colonies
      // const userColonies = await repositoryManager.getColonyRepository().getUserColonies();

      if (pathname.includes('/market')) {
        setNeedToRedirect(false);
        return;
      }

      if (!accResp) {
        accResp = await repositoryManager.getAccountRepository().getAccountData();
      }
      if (accResp && accResp.colony) {
        setNeedToRedirect(false);
      } else {
        const packsResult = (await repositoryManager.getWelcomePackRepository().getPurchasedPacks()).filter(
          (rp) => rp.state === 'inventory'
        );
        const havePurchased = packsResult.length ? true : false;
        if (pathname !== routesObj.WELCOME_PACK.absolutePath && !havePurchased) {
          setNeedToRedirect(false);
          navigate(routesObj.WELCOME_PACK.absolutePath, { state: { fromLogin: true } });
        } else {
          setNeedToRedirect(false);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
