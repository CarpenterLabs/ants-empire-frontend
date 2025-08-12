import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import CPanelOracleView from '../views/CpanelOracleView';
import CPanelOracleBloc from '../bloc/CpanelOracleBloc';
import { CPanelOracleBlocProps } from '../types/CPanelOracleSubject';

class CpanelOracleProvider extends PureComponent<CPanelOracleBlocProps> {
  private readonly bloc: CPanelOracleBloc;

  constructor(props: CPanelOracleBlocProps) {
    super(props);
    this.bloc = new CPanelOracleBloc(this.props);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <CPanelOracleView subjectValue={snapshot.data} bloc={this.bloc} cpanelOracleData={this.props.data} />
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

export default CpanelOracleProvider;
