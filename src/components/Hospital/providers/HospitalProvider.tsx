import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import { PureComponent } from 'react';
import FallbackLoader from '@Layout/components/FallbackLoader';
import HospitalView from '../views/HospitalView';
import HospitalBloc from '../bloc/HospitalBloc';
import { IntlShape } from 'react-intl';
import ColonyRepository from '@Repositories/ColonyRepository';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { renderMainErrorHandler } from '@ComponentsRoot/ErrorHandler/provider/ErrorHandlerProvider';
import { Hospital } from '@ComponentsRoot/Colony/types/RoomType';
import ColonyBloc from '@ComponentsRoot/Colony/bloc/ColonyBloc';

export type HospitalProviderPropsType = {
  colonyRepository: ColonyRepository;
  intl: IntlShape;
  closeModal: () => void;
  refreshColonyData: () => Promise<void>;
  restoreUsedTimes: ColonyBloc["restoreUsedTimes"];
  buyRestorePack: ColonyBloc["buyRestorePack"]
  colonyData: Colony;
  isOpen: boolean;
};

export default class HospitalProvider extends PureComponent<HospitalProviderPropsType, any> {
  private readonly bloc: HospitalBloc;

  constructor(props: HospitalProviderPropsType) {
    super(props);
    this.bloc = new HospitalBloc(this.props);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.connectionState !== -1) {
      return (
        <>
          <HospitalView
            subjectValue={snapshot.data}
            colonyData={this.props.colonyData}
            hospital={this.props.colonyData.rooms.find(room => room.roomId === 6) as Hospital}
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
