import Style from '../styles/expeditionHistoryModal.module.scss';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Expeditions } from '../types/Expeditions';
import { ExpeditionHistory } from '../types/ExpeditionsHistory';
import { DateTime } from 'luxon';

const ExpeditionHistoryModal = (props: {
  expeditionHistory: ExpeditionHistory[];
  handleCloseModalFn: () => void;
  isExpeHistoryModalOpen: boolean;
  intl: IntlShape;
  destinations: Expeditions['destinations'];
}) => {
  const getDestinationNameTranslated = (destinationId: number) => {
    return props.intl.formatMessage({
      id: 'expedition.name.' + props.destinations.find((destination) => destination.destinationId === destinationId)?.name_i18n,
    });
  };

  const renderTimeStamp = (timestamp: string) => {
    const dateInUTC = DateTime.fromISO(timestamp).setZone('utc');
    const formattedDate = dateInUTC.toFormat('d/M/yyyy, H:mm');
    return formattedDate;
  };

  const getGridMounted = () => {
    return (
      <div className='discountByLvlsInfoZone'>
        <div className='inside header'>
          <span className='headerCell'>
            <img style={{ width: '25px' }} src='/images/finals/icons/map.png' alt='map' />{' '}
            {props.intl.formatMessage({ id: 'expeHist.destName' })}
          </span>
          <span className='headerCell'>
            <img style={{ width: '25px' }} src='/images/finals/icons/trophy.png' alt='trophy' />
            {props.intl.formatMessage({ id: 'expeHist.neededRoll' })}
          </span>
          <span className='headerCell'>
            <img style={{ width: '28px' }} src='/images/finals/icons/dice.png' alt='dices' />{' '}
            {props.intl.formatMessage({ id: 'expeHist.yourRoll' })}
          </span>
          <span className='headerCell'>
            <img style={{ width: '20px' }} src='/images/finals/icons/seller_cd_icon.png' alt='cooldown' />{' '}
            {props.intl.formatMessage({ id: 'expeHist.date' })}
          </span>
        </div>
        <div className={`inside levelRow`}>
          {props.expeditionHistory.map((expeditionHistory, idx) => (
            <div className={`cell ${idx % 2 ? 'even' : 'odd'} ${expeditionHistory.success ? 'ok' : 'ko'}`} key={idx}>
              <div className='destinationNameContainer'>
                <span className='destinationName'>
                  <img
                    style={{ width: '23px' }}
                    src={
                      expeditionHistory.success
                        ? '/images/finals/icons/check_flag.png'
                        : '/images/finals/icons/fail_icon.png'
                    }
                    alt='successIcon'
                  />
                  {getDestinationNameTranslated(expeditionHistory.destinationId)} - {expeditionHistory.destinationId}
                </span>
              </div>
              <span className='fw-bolder'>{`${expeditionHistory.finalSuccessRate} or below`}</span>
              <span className='fw-bolder'>{`${expeditionHistory.player_roll_result}`}</span>
              <span className='fw-bolder'>{renderTimeStamp(expeditionHistory.timestamp as string)}</span>
              {/* </div> */}
            </div>
          ))}

          {/* {Object.keys(workshop.discount_by_levels![workshop.level! + 1]).map((discountKey, toolIndex) => (
                    <div className='cell' key={discountKey}>
                      {workshop.discount_by_levels![workshop.level! + 1][discountKey].map((cost, idx) => (
                        <span className='costData' key={idx}>
                          {getMaterialEmojiByToolRequirement(toolIndex + 1, cost.materialId, '25px')} {cost.quantity}
                        </span>
                      ))}
                    </div>
                  ))} */}
        </div>
      </div>
    );
  };

  const mountExpeditionHistoryModalBody = () => {
    return (
      <>
        <div className='expeditionHistoryMainRegion'>
          {/* {props.expeditionHistory.map((expeditionHistory, idx) => (
            <div className={`entry ${expeditionHistory.success ? 'ok' : 'ko'}`} key={idx}>
              <div className='box-info d-flex'>
                <div> {expeditionHistory.success ? '✅' : '❌'}</div>
                <div className='destinationNameContainer'>
                  <span className='destinationName'>
                    {getDestinationNameTranslated(expeditionHistory.destinationId)} - {expeditionHistory.destinationId}
                  </span>
                </div>
              </div>
              <div className='details d-flex'>
                <span>{`🎲 Your Roll: ${expeditionHistory.player_roll_result}`}</span>

                <span>{`🏆 Needed: ${expeditionHistory.finalSuccessRate} or below`}</span>

                <span>
                  {'⌚ '}
                  {renderTimeStamp(expeditionHistory.timestamp as string)}
                </span>
              </div>
            </div>
          ))} */}
          {getGridMounted()}
        </div>
      </>
    );
  };

  return (
    <>
      {props.isExpeHistoryModalOpen && (
        <CustomModal
          size={'lg'}
          body={
            props.expeditionHistory.length ? (
              mountExpeditionHistoryModalBody()
            ) : (
              <FormattedMessage id='expedition.notPlayedAnExpedition' />
            )
          }
          open
          class={Style.expeditionHistoryModal}
          title={<FormattedMessage id='expedition.history' />}
          togglerModal={props.handleCloseModalFn}
          modalHeaderClassName='standarModalHeader'
          centered={false}
        />
      )}
    </>
  );
};

export default ExpeditionHistoryModal;
