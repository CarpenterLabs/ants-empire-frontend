export type SpotType = {
  _id?: string;
  name: string;
  description: string;
  imguri: string;
  spotId: number;
  collect: {
    materialId: number;
    quantity: number;
  };
  cooldown_minutes: number;
  probability: number;
  last_time_recollect?: string | 'initial';
  requiredTool: number;
  unlocked: boolean;
  costUnlock: {
    materialId: number;
    quantity: number;
  }[];
  unlockableWithMaterials: boolean;
  spotKey: number;
  availableToCollect: boolean;
  materialExceedCapacity: boolean;
  coolDownStatus: boolean;
};

export const spotEmojisSrcRelation: { [key: number]: string } = {
  0: '/images/finals/icons/random.png',
  1: '/images/finals/icons/twig.png',
  2: '/images/finals/icons/mineral.png',
  3: '/images/finals/icons/mud.png',
  4: '/images/finals/icons/water.png',
  5: '/images/finals/icons/seed.png',
};

export type SpotsItemPosition = {
  id: number;
  src: string;
  top: number;
  left: number;
  width: number;
};
