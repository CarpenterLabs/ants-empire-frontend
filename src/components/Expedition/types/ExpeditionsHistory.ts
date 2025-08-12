import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { Destination } from './Expeditions';

export type ExpeditionHistory = {
  _id?: string;
  destinationId: number;
  colonyId: string;
  timestamp: Date | string;
  success: boolean;
  destinationSuccessRate: number;
  destinationSuccessRateWithBonus: number;
  player_roll_result: number;
  player_walletId: string;
  finalSuccessRate: number;
  ants: {
    worker: Ant['_id'][];
    soldier: Ant['_id'][];
    flying: Ant['_id'][];
  };
  reward: {
    materialId: number;
    quantity: number;
    bonusApplied?: number /**Only present in materials */;
    finalQuantity?: number;
  }[];
  bonus: {
    flying: boolean;
    worker: boolean;
    soldier: boolean;
  };
  lossCost?: Destination['requirements']['cost'];
};
