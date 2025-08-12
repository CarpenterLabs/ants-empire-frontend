import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import WelcomePackView from '../views/WelcomePackView';
import WelcomePackBloc from '../bloc/WelcomePackBloc';
import { MainProvidersPropTypes } from '@ComponentsRoot/core/types/MainProvidersPropTypes';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import MainHelmet from '@ComponentsRoot/core/MainHelmet';

class WelcomePackProvider extends PureComponent<MainProvidersPropTypes, any> {
  private readonly bloc: WelcomePackBloc;

  constructor(props: MainProvidersPropTypes) {
    super(props);
    this.bloc = new WelcomePackBloc(this.props.outletContext as OutletContextType);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <WelcomePackView data={snapshot.data} bloc={this.bloc} />
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

export default WelcomePackProvider;
