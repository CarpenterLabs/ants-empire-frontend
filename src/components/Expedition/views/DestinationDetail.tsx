import CustomModal from '@ComponentsRoot/core/CustomModal';
import Style from '../styles/destinationDetail.module.scss';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import ExpeditionBloc from '../bloc/ExpeditionBloc';
import { Destination, PlayerActiveBonusesOnExpe } from '../types/Expeditions';
import { FormattedMessage } from 'react-intl';
import { materialEmojisRelation } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import { Button } from 'reactstrap';
import AntMiniCard from '@ComponentsRoot/AntList/views/AntMiniCard';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { ExpeditionSubject } from '../types/ExpeditionSubject';
import { ExpeditionHistory } from '../types/ExpeditionsHistory';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useOutletContext } from 'react-router/dist';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';

const DestinationDetail = (props: {
  colonyData: Colony;
  bloc: ExpeditionBloc;
  destination: Destination;
  antsSelected: Ant[];
  dataSelectedAnts: ExpeditionSubject['dataSelectedAnts'];
  resultExpedition: ExpeditionHistory | null;
}) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();

  const sizeNumber = (number: number) => {
    if (number >= 1000) {
      return 'small';
    } else if (number >= 100) {
      return 'middle';
    }
  };

  const renderAnts = () => {
    // ants with 0 usedtimes go to final
    const sortedAnts = [...props.colonyData.ants].sort((antA, antB) => {
      if (antA.usedtimes === 0 && antB.usedtimes !== 0) {
        return 1;
      }
      if (antA.usedtimes !== 0 && antB.usedtimes === 0) {
        return -1;
      }
      return 0;
    });

    return sortedAnts.map((ant, key) => (
      <div
        key={key}
        className='box-miniCard'
        onClick={() => ant.usedtimes !== 0 && props.bloc.addToSelectedExpeditionAnts(ant, props.destination)}
      >
        <AntMiniCard ant={ant} selected={Boolean(props.antsSelected.find((antSelected) => antSelected._id === ant._id))} />
      </div>
    ));
  };

  const getFinalResultsWithBonusesMaterialsAndNectar = (
    bonuses: PlayerActiveBonusesOnExpe,
    materialId: number,
    reward: ExpeditionHistory['reward'][0]
  ) => {
    const successed = props.resultExpedition?.success;
    const bonusType = materialId === 0 ? 'nectarBonus' : 'materialBonus';
    const sign = successed ? '+' : '-';

    let quantity;
    if (materialId === 0) {
      quantity = successed ? reward.finalQuantity : reward.quantity;
    } else {
      quantity = successed ? reward.bonusApplied : reward.quantity;
    }

    return bonuses[bonusType] ? `${sign}${quantity}` : `${sign}${reward.quantity}`;
  };

  const getLossPercentMessage = () => {
    const lossPercent = props.bloc.getSubjectValue().expeditionsData!.lossCostIfFailPercent as number;
    return props.bloc.providerProps.intl.formatMessage(
      {
        id: 'expedition.lostMaterialPercentageTxt',
      },
      { percentage: lossPercent }
    );
  };

  const getResultIcon = () => {
    if (props.resultExpedition!.success) {
      return '/images/finals/expedition/result/success_icon.png';
    }

    return '/images/finals/expedition/result/fail_icon.png';
  };

  const mountDetailResultDestinationBody = () => {
    const materialsToShow = props.resultExpedition!.success
      ? (props.resultExpedition!.reward as ExpeditionHistory['reward'])
      : props.resultExpedition?.lossCost;

    const bonuses = props.bloc.mapBonusObjectBasedOnPlayerAnts(props.destination, props.antsSelected);

    return (
      <div className={`${Style.destinationDetail} fadeIn`}>
        <div className='detailResult-container'>
          <div className='closeButton'>
            <img
              src='/images/finals/blacksmith/close_btn.png'
              alt='Close'
              onClick={async () => {
                await props.bloc.providerProps.restartExpeditions();
              }}
              className='modalCloseImg'
            />
          </div>
          <div className={`img-result ${props.resultExpedition!.success ? 'ok' : 'ko'}`}>
            <img className='img-success' src={`/images/finals/icons/ant.png`} alt='queen' />
          </div>
          <div className='imgResIcon'>
            <img src={getResultIcon()} alt='res icon' />
          </div>

          <div className={`success-result ${props.resultExpedition!.success}`}>
          
            <span>Expedition</span>
            <span className={`${props.resultExpedition!.success ? 'ok' : 'ko'}`}>
              {props.resultExpedition!.success ? 'Success' : 'Failed'}
            </span>
          </div>

          {!props.resultExpedition?.success && <div className='lostPercentageTxt'>{getLossPercentMessage()}</div>}

          <div className='inside-box-reward'>
            {materialsToShow!
              .sort((a, b) => a.materialId - b.materialId)
              .map((materialReward, key) => (
                <div key={key} className={`material-required`}>
                  <span className='text'>
                    {getFinalResultsWithBonusesMaterialsAndNectar(bonuses, materialReward.materialId, materialReward)}
                  </span>

                  <div className={`material-box type-${materialReward.materialId}`}>
                    <span>
                      {materialReward.materialId === 0 ? (
                        <img alt='Nectar Logo' src={`/images/finals/icons/nectar.png`} />
                      ) : (
                        <img alt={'Material'} src={MATERIAL_LIST.find((m) => m.id === materialReward.materialId)?.src} />
                      )}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <div className='details'>
            <div className='roll'>
              <span>
                <img src='/images/finals/icons/dice.png' alt='dice' />
                Your roll: <span className='wh'>{props.resultExpedition!.player_roll_result}</span>
              </span>
            </div>
            <div className='needed'>
              <span>
                <img src='/images/finals/icons/trophy.png' alt='Needed result' />
                Needed: <span className='wh'>{props.resultExpedition!.finalSuccessRate}</span> or below
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const mountDetailDestinationBody = () => (
    <div className={`${Style.destinationDetail} fadeIn`}>
      <div className='destinationDetail-container'>
        <div className='text-intro img-header'>
          <div className='backdrop' />
          <div className='text-box'>
            <p className='title'>
              <FormattedMessage id={`expedition.name.${props.destination.name_i18n}`} />
            </p>
            <p>
              <FormattedMessage id={`expedition.description.${props.destination.description_i18n}`} />
            </p>
          </div>
          <div className='lvl'>
            <p className='text-number'>{props.destination.destinationId}</p>
          </div>
        </div>

        <div className='info-values'>
          <div className='values-success'>
            <div className='box-success'>
              <div>
                <p className='title'>
                  <FormattedMessage id={`expedition.success-rate`} />
                </p>
              </div>
              <div>
                <span className='value'>
                  {props.destination.successRate}
                  <span>%</span>
                </span>
              </div>
            </div>

            <div className={`box-reward requirement ${props.destination.enoughMaterialToStart}`}>
              <div className='inside-box-reward'>
                <p className={`title ${props.destination.reward.length >= 6 && 'medium-text'}`}>
                  <FormattedMessage id={`expedition.cost`} />
                </p>
              </div>
              <div className='inside-box-reward'>
                {props.destination.requirements.cost
                  .sort((a, b) => a.materialId - b.materialId)
                  .map((materialReward, key) => (
                    <div key={key} className={`material-required`}>
                      <span className='text'>{materialReward.quantity}</span>
                      <div className={`material-box type-${materialReward.materialId}`}>
                        <span>
                          {materialReward.materialId === 0 ? (
                            <img alt='Nectar Logo' style={{ width: '20px' }} src={`/images/nectar.png`} />
                          ) : (
                            materialEmojisRelation[materialReward.materialId]
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div
              className={`box-reward requirement ${
                props.dataSelectedAnts?.worker.bonus
                  ? props.destination.enoughWareHouseCapacityWithBonusApplied
                  : props.destination.enoughWareHouseCapacity
              }`}
            >
              <div className='inside-box-reward'>
                <p className={`title ${props.destination.reward.length >= 5 && 'medium-text'}`}>
                  <FormattedMessage id={`expedition.reward`} />
                </p>
              </div>
              <div className='inside-box-reward'>
                {props.destination.reward
                  .sort((a, b) => a.materialId - b.materialId)
                  .map((materialReward, key) => (
                    <div key={key} className={`material-required`}>
                      <span className={`text ${props.destination.reward.length >= 5 && 'medium-text'}`}>
                        {materialReward.quantity}
                      </span>
                      <div className={`material-box type-${materialReward.materialId}`}>
                        <span>
                          {materialReward.materialId === 0 ? (
                            <img alt='Nectar Logo' style={{ width: '20px' }} src={`/images/nectar.png`} />
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

          <div className={`values-requirements ${props.dataSelectedAnts.requirements}`}>
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
                <div>
                  <div className={`box-type requirement total-power ${props.dataSelectedAnts.requirements}`}>
                    <img className={`type flying`} src={`/images/flying.png`} alt='' />
                    <img className={`type worker`} src={`/images/worker.png`} alt='' />
                    <img className={`type soldier`} src={`/images/soldier.png`} alt='' />
                    <div className='power mr-5'>
                      <span className={`rarity-common ${sizeNumber(props.destination.requirements.totalAntsPower)}`}>
                        {props.destination.requirements.totalAntsPower}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className={`box-type requirement ${props.dataSelectedAnts.flying.requirements}`}>
                      <img className={`type flying`} src={`/images/flying.png`} alt='' />
                      <div className='power mr-5'>
                        <span className={`rarity-common ${sizeNumber(props.destination.requirements.flyingPower!)}`}>
                          {props.destination.requirements.flyingPower}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className={`box-type requirement ${props.dataSelectedAnts.worker.requirements}`}>
                      <img className={`type worker`} src={`/images/worker.png`} alt='' />
                      <div className='power mr-5'>
                        <span className={`rarity-common ${sizeNumber(props.destination.requirements.workerPower!)}`}>
                          {props.destination.requirements.workerPower}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className={`box-type requirement ${props.dataSelectedAnts.soldier.requirements}`}>
                      <img className={`type soldier`} src={`/images/soldier.png`} alt='' />
                      <div className='power mr-5'>
                        <span className={`rarity-common ${sizeNumber(props.destination.requirements.soldierPower!)}`}>
                          {props.destination.requirements.soldierPower}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <div className={`box-type requirement ${props.antsSelected.length >= props.destination.requirements.minAnts}`}>
                  <img className={`type ant`} src={`/images/micro-ant.png`} alt='' />
                  <div className='power mr-5'>
                    <span className={`rarity-common`}>{props.destination.requirements.minAnts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='bonus'>
          <div className='box-bonus'>
            <div>
              <p className='title'>Bonus</p>
            </div>

            <div className={`row-bonus ${props.dataSelectedAnts?.soldier.bonus}`}>
              <div className='box-type'>
                <div className='box-images'>
                  <div className='power'>
                    <span className={`rarity-common soldier`}>💪</span>
                  </div>
                  <div className='bonusPower soldier'>{props.destination.bonus.soldier.totalPower}</div>
                  <div className='type-ant-bonus'>
                    <img className={`type soldier`} src={`/images/soldier.png`} alt='' />
                  </div>
                </div>
              </div>

              <div className='box-type'>
                <img className='arrow' src={`/images/thin_arrow.png`} alt='' />
              </div>

              <div className='box-type'>
                <div className='percent'>
                  <p className={`rarity-common`}>+{props.destination.bonus.soldier.bonus}%</p>
                </div>
              </div>

              <div className='box-type'>
                <img className='arrow' src={`/images/thin_arrow.png`} alt='' />
              </div>

              <div className='box-type'>
                <p className='final-result'>+{props.destination.bonus.soldier.bonusApplied - props.destination.successRate}%</p>
              </div>
            </div>

            <div className={`row-bonus ${props.dataSelectedAnts?.flying.bonus}`}>
              <div className='box-type'>
                <div className='box-images'>
                  <div className='power'>
                    <span className={`rarity-common flying`}>💪</span>
                  </div>
                  <div className='bonusPower flying'>{props.destination.bonus.soldier.totalPower}</div>
                  <div className='type-ant-bonus'>
                    <img className={`type flying`} src={`/images/flying.png`} alt='' />
                  </div>
                </div>
              </div>

              <div className='box-type'>
                <img className='arrow' src={`/images/thin_arrow.png`} alt='' />
              </div>

              <div className='box-type'>
                <div className='percent'>
                  <p className={`rarity-common`}>+{props.destination.bonus.flying.bonus}%</p>
                </div>
              </div>

              <div className='box-type'>
                <img className='arrow' src={`/images/thin_arrow.png`} alt='' />
              </div>

              <div className='box-type'>
                <div className='final-result'>
                  <div className='inside-box-reward'>
                    <div className={`material-required`}>
                      <span className='text big'>+{Number(props.destination.bonus.flying.bonusApplied)}</span>
                      <div className={`material-box big type-0`}>
                        <span>
                          <img alt='Nectar Logo' style={{ width: '20px' }} src={`/images/nectar.png`} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`row-bonus ${props.dataSelectedAnts?.worker.bonus}`}>
              <div className='box-type'>
                <div className='box-images'>
                  <div className='power'>
                    <span className={`rarity-common worker`}>💪</span>
                  </div>
                  <div className='bonusPower worker'>{props.destination.bonus.soldier.totalPower}</div>
                  <div className='type-ant-bonus'>
                    <img className={`type worker`} src={`/images/worker.png`} alt='' />
                  </div>
                </div>
              </div>

              <div className='box-type'>
                <img
                  className={`arrow ${props.destination.reward.length >= 5 && 'small'}`}
                  src={`/images/thin_arrow.png`}
                  alt=''
                />
              </div>

              <div className='box-type'>
                <div className='percent'>
                  <p className={`rarity-common`}>+{props.destination.bonus.worker.bonus}%</p>
                </div>
              </div>

              <div className='box-type'>
                <img
                  className={`arrow ${props.destination.reward.length >= 5 && 'small'}`}
                  src={`/images/thin_arrow.png`}
                  alt=''
                />
              </div>

              <div className='box-type'>
                <div className='final-result'>
                  <div className='inside-box-reward'>
                    {props.destination.reward
                      .filter((materialReward) => materialReward.materialId !== 0)
                      .map((materialReward, key) => {
                        const result = materialReward.bonusApplied - materialReward.quantity;
                        const numDecimals = (result.toString().split('.')[1] || '').length;
                        const roundedResult = numDecimals > 2 ? result.toFixed(2) : result;

                        return (
                          <div key={key} className={`material-required ${props.destination.reward.length >= 5 && 'small-text'}`}>
                            <span className='text'>+{roundedResult}</span>
                            <div className={`material-box type-${materialReward.materialId}`}>
                              <span>{materialEmojisRelation[materialReward.materialId]}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='ants-container'>
          <div className='header'>
            <div className='ants-count'>
              <div className={`box-count`}>
                <img src={`/images/micro-ant.png`} alt='' />
                <div>
                  <span className='text-count mr-10'>{props.antsSelected.length}</span>
                </div>
              </div>
            </div>

            <div className='type-count'>
              <div className='ants-count'>
                <div className={`box-count`}>
                  <img src={`/images/worker.png`} alt='' />
                  <div>
                    <span className='text-count'>
                      {props.dataSelectedAnts?.worker.quantity} <span className='mini-text'>Ants</span> |{' '}
                      {props.dataSelectedAnts?.worker.power}{' '}
                      <span className='mini-text'>
                        <FormattedMessage id={`expedition.power`} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className='ants-count'>
                <div className={`box-count`}>
                  <img src={`/images/soldier.png`} alt='' />
                  <div>
                    <span className='text-count'>
                      {props.dataSelectedAnts?.soldier.quantity} <span className='mini-text'>Ants</span> |{' '}
                      {props.dataSelectedAnts?.soldier.power}{' '}
                      <span className='mini-text'>
                        <FormattedMessage id={`expedition.power`} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className='ants-count'>
                <div className={`box-count`}>
                  <img src={`/images/flying.png`} alt='' />
                  <div>
                    <span className='text-count'>
                      {props.dataSelectedAnts?.flying.quantity} <span className='mini-text'>Ants</span> |{' '}
                      {props.dataSelectedAnts?.flying.power}{' '}
                      <span className='mini-text'>
                        <FormattedMessage id={`expedition.power`} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className='ants-count'>
                <div className={`box-count`}>
                  <div>
                    <span className='text-count'>
                      <span className='mini-text totalSelectedPower'>
                        <FormattedMessage id={`expedition.totalPower`} />
                      </span>
                      {props.dataSelectedAnts?.totalSelectedPower}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='reset-btn'>
              <img
                className={`button-undo ${props.antsSelected.length === 0 ? 'disabled' : ''} `}
                onClick={() => props.bloc.resetSelection()}
                src={`/images/reset.png`}
                alt='reset'
              />
            </div>
          </div>

          <div className='ants-selector'>{renderAnts()}</div>
        </div>

        <div className='buttons'>
          <Button
            className={`start-expedition`}
            color='primary'
            disabled={!props.dataSelectedAnts.requirements}
            onClick={async () =>
              await props.bloc.startExpedition(
                props.colonyData._id,
                props.destination,
                props.antsSelected.map((ant) => ant.tokenId),
                outletContext.socketIOService,
                outletContext.accountData?.owner!
              )
            }
          >
            <FormattedMessage id={`expedition.start-expedition`} />
          </Button>

          <Button className={`close`} onClick={() => props.bloc.toggleDetailDestinationModal()}>
            <FormattedMessage id={`expedition.back`} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <CustomModal
      class='expe'
      withoutHeader={props.resultExpedition ? true : false}
      size={props.resultExpedition ? 'md' : 'xl'}
      body={props.resultExpedition ? mountDetailResultDestinationBody() : mountDetailDestinationBody()}
      open
      title=''
      togglerModal={
        props.resultExpedition
          ? async () => {
              await props.bloc.providerProps.restartExpeditions();
            }
          : () => props.bloc.toggleDetailDestinationModal()
      }
    />
  );
};

export default DestinationDetail;
