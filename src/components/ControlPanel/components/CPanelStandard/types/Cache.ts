import { Account } from "@ComponentsRoot/Account/types/Account";
import { Ant } from "@ComponentsRoot/Ant/types/Ant";

export type CacheType = {
  masterConfig: MasterConfig;
  packToBuyMint: PackToBuy;
  devAccounts: Account[];
};

export type antGuaranteed = {
  ant_type: Array<[string, number]>;
  ant_rarity: Array<[string, number]>;
  number?: number;
};

export type antProbs = {
  ant_type: Array<[string, number]>;
  ant_rarity: Array<[string, number]>;
};

export type antProbsStatus = {
  status?: "ok" | "error";
  ant_rarity?: "error";
  ant_type?: "error";
};

export type ValidationErrorsPack = {
  packToBuyId?: string;
  weight?: string;
  ant_guaranteed?: antProbsStatus[];
  ant_rarity?: string;
  ant_type?: string;
}

export type PackToBuy = {
  _id?: string; //master key
  imguri: string;
  description: string;
  num_mints: number;
  packToBuyId: string;
  family: string;
  price: number;
  published: boolean;
  max_buy_qty: number;
  pub_dates: Date;
  ant_type: Array<[string, number]>;
  ant_rarity: Array<[string, number]>;
  ant_guaranteed?: antGuaranteed[];
  available: boolean;
  priceDiscount: number;
  percentDiscount: number;
  title: string;
  edited?: string | {
    status: boolean,
    type: string,
    key: number,
    antType: string,
    keyGuaranteed?: string
  } | any;
  action?: "update" | "create" | "remove";
  isTemporaryPack?: boolean;
  createdPack_id?: string;
  weight: number;
  errors?: any;
};

export type MasterConfig = {
  _id?: string; //master key
  ant_specie: string[];
  ant_power: object;
  nectar_bnb_rel: number;
  type: string;
  discount_wpack: number[]
}

export type PurchasedPack = {
  _id?: string;
  ants: Ant[];
  family: string;
  packToBuyId: string;
  owner: string;
  state: string;
  title: string;
  buyedpack: string;
  price: number;
}
