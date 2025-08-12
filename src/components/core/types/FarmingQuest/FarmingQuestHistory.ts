
import { FarmingNPC } from '@ComponentsRoot/Tavern/types/farmingNPC/FarmingNPC';
import { QuestType } from './FarmingQuest';

export type FarmingQuestHistory = {
  _id: string;
  npcId: number;
  colonyId: string;
  playerId: string; //wallet of the player
  typeQuest: QuestType;
  skippable: boolean;
  successedDate: Date | null; // null if QUEST is not completed
  skippedDate?: Date;
  generationDate: Date;
  cost: QuestCostType[];
  reward: { materialId: number; quantity: number }[];  
  playerMeetQuestCost?: boolean; // only used on material reward questTypes
  internal?: { // for debugging purposes
    cost: number;
    reward: number;
  };
};

export type QuestCostType = { materialId: number; quantity: number, toolId?: number /**For the stucked ones */ }

export type ExecuteQuestProcessResult = {
  npcs: FarmingNPC[];
  questResult: object;
  bchainUsecase?: boolean
};

