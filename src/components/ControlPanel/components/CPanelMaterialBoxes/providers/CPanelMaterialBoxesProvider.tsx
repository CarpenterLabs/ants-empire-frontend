import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import CPanelMaterialBoxesView from '../views/CPanelMaterialBoxesView';
import CPanelMaterialBoxesBloc from '../bloc/CPanelMaterialBoxesBloc';
import { CPanelMaterialBoxesBlocProps } from '@ControlPanelComponents/CPanelMaterialBoxes/types/CPanelMaterialBoxesSubject';

class CPanelMaterialBoxesProvider extends PureComponent<CPanelMaterialBoxesBlocProps> {
  private readonly bloc: CPanelMaterialBoxesBloc;

  constructor(props: CPanelMaterialBoxesBlocProps) {
    super(props);
    this.bloc = new CPanelMaterialBoxesBloc(this.props);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <CPanelMaterialBoxesView subjectValue={snapshot.data} bloc={this.bloc} materialBoxesTempTabData={this.props.data} />
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

export default CPanelMaterialBoxesProvider;
