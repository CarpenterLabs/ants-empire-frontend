import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import TavernView from '../views/TavernView';
import TavernBloc from '../bloc/TavernBloc';
import { IntlShape } from 'react-intl';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import ColonyBloc from '@ComponentsRoot/Colony/bloc/ColonyBloc';
import MainGameLayoutBloc from '@ComponentsRoot/Game/bloc/MainGameLayoutBloc';
import FarmingQuestRepository from '@Repositories/FarmingQuestRepository';
import WelcomePackRepository from '@Repositories/WelcomePackRepository';

export type TavernProviderPropsType = {
  farmingQuestRepository: FarmingQuestRepository;
  wPackRepo: WelcomePackRepository;
  intl: IntlShape;
  closeModal: () => void;
  colonyData: Colony;
  isOpen: boolean;
  refreshAccountDataFn: MainGameLayoutBloc['setAccountData'];
  refreshColonyData: ColonyBloc['refreshColonyData'];
};

class TavernProvider extends PureComponent<TavernProviderPropsType, any> {
  private readonly bloc: TavernBloc;

  constructor(props: TavernProviderPropsType) {
    super(props);
    this.bloc = new TavernBloc(this.props);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <TavernView
            subjectValue={snapshot.data}
            colonyData={this.props.colonyData}
            bloc={this.bloc}
            isOpen={this.props.isOpen}
            refreshColonyData={this.props.refreshColonyData}
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

export default TavernProvider;
