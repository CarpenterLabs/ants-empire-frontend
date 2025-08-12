import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import ColonyBloc from '@ComponentsRoot/Colony/bloc/ColonyBloc';
import CoolDownExpedition from '@ComponentsRoot/Colony/views/CoolDownExpedition';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';
import ExpeditionBloc from '../bloc/ExpeditionBloc';
import Style from '../styles/expeditionView.module.scss';
import { ExpeditionSubject } from '../types/ExpeditionSubject';
import DestinationDetail from './DestinationDetail';
import ExpeditionHistoryModal from './ExpeditionHistoryModal';
import ExpeditionRewardModal from './ExpeditionRewardModal';
import RevealPackModal from './RevealPackModal';
import TimeLineView from './TimeLineView';

const ExpeditionView = (props: {
  subjectValue: ExpeditionSubject;
  colonyData: Colony;
  bloc: ExpeditionBloc;
  isOpen: boolean;
  detailIsOpen: boolean;
  refreshColonyData: ColonyBloc['refreshColonyData'];
}) => {
  useEffect(() => {
    (async () => {
      await props.bloc.getExpeditionData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sizeNumber = (number: number) => {
    if (number >= 1000) {
      return 'small';
    } else if (number >= 100) {
      return 'middle';
    }
  };

  const mountExpeditionModalHeader = () => {
    return (
      <div className={Style.expeditionModalHeader}>
        <div className='expemodalheader'>
          <div style={{ paddingTop: '5px' }}>
            <FormattedMessage id={`expedition.title`} />
          </div>
          <div className='historyBtnRegion'>
            <Button onClick={() => props.bloc.toggleExpeHistoryModal(true)} className='fadeIn expeHistoryBtn'>
              <span>
                <FormattedMessage id={`expedition.historyShort`} />
              </span>
              <img style={{ width: '25px' }} src='/images/finals/icons/map.png' alt='Map icon' />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const mountExpeditionsBody = () => {
    return (
      <div className={`${Style.expeditionView} fadeIn`}>
        <div className='general-expeditions-container'>
          <div className='container-img' />
          <div className='container-values'>
            <div className='box-values'>
              <p className={`status-text ${props.subjectValue.expeditionsData?.isAbleToStartExpedition}`}>
                <FormattedMessage id={`expedition.status.${props.subjectValue.expeditionsData?.isAbleToStartExpedition}`} />
                {!props.subjectValue.expeditionsData?.isAbleToStartExpedition && (
                  <CoolDownExpedition
                    cooldown_minutes={props.subjectValue.expeditionsData!.timeRemainingToStart}
                    refreshColony={props.refreshColonyData}
                    colony={props.colonyData}
                  />
                )}
              </p>
            </div>
            <div className='box-values'>
              <div className='box-type'>
                <img className={`type worker`} src={`/images/worker.png`} alt='' />
                <div className='power'>
                  <span className={`rarity ${sizeNumber(Number(props.subjectValue.expeditionsData?.totalWorkerPower))} `}>
                    {props.subjectValue.expeditionsData?.totalWorkerPower}
                  </span>
                </div>
              </div>
            </div>

            <div className='box-values'>
              <div className='box-type'>
                <img className={`type soldier`} src={`/images/soldier.png`} alt='' />
                <div className='power'>
                  <span className={`rarity ${sizeNumber(Number(props.subjectValue.expeditionsData?.totalSoldierPower))}`}>
                    {props.subjectValue.expeditionsData?.totalSoldierPower}
                  </span>
                </div>
              </div>
            </div>

            <div className='box-values'>
              <div className='box-type'>
                <img className={`type flying`} src={`/images/flying.png`} alt='' />
                <div className='power'>
                  <span className={`rarity ${sizeNumber(Number(props.subjectValue.expeditionsData?.totalFlyingPower))}`}>
                    {props.subjectValue.expeditionsData?.totalFlyingPower}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='container-expeditions'>
            <TimeLineView
              destinations={props.subjectValue.expeditionsData!.destinations}
              toggleDetailDestinationModal={props.bloc.toggleDetailDestinationModal}
              isAbleToStartExpedition={props.subjectValue.expeditionsData!.isAbleToStartExpedition}
              toggleExpeRewardsModal={props.bloc.toggleExpeditionRewards}
              expeRewards={props.subjectValue.expeRewardData!}
            />
          </div>
        </div>
      </div>
    );
  };

  const getCurrentSuccessCountByDestination = (destId: number) => {
    return props.subjectValue.allExpeditionHistory?.filter((histExpe) => histExpe.success && histExpe.destinationId === destId)
      .length;
  };

  return (
    <>
      {props.isOpen && (
        <>
          {props.subjectValue.expeditionsData && props.subjectValue.expeditionsData.destinations ? (
            <>
              <CustomModal
                // largeHeader
                class={`xxl ${props.subjectValue.resultExpedition && 'finished'} expeModalMain`}
                size={'xl'}
                body={mountExpeditionsBody()}
                open
                title={mountExpeditionModalHeader()}
                togglerModal={() => props.bloc.closeModal()}
                modalHeaderClassName='standarModalHeader expe'
                centered={false}
              />

              {/* DESTINATION DETAIL MODAL RENDERING CONDITION */}
              {props.detailIsOpen && props.subjectValue.destinationDetailSelected && (
                <DestinationDetail
                  bloc={props.bloc}
                  colonyData={props.colonyData}
                  destination={props.subjectValue.destinationDetailSelected}
                  antsSelected={props.subjectValue.selectedExpeditionAnts}
                  dataSelectedAnts={props.subjectValue.dataSelectedAnts}
                  resultExpedition={props.subjectValue.resultExpedition}
                />
              )}

              {/* EXPEDITIONS HISTORY MODAL RENDERING CONDITION */}
              {props.subjectValue.isExpeHistoryModalOpen && props.subjectValue.allExpeditionHistory && (
                <ExpeditionHistoryModal
                  destinations={props.subjectValue.expeditionsData.destinations}
                  expeditionHistory={props.subjectValue.allExpeditionHistory}
                  intl={props.bloc.providerProps.intl}
                  handleCloseModalFn={() => props.bloc.toggleExpeHistoryModal(false)}
                  isExpeHistoryModalOpen
                />
              )}

              {/* EXPEDITIONS REWARDPACKS MODAL RENDERING CONDITION */}
              {props.subjectValue.isExpeRewardModalOpen && props.subjectValue.expeRewardData && (
                <ExpeditionRewardModal
                  intl={props.bloc.providerProps.intl}
                  handleCloseModalFn={() => props.bloc.toggleExpeditionRewards(false)}
                  bloc={props.bloc}
                  expeRewardData={props.subjectValue.expeRewardData.filter(
                    (reward) => reward.destinationId === props.subjectValue.rewardModalDestId
                  )}
                  packRevealed={props.subjectValue.packRevealed}
                  colonyId={props.colonyData._id}
                  destinationId={props.subjectValue.rewardModalDestId!}
                  currentSuccessCount={getCurrentSuccessCountByDestination(props.subjectValue.rewardModalDestId!)}
                />
              )}

              {props.subjectValue.packRevealed && (
                <RevealPackModal
                  intl={props.bloc.providerProps.intl}
                  handleCloseModalFn={() => () => null}
                  packRevealed={props.subjectValue.packRevealed}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </>
      )}
      {renderLoaderIfNeeded(props.subjectValue.isLoading)}
      {renderToastrIfNeeded(props.subjectValue.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
    </>
  );
};

export default ExpeditionView;
