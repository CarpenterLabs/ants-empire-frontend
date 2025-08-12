import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import Style from '../styles/FarmingNPC.module.scss';
import { FarmingNPC } from '../types/farmingNPC/FarmingNPC';
import { QuestTypeCostLiteral, QuestTypeReward, QuestTypeSeparator } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuest';
import { FarmingQuestHistory } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuestHistory';
import { materialEmojisRelation } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import { IntlShape } from 'react-intl';
import TavernBloc from '../bloc/TavernBloc';
import CoolDownQuest from './CoolDownQuest';
// import { farmingToolsEmojisRelation } from '@ComponentsRoot/BlackSmith/types/BlackSmith';
import QuestActionButtons from './QuestActionButtons';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';

const FarmingNPCCard = (props: {
  npc: FarmingNPC;
  colony: Colony;
  intl: IntlShape;
  executeQuestFn: TavernBloc['executeQuest'];
  skipQuestFn: TavernBloc['skipQuest'];
  refreshQuestData: TavernBloc['getTavernData'];
}) => {
  const renderCostOrRewardAreaBasedOnType = (
    type: QuestTypeCostLiteral | QuestTypeReward,
    costsOrRewards: FarmingQuestHistory['cost'] | FarmingQuestHistory['reward']
  ) => {
    if (type === 'MATERIAL') {
      return (
        <div className='materials'>
          {costsOrRewards
            .sort((a, b) => a.materialId - b.materialId)
            .map((costOrRew, key) => {
              return (
                <div className='img' key={key.toString()}>
                  <span>
                    {costOrRew.materialId === 0 ? (
                      <img alt='Nectar Logo' style={{ width: '25px' }} src={`/images/finals/icons/nectar.png`} />
                    ) : (
                      <img
                        alt={MATERIAL_LIST.find((m) => m.id === costOrRew.materialId)?.alt}
                        // style={{ width: '30px' }}
                        src={MATERIAL_LIST.find((m) => m.id === costOrRew.materialId)?.src}
                      />
                    )}
                  </span>
                  <span>{costOrRew.quantity}</span>
                </div>
              );
            })}
        </div>
      );
    } else if (type === 'USEDTIMES') {
      return (
        <div className='img'>
          <img className='usedtimeImg' src={`/images/pack1.png`} alt={'usedTime'} />
          <span>{costsOrRewards[0].quantity}</span>
        </div>
      );
    } else if (type === 'NECTAR') {
      return (
        <div className='img'>
          <img alt='Nectar Logo' style={{ width: '25px' }} src={`/images/finals/icons/nectar.png`} />
          <span>{costsOrRewards[0].quantity}</span>
        </div>
      );
    } else if (type.includes('POWERTICKET')) {
      return (
        <div className='img'>
          <img alt='PwrTicket' style={{ width: '30px' }} src={`/images/finals/icons/power_ticket.png`} />
          <span className='pwrTicket'>
            +{`${type.split('_')[1]}`}
            <img alt='pwr' style={{ width: '15px', height: '15px' }} src={`/images/finals/icons/power_1.png`} />
          </span>
        </div>
      );
    } else if (type.includes('MINT_COMMON') || type === 'MINT_GENERAL' || type === 'MINT_RARE') {
      return (
        <div className='mintPack'>
          <div className='img'>
            <img alt='Mint Pack' style={{ width: '25px' }} src={`/images/finals/icons/ant.png`} /> 1
          </div>
        </div>
      );
    } else if (type === 'STUCKED') {
      return (
        <div className='materials'>
          {costsOrRewards
            .sort((a, b) => a.materialId - b.materialId)
            .map((costOrRew, key) => {
              if (costOrRew.materialId === -1 && costOrRew.hasOwnProperty('toolId')) {
                //TOOL !! And only here on Stucke"d quest and is a COST!
                return (
                  <div key={key.toString()}>
                    <span>
                      <img
                        alt={MATERIAL_LIST.find((m) => m.id === costOrRew.materialId)?.alt}
                        // style={{ width: '30px' }}
                        src={MATERIAL_LIST.find((m) => m.id === costOrRew.materialId)?.src}
                      />
                    </span>
                    <span>{costOrRew.quantity}</span>
                  </div>
                );
              } else if (costOrRew.materialId === 0) {
                //NECTAR!
                return (
                  <div key={key.toString()} className='img'>
                    <img alt='Nectar Logo' style={{ width: '20px' }} src={`/images/nectar.png`} />
                    <span>{costOrRew.quantity}</span>
                  </div>
                );
              }
              //STANDAR MATERIAL
              return (
                <div key={key.toString()}>
                  <span>{materialEmojisRelation[costOrRew.materialId]}</span>
                  <span>{costOrRew.quantity}</span>
                </div>
              );
            })}
        </div>
      );
    }

    return <></>;
  };

  const meetsQuestRequirements = (quest: FarmingQuestHistory): boolean | null | undefined => {
    if (quest.successedDate) {
      return null; // Quest already completed — requirement irrelevant
    }

    return quest.playerMeetQuestCost;
  };

  const getNPCImgById = (npcId: FarmingNPC['npcId']) => {
    if (npcId === 1) return 'Mantis.png';
    if (npcId === 2) return 'Frog.png';
    return 'Scorpion.png';
  };

  const splitComma = (str: string) => {
    if (str.includes(',')) {
      const [part1, part2] = str.split(',');
      return (
        <>
          <span className='nameOne'>{part1}</span>
          <span className='surname'>{part2}</span>
        </>
      );
    }

    return <>{str}</>;
  };

  const getUnavTitle = () => {
    return (
      <>
        <span className='nameOne unav'>Available At</span>
        <span className='surname unav'>Colony Lv.{props.npc.requiredColonyLvl}</span>
      </>
    );
  };

  const isUnavailable = props.npc.requiredColonyLvl > props.colony.level;

  return (
    <div className={`${Style.npcCard} ${isUnavailable ? Style.npcUnav : ''}`}>
      <div className={`npcCardWrapper ${isUnavailable ? 'unavailable' : ''}`}>
        <div className='npcMainInfo'>
          <div className='npc-name'>
            {isUnavailable
              ? getUnavTitle()
              : splitComma(props.intl.formatMessage({ id: `colony.quests.farming.${props.npc.name_i18n}` }))}
          </div>
          <div className='npc-desc'>
            {isUnavailable ? (
              <></>
            ) : (
              <p>{props.intl.formatMessage({ id: `colony.quests.farming.${props.npc.description_i18n}` })}</p>
            )}
          </div>
        </div>
        <div className={`wsk-cp-img ${isUnavailable ? 'unav' : ''}`}>
          <img src={`/images/finals/npcs/${getNPCImgById(props.npc.npcId)}`} alt='NPC' />
        </div>
        {props.npc.requiredColonyLvl <= props.colony.level ? (
          <>
            <div className='countDowns'>
              {props.npc.timeRemainingUntilNextQuest && (
                <div className='nextQuest'>
                  New quest{' '}
                  <CoolDownQuest
                    refreshQuestData={props.refreshQuestData}
                    remainingMilliseconds={props.npc.timeRemainingUntilNextQuest}
                    colony={props.colony}
                  />
                </div>
              )}
              {props.npc.timeRemainingUntilNextSkip && (
                <div className='nextSkip'>
                  Next skip{' '}
                  <CoolDownQuest
                    refreshQuestData={props.refreshQuestData}
                    remainingMilliseconds={props.npc.timeRemainingUntilNextSkip}
                    colony={props.colony}
                  />
                </div>
              )}
            </div>

            <div className='npcInfo-area'>
              <div className='activeQuestsArea'>
                {props.npc.quests.map((quest, key) => {
                  return (
                    <div className={`questLine ${quest.successedDate ? 'successed' : ''}`} key={key.toString()}>
                      <div className='typeAndDate'>
                        {/* <div className='type'>{quest.typeQuest.split(QuestTypeSeparator).join('🔁')}</div> */}
                        <div className='type'>
                          {(() => {
                            const [part1, part2] = quest.typeQuest.split(QuestTypeSeparator);
                            return (
                              <>
                                <span>{part1.toLowerCase()}</span>
                                <img
                                  src='/images/finals/tavern/mini_swap_icon.png'
                                  alt='swapIcon'
                                  style={{ margin: '0 4px', verticalAlign: 'middle', height: '1.3em' }}
                                />
                                <span>{part2.toLowerCase()}</span>
                              </>
                            );
                          })()}
                        </div>
                        <div>
                          {/* {props.intl.formatDate(quest.generationDate.toString(), {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                          })} */}
                          {/* <span style={{ color: 'white' }}>
                            Ints: {quest.internal?.cost}/{quest.internal?.reward}
                          </span> */}
                        </div>
                      </div>

                      <div className={`costAndReward ${!meetsQuestRequirements(quest) ? 'disabled' : ''}`}>
                        <div className='questCost'>
                          {/* <span className='playerPassCostIcon'>{renderCostIcon(quest)}</span> */}
                          <div className={`costs`}>
                            {renderCostOrRewardAreaBasedOnType(
                              quest.typeQuest.split(QuestTypeSeparator)[0] as QuestTypeCostLiteral,
                              quest.cost
                            )}
                          </div>
                        </div>
                        <div className='imgSeparatorSwap'>
                          <img src='/images/finals/tavern/swap_icon.png' alt='swapSeparator' />
                        </div>
                        <div className='questReward'>
                          <div className='rewards'>
                            {renderCostOrRewardAreaBasedOnType(
                              (quest.typeQuest.split(QuestTypeSeparator)[1] as QuestTypeReward) ?? 'STUCKED',
                              quest.reward
                            )}
                          </div>
                        </div>
                        <QuestActionButtons
                          quest={quest}
                          deliveryClickHandler={props.executeQuestFn}
                          skipClickHandler={props.skipQuestFn}
                          npcId={props.npc.npcId}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className='unavailableMsg'>{/* <p>Available at colony level {props.npc.requiredColonyLvl}</p> */}</div>
        )}
      </div>
    </div>
  );
};

export default FarmingNPCCard;
