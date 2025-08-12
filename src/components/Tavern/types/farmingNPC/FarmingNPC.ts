import { FarmingQuestHistory } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuestHistory';

export type FarmingNPC = {
  _id?: string;
  imgUri: string;
  npcId: number;
  name_i18n: string;
  description_i18n: string;
  requiredColonyLvl: number;
  quests: FarmingQuestHistory[]; //dynamic questing for every npc here
  materialWeight?: { [x: number]: number };
  swapProfit: number;
  timeRemainingUntilNextQuest?: number; //always will be calc result vs startOfTheDay (next day at 00.00.01)
  timeRemainingUntilNextSkip?: number; //calculated on npc querys based on last skipped quest and maxSkipsAllowedPerCycle

};
