export type BaseRoomType = {
  _id?: string;
  name: string;
  description: string;
  roomId: number;
  upgradeable: boolean;
  capacity_ants: boolean;
  level?: number;
  requeriments: {
    numberOfRooms: number;
    levelOfRooms: number;
    status?: boolean;
  };
  nextLevel: {
    power: number;
    ants: number;
    requeriments: {
      materialId: number;
      quantity: number;
    }[];
    status?: boolean;
  } | null;
  currentRoomAntsPower?: number;
  maxAllocPowerCurrentLvl?: number;
}

export type RestorePackToBuy = {
  name: string;
  pack_id: number;
  usedtimes: number;
  price: number;
  percentDiscount?: number;
  priceWithDiscountApplied?: number;
}

export type Hospital = {
  restore_by_levels: { [key: number]: { discount: number } }; // hospital
  packs_usedtimes: RestorePackToBuy[];
  healPool: number;
} & BaseRoomType;

export type WorkShop = {
  discount_by_levels?: { [key: number]: { [key: number]: { materialId: number; quantity: number }[] } }; // workshop / artesano
} & BaseRoomType;

export type WareHouse = {
  capacity_by_levels: { [key: number]: number }; // warehouse
  // Warehouse special properties to add on colony read
  currentMaterialTotalCount?: number;
  currentCapacityByLevel?: number;
} & BaseRoomType;

export const getEmblem = (roomId: number): string => {
  switch (roomId) {
    case 1:
      return '/images/finals/roomDetail/barrack_emblem.png';
    case 2:
      return '/images/finals/roomDetail/controltower_emblem.png';
    case 3:
      return '/images/finals/roomDetail/quarter_emblem.png';
    default:
      return '/images/finals/roomDetail/default_emblem.png';
  }
};



// export type Room = {
//   _id?: string;
//   name: string;
//   description: string;
//   roomId: number;
//   upgradeable: boolean;
//   capacity_ants: boolean;
//   level: number;
//   requeriments: {
//     numberOfRooms: number;
//     levelOfRooms: number;
//     status: boolean;
//   };
//   discount_by_levels?: { [key: number]: { [key: number]: { materialId: number; quantity: number }[] } }; // workshop / artesano
//   // discount_by_levels?: { [key: number]: number }; // workshop / artesano
//   capacity_by_levels?: { [key: number]: number }; // warehouse
//   restore_by_levels?: { [key: number]: { max_ant_rarity: 'common' | 'rare' | 'epic' | 'legendary'; discount: number } }; // hospital
//   packs_usedtimes?: { name: string; pack_id: number; usedtimes: number; price: number }[];
//   nextLevel: {
//     value: number;
//     requeriments: {
//       materialId: number;
//       quantity: number;
//     }[];
//     status: boolean;
//   } | null;
//   currentMaterialTotalCount?: number;
//   currentCapacityByLevel?: number;
// };

// export type RestorePackToBuy = {
//   name: string;
//   pack_id: number;
//   usedtimes: number;
//   price: number;
//   percentDiscount?: number;
//   priceWithDiscountApplied?: number;
// };

export const roomsEmojisRelation: { [key: number]: string } = {
  1: '⚒️',
  2: '🔎',
  3: '⚔️',
  4: '🛠️',
  5: '📦',
  6: '🏥',
  7: '👑',
};
