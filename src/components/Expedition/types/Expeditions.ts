export type Expeditions = {
  destinations: Destination[];
  totalFlyingPower: number;
  totalSoldierPower: number;
  totalWorkerPower: number;
  isAbleToStartExpedition: boolean;
  timeRemainingToStart: number;
  lossCostIfFailPercent: number;
};

export type Destination = {
  _id: string;
  destinationId: number;
  enoughMaterialToStart: boolean;
  enoughWareHouseCapacity: boolean;
  enoughWareHouseCapacityWithBonusApplied: boolean;
  imguri: string;
  name_i18n: string;
  description_i18n: string;
  successRate: number;
  playerOwnTheMap: boolean;
  requirements: {
    totalAntsPower?: number;
    flyingPower: number | null;
    workerPower: number | null;
    soldierPower: number | null;
    minAnts: number;
    cost: { materialId: number; quantity: number }[];
  };
  reward: { materialId: number; quantity: number; bonusApplied: number; finalQuantity: number }[];
  successCountToProgress: number;
  bonus: {
    flying: { totalPower: number; bonus: number; bonusApplied: number };
    worker: { totalPower: number; bonus: number };
    soldier: { totalPower: number; bonus: number; bonusApplied: number };
  };
  playerSuccessCount: number;
};

export const initDataSelectedAnts = {
  worker: {
    quantity: 0,
    power: 0,
    bonus: false,
    requirements: false,
  },
  soldier: {
    quantity: 0,
    power: 0,
    bonus: false,
    requirements: false,
  },
  flying: {
    quantity: 0,
    power: 0,
    bonus: false,
    requirements: false,
  },
  requirements: false,
  totalSelectedPower: 0
};

export type PlayerActiveBonusesOnExpe = {
  nectarBonus: boolean;
  successRateBonus: boolean;
  materialBonus: boolean;
};
