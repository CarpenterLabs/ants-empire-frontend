import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import ColonyBloc from '../bloc/ColonyBloc';
import { BaseRoomType } from './RoomType';
import { Seller } from '@ComponentsRoot/Seller/types/Seller';
import { SpotType } from './SpotType';

export type ColonyViewProps = {
  handlerManageSpot: ColonyBloc['handlerManageSpot'];
  refreshColonyData: ColonyBloc['refreshColonyData'];
  getOpenDetailModalByRoomId: ColonyBloc['getOpenDetailModalByRoomId'];
  showInfoBoxes?: boolean;
  colonyData: Colony;
  handleClickUpgradeRoomBtn: ColonyBloc['toggleUpgradeRoomModal'];
  toggleCallSellerDialog: ColonyBloc['toggleCallSellerDialog'];
};

export type MapRoomsProps = {
  isMobile: boolean;
  colonyData: Colony;
  handlerManageSpot: ColonyViewProps['handlerManageSpot'];
  refreshColonyData: ColonyViewProps['refreshColonyData'];
  getOpenDetailModalByRoomId: ColonyViewProps['getOpenDetailModalByRoomId'];
  handleClickUpgradeRoomBtn: ColonyViewProps['handleClickUpgradeRoomBtn'];
  toggleCallSellerDialog: ColonyViewProps['toggleCallSellerDialog'];
};

export type RoomProps = {
  id: number;
  src: string;
  top?: number;
  left?: number;
  width: number;
  height?: number;
  showLights: boolean;
  roomInfo: BaseRoomType | undefined;
  sellerInfo?: Seller;
  currentNumAnts?: number;
  spotsInfo?: spotsInfo;
  position?: number;
  getOpenDetailModalByRoomId: ColonyBloc['getOpenDetailModalByRoomId'];
  handleClickUpgradeRoomBtn?: ColonyBloc['toggleUpgradeRoomModal'];
  toggleCallSellerDialog?: ColonyBloc['toggleCallSellerDialog'];
  refreshColonyData?: ColonyBloc['refreshColonyData'];
  showInfoBox?: boolean;
  isMobile: boolean;
};

export type RoomInfoBoxProps = {
  roomId: number;
  roomInfo: BaseRoomType | undefined;
  isVisible?: boolean;
  sellerInfo?: Seller;
  currentNumAnts?: number;
  onUpgradeRoomBtnClick: ColonyBloc['toggleUpgradeRoomModal'];
  toggleCallSellerDialog: ColonyBloc['toggleCallSellerDialog'];
  refreshColonyData: ColonyBloc['refreshColonyData'];
};

export type RoomDataPosition = {
  id: number;
  name: string;
  width: number;
  src: string;
  position?: number;
  top?: number;
  left?: number;
  height?: number;
};

export type spotsInfo = {
  disabledOverlaySrc: string;
  chestSrc: string;
  colonyData: Colony;
  handlerManageSpot: ColonyBloc['handlerManageSpot'];
  refreshColonyData: ColonyBloc['refreshColonyData'];
};

export type MaterialPosition = {
  spotId: number;
  top: number;
  left: number;
};

export type SlotStatus = 'empty' | 'material' | 'disabled' | 'chest';

export type SpotProps = {
  id: number;
  top: number;
  left: number;
  width: number;
  spot: SpotType;
  unLockedCount: number;
  spotsInfo: spotsInfo;
  spotImageSrc: string;
  materialAdjustment?: MaterialPosition;
};

export type LightInRoom = {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  type: 'torch' | 'bonfire';
};
