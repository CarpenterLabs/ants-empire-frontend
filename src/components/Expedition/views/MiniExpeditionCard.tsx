import { FormattedMessage } from 'react-intl';
import { materialEmojisRelation } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import { Destination } from '../types/Expeditions';
import ExpeditionBloc from '../bloc/ExpeditionBloc';
import { Button } from 'reactstrap';

const MiniExpeditionCard = (props: {
  destination: Destination;
  left: boolean;
  toggleDetailDestinationModal: ExpeditionBloc['toggleDetailDestinationModal'];
  toggleExpeRewardsModal: ExpeditionBloc['toggleExpeditionRewards'];
  isAbleToStartExpedition: boolean;
  hasRewards: boolean;
}) => {
  const sizeNumber = (number: number) => {
    if (number >= 1000) {
      return 'small';
    } else if (number >= 100) {
      return 'middle';
    }
  };

  const getNextMapText = () => {
    if (props.destination.destinationId === 1 || props.destination.destinationId === 10) return <></>;
    return `Next map: ${props.destination.successCountToProgress} wins`;
  };

  return (
    <div
      onClick={() =>
        props.isAbleToStartExpedition &&        
        props.toggleDetailDestinationModal(props.destination)
      }
    >
      <p className={`title-expe ${props.left && 'left'}`}>
        <FormattedMessage id={`expedition.name.${props.destination.name_i18n}`} />
      </p>
      <div
        className={`mini-expedition-card ${
          !props.isAbleToStartExpedition && 'unavailable'
        }`}
      >
        <div className='expeMapInfo'>
          <div className='unlockNextMap'>{getNextMapText()}</div>
        </div>
        <div className='expeReward'>
          <div>
            {props.hasRewards && (
              <Button
                style={{ fontWeight: 500, fontSize: '14px' }}
                className='expeRewardBtn fadeIn'
                onClick={(e) => {
                  e.stopPropagation();
                  props.toggleExpeRewardsModal(true, props.destination.destinationId);
                }}
              >
                {'🎁 Rewards'}
              </Button>
            )}
          </div>
        </div>
        <div className='img-expe' />
        <div className='requirements-expe'>
          <div className='box-success'>
            <div>
              <span className='title'>
                <FormattedMessage id={`expedition.success-rate`} />
              </span>
            </div>
            <div>
              <span className='value'>
                {props.destination.successRate}
                <span className='title'>%</span>
              </span>
            </div>
          </div>

          <div className='box-min-ants'>
            <div>
              <span className='title'>
                <FormattedMessage id={`expedition.minimum-ants`} />
              </span>
            </div>
            <div>
              <span className='value ant'>
                {props.destination.requirements.minAnts}
                <img className='micro-ant' src={`/images/micro-ant.png`} alt='' />
              </span>
            </div>
          </div>

          <div className='box-reward'>
            <div className='inside-box-reward'>
              <span className='title'>
                <FormattedMessage id={`expedition.cost`} />
              </span>
            </div>
            <div className='inside-box-reward'>
              {props.destination.requirements.cost
                .sort((a, b) => a.materialId - b.materialId)
                .map((materialReward, key) => (
                  <div key={key} className={`material-required`}>
                    <span className={`title ${props.destination.requirements.cost.length >= 6 && 'small-text'}`}>
                      {materialReward.quantity}
                    </span>
                    <div className={`material-box type-${materialReward.materialId}`}>
                      <span>
                        {materialReward.materialId === 0 ? (
                          <img alt='Nectar Logo' style={{ width: '13px' }} src={`/images/nectar.png`} />
                        ) : (
                          materialEmojisRelation[materialReward.materialId]
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className='box-reward'>
            <div className='inside-box-reward'>
              <span className={`title ${props.destination.reward.length >= 5 && 'more-small-text'}`}>
                <FormattedMessage id={`expedition.reward`} />
              </span>
            </div>
            <div className='inside-box-reward'>
              {props.destination.reward
                .sort((a, b) => a.materialId - b.materialId)
                .map((materialReward, key) => (
                  <div key={key} className={`material-required`}>
                    <span className={`text ${props.destination.reward.length >= 5 && 'small-text'}`}>
                      {materialReward.quantity}
                    </span>
                    <div className={`material-box type-${materialReward.materialId}`}>
                      <span>
                        {materialReward.materialId === 0 ? (
                          <img alt='Nectar Logo' style={{ width: '13px' }} src={`/images/nectar.png`} />
                        ) : (
                          materialEmojisRelation[materialReward.materialId]
                        )}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className='values-expe'>
          <p className='title'>
            <FormattedMessage id={`expedition.requirements`} />
          </p>
          <div className='inside'>
            <div>
              <div className='box-map'>
                <img className={`${props.destination.playerOwnTheMap}`} src={`/images/expedition.png`} alt='' />
              </div>
            </div>

            {props.destination.requirements.totalAntsPower ? (
              <div className='total-power'>
                <div className='box-type'>
                  <div className='power'>
                    <span className={`rarity-common ${sizeNumber(props.destination.requirements.totalAntsPower)}`}>
                      {props.destination.requirements.totalAntsPower}
                    </span>
                  </div>
                  <img className={`type flying`} src={`/images/flying.png`} alt='' />
                  <img className={`type worker`} src={`/images/worker.png`} alt='' />
                  <img className={`type soldier`} src={`/images/soldier.png`} alt='' />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className='box-type'>
                    <img className={`type flying`} src={`/images/flying.png`} alt='' />
                    <div className='power'>
                      <span className={`rarity-common ${sizeNumber(props.destination.requirements.flyingPower!)}`}>
                        {props.destination.requirements.flyingPower}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className='box-type'>
                    <img className={`type worker`} src={`/images/worker.png`} alt='' />
                    <div className='power'>
                      <span className={`rarity-common ${sizeNumber(props.destination.requirements.workerPower!)}`}>
                        {props.destination.requirements.workerPower}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className='box-type'>
                    <img className={`type soldier`} src={`/images/soldier.png`} alt='' />
                    <div className='power'>
                      <span className={`rarity-common ${sizeNumber(props.destination.requirements.soldierPower!)}`}>
                        {props.destination.requirements.soldierPower}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniExpeditionCard;
