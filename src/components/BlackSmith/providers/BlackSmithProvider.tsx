import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import BlackSmithView from '../views/BlackSmithView';
import BlackSmithBloc from '../bloc/BlackSmithBloc';
import ColonyRepository from '@Repositories/ColonyRepository';
import { IntlShape } from 'react-intl';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';

export type BlackSmithProviderPropsType = {
  colonyRepository: ColonyRepository;
  intl: IntlShape;
  closeModal: () => void;
  refreshColonyData: () => Promise<void>;
  colonyData: Colony;
  isOpen: boolean;
};

export default class BlackSmithProvider extends PureComponent<BlackSmithProviderPropsType, any> {
  private readonly bloc: BlackSmithBloc;

  constructor(props: BlackSmithProviderPropsType) {
    super(props);
    this.bloc = new BlackSmithBloc(this.props);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <BlackSmithView
            subjectValue={snapshot.data}
            colonyData={this.props.colonyData}
            blackSmith={this.props.colonyData.blackSmith}
            bloc={this.bloc}
            isOpen={this.props.isOpen}
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
