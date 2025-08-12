import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import MarketView from '../views/MarketView';
import MarketBloc from '../bloc/MarketBloc';
import { MainProvidersPropTypes } from '@ComponentsRoot/core/types/MainProvidersPropTypes';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import MainHelmet from '@ComponentsRoot/core/MainHelmet';

class MarketProvider extends PureComponent<MainProvidersPropTypes, any> {
  private readonly bloc: MarketBloc;

  constructor(props: MainProvidersPropTypes) {
    super(props);
    this.bloc = new MarketBloc(this.props.outletContext as OutletContextType);
  }

  async componentDidUpdate(prevProps: MainProvidersPropTypes, prevState: any) {
    if (prevProps.outletContext?.accountData !== this.props.outletContext?.accountData) {
      this.bloc.providerProps = this.props.outletContext as OutletContextType;
      if (!this.props.outletContext?.accountData) {
        //Not logged, clean axios headers to prevent passing auth
        this.props.outletContext?.repositoryManager.authRepository.deleteAuthHeaderAndPlayerAddress();
        await this.bloc.getMarketData();
      } else {
        //Logged
        await this.bloc.getMarketData();
      }
    }
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <MarketView data={snapshot.data} bloc={this.bloc} isGuest={!Boolean(this.props.outletContext?.accountData)} />
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

export default MarketProvider;
