import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import { Queen } from './Queen';
import { Seller } from '@ComponentsRoot/Seller/types/Seller';
import { BaseRoomType } from '@ComponentsRoot/Colony/types/RoomType';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { BlackSmith } from '@ComponentsRoot/BlackSmith/types/BlackSmith';
import { Material } from '../../Colony/types/Material';
import { SpotType } from '../../Colony/types/SpotType';
import { PurchasedPowerTicket } from '@ComponentsRoot/Expedition/types/PowerTicket';

export type AddToColonyExceedErrorType = {
  roomId: number;
  roomAvailableCapacity: number;
  exceededCount: number;
  i18nError: {
    errorText: string;
    code: string;
  };
};

export type Colony = {
  _id: string; //master key
  name: string;
  level: number;
  queenId: string;
  type: string;
  positions: string; // ¿?
  owner: string;
  materials: Material[];
  blackSmith: BlackSmith;
  queen: Queen;
  ants_resume: {
    type: {
      worker: number;
      soldier: number;
      flying: number;
    };
    specie: {
      white: number;
      blue: number;
      red: number;
      green: number;
      yellow: number;
    };
    rarity: {
      common: number;
      rare: number;
      epic: number;
      legendary: number;
    };
    total: number;
    antsTotalPower: { worker: number; soldier: number; flying: number };
  };
  ants: Ant[];
  purchasedPwrTickets: PurchasedPowerTicket[];
  seller: Seller;
  purchasedMaterialBoxes?: PurchasedMaterialBox[];
  rooms: BaseRoomType[];
  customTimeStamp: number;
  farmingTools: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  spots: {
    1: SpotType;
    2: SpotType;
    3: SpotType;
    4: SpotType;
    5: SpotType;
    6: SpotType;
    7: SpotType;
    8: SpotType;
    9: SpotType;
    10: SpotType;
    11: SpotType;
    12: SpotType;
    13: SpotType;
    14: SpotType;
    15: SpotType;
    16: SpotType;
    17: SpotType;
    18: SpotType;
    19: SpotType;
    20: SpotType;
  };
};
