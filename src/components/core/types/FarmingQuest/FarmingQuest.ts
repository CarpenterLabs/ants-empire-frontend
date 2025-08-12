// Base FarmingQuest object, it will be the template to generate the quests on the colony
// The algo will take the base farmingqQuest by her own type and generate the quest based on playerColonyLevel, etc
export type FarmingQuest = {
  _id: string;
  name_i18n: string; //Hacer sistema de narrativa dinamica??? Talk with Albertas
  description_i18n: string; //Hacer sistema de narrativa dinamica??? Talk with Albertas (si quieremos descripción, habría que hacer algo parecido para que no quede pobre)
  npcId: number;
  skippable: boolean;
  typeQuest: QuestType;
  npcInfo: NPCInfoInsideQuest[];
  questOwnedBy: number[]; // NPC ID ARRAY INSIDE
  enabled: boolean;
};

export type NPCInfoInsideQuest = {
  npcId: number;
  cost: { materialId: number; quantity?: number; quantityRange?: { min: number; max: number } }[];
  reward: { materialId: number; quantity?: number; quantityRange?: { min: number; max: number } }[];
};

export const QuestTypeSeparator = '~~';
export type QuestTypeCostLiteral = 'NECTAR' | 'MATERIAL' | 'USEDTIMES' | 'STUCKED';
export type QuestTypeReward =
  | 'MINT_RARE'
  | 'MINT_COMMON'
  | 'MINT_COMMON_FLYING'
  | 'MINT_COMMON_WORKER'
  | 'MINT_COMMON_SOLDIER'
  | 'MINT_EPIC'
  | 'MINT_GENERAL'
  | 'MATERIAL'
  | 'NECTAR'
  | 'USEDTIMES'
  | 'POWERTICKET_10_COMMON'
  | 'POWERTICKET_5_COMMON'
  | 'POWERTICKET_10_RARE'
  | 'POWERTICKET_5_RARE'
  | 'POWERTICKET_10_EPIC'
  | 'POWERTICKET_5_EPIC';

export type QuestType =
  | 'NECTAR~~MATERIAL'
  | 'MATERIAL~~NECTAR'
  | 'MATERIAL~~USEDTIMES'
  | 'MATERIAL~~MINT_COMMON'
  | 'MATERIAL~~MINT_COMMON_WORKER'
  | 'MATERIAL~~MINT_COMMON_SOLDIER'
  | 'MATERIAL~~MINT_COMMON_FLYING'
  | 'USEDTIMES~~MATERIAL'
  | 'NECTAR~~USEDTIMES'
  | 'MATERIAL~~MINT_GENERAL'
  | 'MATERIAL~~MINT_RARE'
  | 'MATERIAL~~MINT_EPIC'
  | 'NECTAR~~POWERTICKET_10_COMMON'
  | 'NECTAR~~POWERTICKET_5_COMMON'
  | 'NECTAR~~POWERTICKET_10_RARE'
  | 'NECTAR~~POWERTICKET_5_RARE'
  | 'NECTAR~~POWERTICKET_10_EPIC'
  | 'NECTAR~~POWERTICKET_5_EPIC'
  | 'STUCKED';
  
export type QuestTypesObject = {
  [key: number]: QuestType;
};
