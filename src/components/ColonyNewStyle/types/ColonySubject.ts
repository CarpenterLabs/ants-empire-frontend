import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { Colony } from '../../Colonies/types/Colony';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { BaseRoomType } from './RoomType';
import { Destination } from '@ComponentsRoot/Expedition/types/Expeditions';
import { PurchasedPowerTicket } from '@ComponentsRoot/Expedition/types/PowerTicket';

export type ColonySubject = {
  isLoading: boolean;
  colonyData: Colony | null;
  hasError: null | any;
  toastr: ToastrSubjectType;
  sellerDialog: boolean;
  swapModal: boolean;
  upgradeRoomModal: boolean;
  unlockRoomModal: boolean;
  unlockSpotModal: boolean;
  selectedRoomToUpgrade: number;
  selectedRoomToUnlock: number;
  addAntsToRoomModalVisible: boolean;
  antsOnInventory?: Ant[];
  selectedRoomToAddAnts?: BaseRoomType;
  selectedSpotToUnlock: number;
  blackSmithModalVisible: boolean;
  HospitalModalVisible: boolean;
  expeditionsModalVisible: boolean;
  DetailDestinationModalVisible: boolean;
  tavernModalVisible: boolean;
  roomDetailModalOpen:boolean;
  isWareHouseModalOpen: boolean;
  DetailDestinationSelected: Destination | null;
  antToOpenDetail: Ant | undefined;
  isOpenPwrTicketAssignerModal: boolean;
  purchasedTicketToAssign?: PurchasedPowerTicket;
  pwrTicketUpgradeResult?: Ant;
  lightMode: 'morning' | "midday" | "night" | "auto";
  clickedRoomId?: number;
};

export const defaultDataSubjectColony: ColonySubject = {
  isLoading: false,
  colonyData: null,
  hasError: null,
  toastr: toastrObjDefValue,
  sellerDialog: false,
  swapModal: false,
  upgradeRoomModal: false,
  unlockRoomModal: false,
  unlockSpotModal: false,
  selectedRoomToUpgrade: 0,
  selectedRoomToUnlock: 0,
  addAntsToRoomModalVisible: false,
  selectedSpotToUnlock: 0,
  blackSmithModalVisible: false,
  HospitalModalVisible: false,
  expeditionsModalVisible: false,
  DetailDestinationModalVisible: false,
  DetailDestinationSelected: null,
  tavernModalVisible: false,
  antToOpenDetail: undefined,
  roomDetailModalOpen: false,
  isWareHouseModalOpen: false,
  isOpenPwrTicketAssignerModal: false,
  lightMode: 'morning',
};
