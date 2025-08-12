import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import MetamaskAntsConnectorBloc from '../bloc/MetamaskAntsConnectorBloc';
import MainGameLayoutBloc from '@ComponentsRoot/Game/bloc/MainGameLayoutBloc';
import { MainGameLayoutProviderPropsType } from '@ComponentsRoot/core/types/MainProvidersPropTypes';
import { AccountEntity } from '../entity/AccountData';
import AntsWalletConnectorView from '../view/AntsWalletConnectorView';

export type AntsWalletConnectorProviderProps = {
  setTokenFn: MainGameLayoutBloc['setUserSignedToken'];
  signedToken: string | null;
  mainProviderProps: MainGameLayoutProviderPropsType;
  accountDataHandlers: {
    clearUserSignedToken: MainGameLayoutBloc['clearUserSignedToken'];
    accountData: AccountEntity | null;
    refreshAccountData: MainGameLayoutBloc['setAccountData'];
  };
};

class MetamaskAntsConnectorProvider extends PureComponent<AntsWalletConnectorProviderProps, any> {
  private readonly bloc: MetamaskAntsConnectorBloc;

  constructor(props: AntsWalletConnectorProviderProps) {
    super(props);
    this.bloc = new MetamaskAntsConnectorBloc(this.props);
  }

  componentDidUpdate = async (prevProps: AntsWalletConnectorProviderProps, prevState: any) => {
    if (prevProps.signedToken !== this.props.signedToken) {
      if (prevProps.signedToken && !this.props.signedToken) {
        // Need to force user to sign the contract again to generate new token
        this.bloc.clearContractToSignNewOne();
      } else {
        await this.props.accountDataHandlers.refreshAccountData();
      }
    }
  };

  //new
  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          
          <AntsWalletConnectorView
            accountData={this.props.accountDataHandlers.accountData}
            subjectData={snapshot.data}
            bloc={this.bloc}
          />
          {snapshot.data.hasError && renderMainErrorHandler(snapshot, this.bloc.resetBloc)}
        </>
      );
    } else {
      return <FallbackLoader />;
    }
  };

  render() {
    return <CryptoAntsBlocBuilder subject={this.bloc.getBlocSubjectAsObservable()} builder={this.handleSnapshotChange} />;
  }
}

export default MetamaskAntsConnectorProvider;
