import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
// import cryptoAntsApiDS from '@DataSource/cryptoAntsApiDS';
import { PureComponent } from 'react';
import ErrorHandlerProvider from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import MainGameLayoutBloc from '../bloc/MainGameLayoutBloc';
import MainGameLayoutView from '../views/MainGameLayoutView';
import NodeApiDS from '@DataSource/NodeApiDS';
import RepositoryManager from '@ComponentsRoot/core/RepositoryManager';
import AxiosClient from '@Services/AxiosClient';
import ConfigManager from '@ComponentsRoot/core/ConfigManager';
import SocketIOService from '@Services/SocketIOService';

class MainGameLayoutProvider extends PureComponent<{ intl: any }> {
  private readonly bloc: MainGameLayoutBloc;
  nodeApiDS: NodeApiDS;
  repositoryManager: RepositoryManager;
  cfgManager: ConfigManager;
  socketIOService: SocketIOService;

  constructor(props: any) {
    super(props);
    this.cfgManager = new ConfigManager();
    this.nodeApiDS = new NodeApiDS(new AxiosClient(this.cfgManager));
    this.socketIOService = new SocketIOService(this.cfgManager.getApiEndpointByEnvironment());
    this.repositoryManager = new RepositoryManager(this.nodeApiDS);

    //set accountrepo to nodeApiDS
    this.nodeApiDS.setAccountRepo(this.repositoryManager.getAccountRepository());

    this.bloc = new MainGameLayoutBloc({
      intl: this.props.intl,
      nodeApiDS: this.nodeApiDS,
      repositoryManager: this.repositoryManager,
      socketIOService: this.socketIOService,
    });
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.data.hasError === null) {
      return <MainGameLayoutView data={snapshot.data} bloc={this.bloc} nodeApiDS={this.nodeApiDS} />;
    } else if (snapshot.data && snapshot.data.hasError !== null && snapshot.connectionState !== -1) {
      return (
        <ErrorHandlerProvider
          clearUserSignedToken={this.bloc.clearUserSignedToken}
          retryFn={this.bloc.resetBloc}
          {...snapshot.data.hasError}
        />
      );
    } else {
      return <></>;
    }
  };

  render() {
    return <CryptoAntsBlocBuilder subject={this.bloc.getBlocSubjectAsObservable()} builder={this.handleSnapshotChange} />;
  }
}

export default MainGameLayoutProvider;
