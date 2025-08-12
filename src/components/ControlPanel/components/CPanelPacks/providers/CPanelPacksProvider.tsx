import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import ErrorHandlerProvider from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import CPanelPacksView from '../views/CPanelPacksView';
import CPanelPacksBloc from '../bloc/CPanelPacksBloc';
import { CPanelPacksBlocProps } from '@ControlPanelComponents/CPanelPacks/types/CPanelPacksSubject';

class CPanelPacksProvider extends PureComponent<CPanelPacksBlocProps> {
  private readonly bloc: CPanelPacksBloc;

  constructor(props: CPanelPacksBlocProps) {
    super(props);
    this.bloc = new CPanelPacksBloc(this.props);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.data.hasError === null) {
      return <CPanelPacksView
        subjectValue={snapshot.data}
        bloc={this.bloc}
        packsTempTabData={this.props.data}
      />;
    } else if (snapshot.data && snapshot.data.hasError !== null && snapshot.connectionState !== -1) {
      return <ErrorHandlerProvider retryFn={this.bloc.resetCPanelPacksBloc} {...snapshot.data.hasError} />;
    } else {
      return <FallbackLoader />;
    }
  };

  render() {
    return <CryptoAntsBlocBuilder subject={this.bloc.getBlocSubjectAsObservable()} builder={this.handleSnapshotChange} />;
  }
}

export default CPanelPacksProvider;
