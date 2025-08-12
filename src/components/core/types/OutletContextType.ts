import MainGameLayoutBloc from '@ComponentsRoot/Game/bloc/MainGameLayoutBloc';
import { AccountEntity } from '@ComponentsRoot/MetamaskAntsConnector/entity/AccountData';
import NodeApiDS from '@DataSource/NodeApiDS';
import { Location, NavigateFunction } from 'react-router-dom';
import ConfigManager from '../ConfigManager';
import RepositoryManager from '../RepositoryManager';
import { IntlShape } from 'react-intl/src/types';
import SocketIOService from '@Services/SocketIOService';

export type OutletContextType = {
  refreshAccountDataFn: MainGameLayoutBloc['setAccountData'];
  clearUserSignedToken: MainGameLayoutBloc['clearUserSignedToken'];
  accountData: AccountEntity | null;
  intl: IntlShape;
  nodeApiDS: NodeApiDS;
  repositoryManager: RepositoryManager;
  configManager: ConfigManager;
  navigate: NavigateFunction;
  location: Location;
  socketIOService: SocketIOService
  setLayoutVariant: React.Dispatch<React.SetStateAction<string | null>>
};
