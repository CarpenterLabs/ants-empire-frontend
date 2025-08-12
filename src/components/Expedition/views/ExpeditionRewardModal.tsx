import PackCard from '@ComponentsRoot/WelcomePack/views/PackCard';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import ExpeditionBloc from '../bloc/ExpeditionBloc';
import Style from '../styles/expeRewardModal.module.scss';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { ExpeditionReward } from '../types/ExpeditionReward';
import PowerTicketCard from './PowerTicketCard';
import { PowerTicket, PurchasedPowerTicket } from '../types/PowerTicket';
import { IntlShape } from 'react-intl';
import PowerTicketAntAssigner from './PowerTicketAntAssigner';
import UpgradedAntModal from '@ComponentsRoot/Ant/views/UpgradedAntModal';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useOutletContext } from 'react-router/dist';

const ExpeditionRewardModal = (props: {
  handleCloseModalFn: () => void;
  intl: IntlShape;
  bloc: ExpeditionBloc;
  expeRewardData: ExpeditionReward[] | null;
  packRevealed: Ant[] | null;
  colonyId: string;
  destinationId: number;
  currentSuccessCount?: number;
}) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();

  const mountExpeditionRewardModalBody = () => {
    const subjVal = props.bloc.getSubjectValue();
    //const sortedPacks = props.expeRewardData ? [...props.expeRewardData].sort((a, b) => a.weight - b.weight) : [];
    return (
      <div className={`${Style.expeRewardModal} fadeIn`}>
        <div className='expeRewardInfoZone'>
          <div className='subtitle'>
            <span>Expedition</span>
            <span className='yw'>{props.destinationId}</span>
            {/* <span>Rewards</span> */}
          </div>
          <div className='currentWins'>
            <>
              <span className='big'>
                Current Wins: <span className='yw'>{props.currentSuccessCount ?? 0}</span>
              </span>
              <span className='small'>
                Wins: <span className='yw'>{props.currentSuccessCount ?? 0}</span>
              </span>
            </>
          </div>
        </div>
        {props.expeRewardData && props.expeRewardData.length ? (
          <>
            <div className='listAvailableRewards'>
              {props.expeRewardData.map((reward, key: number) => {
                if (reward.type === 'MINT') {
                  return (
                    <PackCard
                      key={key}
                      expeReward={reward}
                      buyPack={props.bloc.buyPack}
                      packRevealed={props.packRevealed}
                      colonyId={props.colonyId}
                      outletVal={outletContext}
                    />
                  );
                } else if (reward.type === 'POWERTICKET') {
                  return (
                    <PowerTicketCard
                      key={key}
                      buyPowerTicket={props.bloc.buyPowerTicket}
                      expeReward={reward}
                      ticket={reward.matchedItem as PowerTicket}
                      purchasedPowerTickets={props.bloc.getSubjectValue().purchasedPwrTickets}
                      togglePowerTicketAssigner={(powerTicket: PurchasedPowerTicket) =>
                        props.bloc.togglePowerTicketAssigner(powerTicket)
                      }
                    />
                  );
                }

                return <></>;
              })}
            </div>
          </>
        ) : (
          ''
        )}

        {/* //SHOW POWERTICKET ASSIGNER MODAL */}
        {subjVal.isPowerTicketAssignerModalOpen && subjVal.powerTicketToAssign && (
          <PowerTicketAntAssigner
            intl={props.intl}
            isPowerTicketAssignerOpen={subjVal.isPowerTicketAssignerModalOpen}
            addPowerToSelectedAntFn={props.bloc.usePowerTicket}
            ants={props.bloc.getAntsOnColony()}
            handleCloseModalFn={props.bloc.togglePowerTicketAssigner}
            purchasedPowerTicket={subjVal.powerTicketToAssign!}
          />
        )}

        {/* // SHOW MODAL OF THE EXCHANGED POWER TICKET RESULT */}
        {subjVal.pwrTicketUpgradeResult && (
          <UpgradedAntModal
            intl={props.intl}
            ant={subjVal.pwrTicketUpgradeResult}
            handleCloseModalFn={async () => {
              await props.bloc.closeUpgradedAntModal();
            }}
          />
        )}
      </div>
    );
  };

  const mountModalTitle = () => {
    return (
      <div className={Style.expeRewardModalHeader}>
        <div className='expeRewardTitleZone'>
          {/* <span>
            {props.bloc.providerProps.intl.formatMessage(
              {
                id: 'expedition.expeditionReward',
              },
              { destinationId: props.destinationId }
            )}
          </span>
          {props.currentSuccessCount ? <span>Current wins: {`${props.currentSuccessCount}`}</span> : <></>} */}
          <span>{props.intl.formatMessage({ id: 'expedition.rewards' })}</span>
        </div>
      </div>
    );
  };

  return (
    <CustomModal
      class={Style.expeRewardModal}
      size={'xl'}
      body={mountExpeditionRewardModalBody()}
      open
      // class={Style.RewardPackModal}
      title={mountModalTitle()}
      togglerModal={props.handleCloseModalFn}
      modalHeaderClassName='standarModalHeader'
    />
  );
};

export default ExpeditionRewardModal;
