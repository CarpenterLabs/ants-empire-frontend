import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import ControlPanelBloc from '../bloc/ControlPanelBloc';
import { CacheType } from './Cache';
import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { allPacksResponseType } from '../../CPanelPacks/types/CPanelPacksSubject';
import { MaterialBoxToBuy } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
// import { QuestType } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuest';

export type TabType = {
  Master: boolean;
  Account: boolean;
  Ant: boolean;
  Packs: boolean;
  MaterialBoxes: boolean;
  Oracle: boolean;
};

export type Simulation = {
  mints: number;
  ants: number;
};

export type updateSimulationParamTypes = {
  type: string;
  key: number;
  value: number;
};

export type OracleData = {
  mode?: 'draft' | 'live';
  nectar_price: number;
  internal_price?: number;
  result?: {
    expeditionChanged: boolean;
    upgradeChanged: boolean;
    packChanged: boolean;
    boxChanged: boolean;
    hpChanged: boolean;
  };
};

export type OracleDataFullValues = {
  oracleParams: OracleData;
  expeditionValues: {
    destinationId: number;
    nectarCost: number;
    nectarReward: number;
  }[];
  upgradeRoomValues: {
    level: number | string;
    nectarCost: number;
  }[];
  packToBuyValues: {
    packToBuyId: string;
    price: number;
  }[];

  materialBoxValues: {
    mBoxToBuyId: string;
    price: number;
  }[];
  hpPackValues: {
    packId: number;
    price: number;
  }[];
};

export type ControlPanelSubject = {
  adminData: CacheType | undefined;
  oracleData?: OracleDataFullValues;
  accountData:
    | {
        nectar: number | undefined;
        listAnts: Ant[];
      }
    | undefined;
  antData:
    | {
        price: number | undefined;
        ant_rarity: Array<[string, number]>;
        ant_type: Array<[string, number]>;
        type?: string;
      }
    | undefined;
  packsData: allPacksResponseType | undefined;
  materialBoxesToBuyData: MaterialBoxToBuy[] | undefined;

  isLoading: boolean;
  hasError: null | any;
  toastr: ToastrSubjectType;

  tab: string;
  tabPending: TabType;

  accountSaveBtnDisabled: boolean;
  accountTempTabData: {
    nectar: number | undefined;
    antList: Ant[];
  };
  warningRemoveAccount: boolean;

  masterSaveBtnDisabled: boolean;
  antTempTabData: {
    price: number | undefined;
    ant_rarity: Array<[string, number]>;
    ant_type: Array<[string, number]>;
    packToBuyId?: string;
    family?: string;
  };

  antSaveBtnDisabled: boolean;
  masterTempTabData: {
    nectar_bnb_rel: number | undefined;
    type?: string;
  };
  simulationTempTabData: Simulation[];
  simulationBtnDisabled: boolean;
};

export type CPanelSimulationViewProps = {
  manageSimulation: ControlPanelBloc['manageSimulation'];
  simulationData: Simulation;
  keySimulation: number;
};

export type CPanelAntViewProps = {
  savePackToBuy: ControlPanelBloc['savePackToBuy'];
  updateDataOnTabFn: ControlPanelBloc['updateTabDataById'];
  changeTab: ControlPanelBloc['changeTab'];
  updateDataAnt: ControlPanelBloc['updateDataAnt'];
  manageSimulation: ControlPanelBloc['manageSimulation'];
  getSimulationAnts: ControlPanelBloc['getSimulationAnts'];
  antTempTabData: ControlPanelSubject['antTempTabData'];
  antData: ControlPanelSubject['antData'];
  antSaveBtnDisabled: boolean;
  simulationBtnDisabled: boolean;
  simulationTempTabData: ControlPanelSubject['simulationTempTabData'];
};

export type CPanelMasterViewProps = {
  saveMasterConfig: ControlPanelBloc['saveMasterConfig'];
  updateDataOnTabFn: ControlPanelBloc['updateTabDataById'];
  changeTab: ControlPanelBloc['changeTab'];
  updateDataMaster: ControlPanelBloc['updateDataMaster'];
  masterTempTabData: ControlPanelSubject['masterTempTabData'];
  nectar_bnb_rel: number;
  masterSaveBtnDisabled: boolean;
  type?: string;
};

export type CPanelAccountViewProps = {
  warningRemoveAccount: boolean;
  saveAccount: ControlPanelBloc['saveAccount'];
  deleteAnts: ControlPanelBloc['deleteAnts'];
  updateDataOnTabFn: ControlPanelBloc['updateTabDataById'];
  changeTab: ControlPanelBloc['changeTab'];
  updateDataAccount: ControlPanelBloc['updateDataAccount'];
  accountTempTabData: ControlPanelSubject['accountTempTabData'];
  accountData: ControlPanelSubject['accountData'];
  accountSaveBtnDisabled: boolean;
  togglerRemoveAccountFn: ControlPanelBloc['togglerRemoveAccountFn'];
  removeAccount: ControlPanelBloc['removeAccount'];
};

export const defaultControlPanelSubjData: ControlPanelSubject = {
  adminData: undefined,
  accountData: undefined,
  antData: undefined,
  packsData: undefined,
  materialBoxesToBuyData: undefined,
  isLoading: false,
  hasError: null,
  toastr: toastrObjDefValue,

  tab: 'Account',
  tabPending: {
    Master: false,
    Account: false,
    Ant: false,
    Packs: false,
    MaterialBoxes: false,
    Oracle: false,
  },

  accountSaveBtnDisabled: true,
  accountTempTabData: {
    nectar: undefined,
    antList: [],
  },
  warningRemoveAccount: false,

  antSaveBtnDisabled: true,
  antTempTabData: {
    price: undefined,
    ant_rarity: [['', 0]],
    ant_type: [['', 0]],
  },

  masterSaveBtnDisabled: true,
  masterTempTabData: {
    nectar_bnb_rel: undefined,
  },
  simulationTempTabData: [{ mints: 0, ants: 0 }],
  simulationBtnDisabled: true,
};
