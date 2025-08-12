import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { Destination, Expeditions } from './Expeditions';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { ExpeditionHistory } from './ExpeditionsHistory';
// import { PackToBuy } from '@ComponentsRoot/ControlPanel/components/CPanelStandard/types/Cache';
import { ExpeditionReward } from './ExpeditionReward';
import { PurchasedPowerTicket } from './PowerTicket';

export type dataTypeAnts = {
  quantity: number;
  power: number;
  bonus: boolean;
  requirements: boolean;
};

export type ExpeditionSubject = {
  isLoading: boolean;
  expeditionsData: Expeditions | null;
  hasError: null | any;
  toastr: ToastrSubjectType;
  destinationDetailSelected: Destination | null;
  selectedExpeditionAnts: Ant[];
  dataSelectedAnts: {
    worker: dataTypeAnts;
    soldier: dataTypeAnts;
    flying: dataTypeAnts;
    requirements: boolean;
    totalSelectedPower: number;
  };
  resultExpedition: ExpeditionHistory | null;
  allExpeditionHistory?: ExpeditionHistory[];
  isExpeHistoryModalOpen: boolean;
  isExpeRewardModalOpen: boolean;
  expeRewardData: ExpeditionReward[] | null;
  purchasedPwrTickets: PurchasedPowerTicket[] | null;
  packRevealed: Ant[] | null;
  rewardModalDestId?: number;
  isPowerTicketAssignerModalOpen: boolean;
  powerTicketToAssign?: PurchasedPowerTicket;
  pwrTicketUpgradeResult?: Ant;
};

export const defaultDataSubjectExpedition = {
  isLoading: false,
  expeditionsData: null,
  hasError: null,
  toastr: toastrObjDefValue,
  destinationDetailSelected: null,
  selectedExpeditionAnts: [],
  dataSelectedAnts: {
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
  },
  resultExpedition: null,
  isExpeHistoryModalOpen: false,
  isExpeRewardModalOpen: false,
  expeRewardData: null,
  purchasedPwrTickets: null,
  packRevealed: null,
  isPowerTicketAssignerModalOpen: false
};
