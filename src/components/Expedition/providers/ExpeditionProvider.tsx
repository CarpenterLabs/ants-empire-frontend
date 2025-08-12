import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import FallbackLoader from '@Layout/components/FallbackLoader';
import ExpeditionView from '../views/ExpeditionView';
import ExpeditionBloc from '../bloc/ExpeditionBloc';
import ColonyRepository from '@Repositories/ColonyRepository';
import { IntlShape } from 'react-intl';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import ColonyBloc from '@ComponentsRoot/Colony/bloc/ColonyBloc';
import MainGameLayoutBloc from '@ComponentsRoot/Game/bloc/MainGameLayoutBloc';

export type ExpeditionProviderPropsType = {
  colonyRepository: ColonyRepository;
  intl: IntlShape;
  closeModal: ExpeditionBloc['closeModal'];
  toggleDetailDestinationModal: ColonyBloc['toggleDetailDestinationDialog'];
  colonyData: Colony;
  isOpen: boolean;
  detailIsOpen: boolean;
  restartExpeditions: ColonyBloc['restartExpeditions'];
  refreshAccountDataFn: MainGameLayoutBloc['setAccountData'];
  refreshColonyData: ColonyBloc['refreshColonyData'];
};

class ExpeditionProvider extends PureComponent<ExpeditionProviderPropsType, any> {
  private readonly bloc: ExpeditionBloc;

  constructor(props: ExpeditionProviderPropsType) {
    super(props);
    this.bloc = new ExpeditionBloc(this.props);
  }

  componentDidUpdate(prevProps: Readonly<ExpeditionProviderPropsType>, prevState: Readonly<any>, snapshot?: any): void {
    if (this.props.colonyData['purchasedPwrTickets'] !== prevProps.colonyData['purchasedPwrTickets']) {
      // upgrade the subject value variable of purchasedPwrTickets
      this.bloc.setPurchasedPwrTicketsValueOnSubj(this.props.colonyData.purchasedPwrTickets);
    }
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <ExpeditionView
            subjectValue={snapshot.data}
            colonyData={this.props.colonyData}
            bloc={this.bloc}
            isOpen={this.props.isOpen}
            detailIsOpen={this.props.detailIsOpen}
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

export default ExpeditionProvider;
