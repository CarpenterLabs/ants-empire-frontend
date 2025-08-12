import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import ErrorHandlerProvider from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import ControlPanelView from '../views/ControlPanelView';
import controlPanelBloc from '../bloc/ControlPanelBloc';
import { MainProvidersPropTypes } from '@ComponentsRoot/core/types/MainProvidersPropTypes';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';

class ControlPanelProvider extends PureComponent<MainProvidersPropTypes> {
  private readonly bloc: controlPanelBloc;

  constructor(props: MainProvidersPropTypes) {
    super(props);
    this.bloc = new controlPanelBloc(this.props.outletContext as OutletContextType);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.data.hasError === null) {
      return <ControlPanelView data={snapshot.data} bloc={this.bloc} />;
    } else if (snapshot.data && snapshot.data.hasError !== null && snapshot.connectionState !== -1) {
      return <ErrorHandlerProvider retryFn={this.bloc.resetControlPanelBloc} {...snapshot.data.hasError} />;
    } else {
      return <FallbackLoader />;
    }
  };

  render() {
    return (
      <>
        {this.props.outletContext &&
        this.props.outletContext.accountData &&
        this.props.outletContext.accountData.dev ? (
          <CryptoAntsBlocBuilder subject={this.bloc.getBlocSubjectAsObservable()} builder={this.handleSnapshotChange} />
        ) : (
          <h5>Account unauthorized</h5>
        )}
      </>
    );
  }
}

export default ControlPanelProvider;
