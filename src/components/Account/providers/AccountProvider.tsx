import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import AccountView from '../views/AccountView';
import AccountBloc from '../bloc/AccountBloc';
import { MainProvidersPropTypes } from '@ComponentsRoot/core/types/MainProvidersPropTypes';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { componentDidUpdateProviderUtils } from '@ComponentsRoot/core/ProviderUtils';
import MainHelmet from '@ComponentsRoot/core/MainHelmet';

class AccountProvider extends PureComponent<MainProvidersPropTypes, any> {
  private readonly bloc: AccountBloc;

  constructor(props: any) {
    super(props);
    this.bloc = new AccountBloc(this.props.outletContext as OutletContextType);
  }

  componentDidUpdate(prevProps: MainProvidersPropTypes, prevState: any) {
    componentDidUpdateProviderUtils(prevProps, prevState, this);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <AccountView data={snapshot.data} bloc={this.bloc} cryptoAntsApiDS={this.props.outletContext!.nodeApiDS} />
          {snapshot.data.hasError && renderMainErrorHandler(snapshot, this.bloc.resetBloc)}
        </>
      );
    } else {
      return <FallbackLoader />;
    }
  };

  render() {
    return (
      <>
        <MainHelmet
          intl={this.props.outletContext!.intl}
          cfgManager={this.props.outletContext!.configManager}
          currentRoute={this.props.outletContext!.location.pathname}
        />
        <CryptoAntsBlocBuilder subject={this.bloc.getBlocSubjectAsObservable()} builder={this.handleSnapshotChange} />
      </>
    );
  }
}

export default AccountProvider;
