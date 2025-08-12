import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
// import cryptoAntsApiDS from '@DataSource/cryptoAntsApiDS';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import MintView from '../views/AntView';
import AntBloc from '../bloc/AntBloc';
import { MainProvidersPropTypes } from '@ComponentsRoot/core/types/MainProvidersPropTypes';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { componentDidUpdateProviderUtils } from '@ComponentsRoot/core/ProviderUtils';
import MainHelmet from '@ComponentsRoot/core/MainHelmet';

class AntProvider extends PureComponent<MainProvidersPropTypes, any> {
  private readonly bloc: AntBloc;

  constructor(props: MainProvidersPropTypes) {
    super(props);
    this.bloc = new AntBloc(this.props.outletContext as OutletContextType);
  }

  componentDidUpdate(prevProps: MainProvidersPropTypes, prevState: any) {
    componentDidUpdateProviderUtils(prevProps, prevState, this);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <MintView data={snapshot.data} bloc={this.bloc} />
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

export default AntProvider;
