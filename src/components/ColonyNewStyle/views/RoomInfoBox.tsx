import React from 'react';
import { BaseRoomType, Hospital, WareHouse } from '@ComponentsRoot/Colony/types/RoomType';
import { Seller } from '@ComponentsRoot/Seller/types/Seller';
import { RoomInfoBoxProps } from '../types/Colony';
import ColonyBloc from '../bloc/ColonyBloc';
import SellerInfoBox from './SellerInfoBox';

// ──────── ROOM TYPES ────────
const ROOM_TYPES = {
  STANDARD_ROOMS: [1, 2, 3, 4] as number[],
  SELLER: 9,
  STORAGE: 5,
  HOSPITAL: 6,
} as const;

// ──────── POSITION CONSTANTS ────────
const INFO_BOX_POSITIONS_DESKTOP = {
  1: { top: '75%', left: '1%', right: 'auto', className: 'info-box-left' },
  2: { top: '21%', left: '-0.5%', right: 'auto', className: 'info-box-left' },
  3: { top: '50%', left: '-1%', right: 'auto', className: 'info-box-left' },
  4: { top: '45%', left: 'auto', right: '-0.5%', className: 'info-box-right' },
  5: { top: '85%', left: 'auto', right: '3%', className: 'info-box-right' },
  6: { top: '65%', left: 'auto', right: '2.5%', className: 'info-box-right' },
  9: { top: '25%', left: 'auto', right: '5%', className: 'info-box-right' },
} as const;

const INFO_BOX_POSITIONS_MOBILE = {
  1: { bottom: '-1%', right: '-2%', className: 'mobile-infobox' },
  2: { bottom: '0', right: '0', className: 'mobile-infobox' },
  3: { bottom: '-2%', right: '-1.5%', className: 'mobile-infobox' },
  4: { bottom: '0', right: '-4.5%', className: 'mobile-infobox' },
  5: { bottom: '0', right: '-4%', className: 'mobile-infobox' },
  6: { bottom: '0', right: '-4.5%', className: 'mobile-infobox' },
  9: { bottom: '0', right: '-3.5%', className: 'mobile-infobox' },
} as const;

// ──────── RENDER FUNCTIONS ────────
const renderStandardRoom = (
  roomInfo: BaseRoomType,
  onUpgradeClick: RoomInfoBoxProps['onUpgradeRoomBtnClick'],
  currentNumAnts?: number
) => (
  <div className={`infobox id-${roomInfo.roomId}`}>
    <div className='main-box'>
      <div className='room-name'>{roomInfo.name}</div>
      {roomInfo.capacity_ants && (
        <>
          <div className='number-ants'>
            <img src='/images/finals/icons/recorte_ant.png' alt='Ant icon' />
            <span className='current'>{currentNumAnts}</span>
            <span className='max'>/{roomInfo.level}</span>
          </div>
          <div className='power-ants'>
            <p>TOTAL POWER</p>
            <span className='current'>{roomInfo.currentRoomAntsPower}</span>
            <span className='max'>/{roomInfo.maxAllocPowerCurrentLvl}</span>
          </div>
        </>
      )}
    </div>
    <div
      className='secondary-box'
      onClick={(e) => {
        e.stopPropagation();
        onUpgradeClick!(roomInfo.roomId);
      }}
    >
      <div className='inside-secondary-box'>
        <span className='lv'>LV</span>
        <span className='lv-num'>{roomInfo.level}</span>
        <img src='/images/finals/icons/arrow_icon.png' alt='arrow icon' />
      </div>
    </div>
  </div>
);

const renderStorage = (roomInfo: WareHouse, onUpgradeClick: RoomInfoBoxProps['onUpgradeRoomBtnClick']) => (
  <div className={`infobox id-${roomInfo.roomId}`}>
    <div className='main-box'>
      <div className='room-name'>{roomInfo.name}</div>
      <div className='warehouse-info'>
        <img src='/images/finals/icons/storage_box_icon.png' alt='storage icon' />
        <span className='current'>{roomInfo.currentMaterialTotalCount}</span>
        <span className='max'>/{roomInfo.currentCapacityByLevel}</span>
      </div>
    </div>
    <div className='secondary-box' onClick={() => onUpgradeClick!(roomInfo.roomId)}>
      <div className='inside-secondary-box'>
        <span className='lv'>LV</span>
        <span className='lv-num'>{roomInfo.level}</span>
        <img src='/images/finals/icons/arrow_icon.png' alt='arrow icon' />
      </div>
    </div>
  </div>
);

const renderHospital = (roomInfo: Hospital, onUpgradeClick: RoomInfoBoxProps['onUpgradeRoomBtnClick']) => (
  <div className={`infobox id-${roomInfo.roomId}`}>
    <div className='main-box'>
      <div className='room-name'>{roomInfo.name}</div>
      <div className='hospital-info'>
        <img src='/images/finals/icons/hospital_HP_icon.png' alt='hospital icon' />
        <span className='current-pool'>{roomInfo.healPool}</span>
      </div>
    </div>
    <div className='secondary-box' onClick={() => onUpgradeClick!(roomInfo.roomId)}>
      <div className='inside-secondary-box'>
        <span className='lv'>LV</span>
        <span className='lv-num'>{roomInfo.level}</span>
        <img src='/images/finals/icons/arrow_icon.png' alt='arrow icon' />
      </div>
    </div>
  </div>
);

const renderDefaultRoom = (roomInfo?: BaseRoomType) => (
  <div className='info-content'>
    <div className='room-name'>{roomInfo?.name || 'Room'}</div>
  </div>
);

// ──────── SHARED CONTENT RENDERER ────────
const renderRoomContent = (
  roomId: number,
  onUpgradeClick: ColonyBloc['toggleUpgradeRoomModal'],
  toggleCallSellerDialog: ColonyBloc['toggleCallSellerDialog'],
  refreshColonyData: ColonyBloc['refreshColonyData'],  
  roomInfo?: BaseRoomType,
  currentNumAnts?: number,
  sellerInfo?: Seller
) => {
  if (ROOM_TYPES.STANDARD_ROOMS.includes(roomId) && roomInfo) {
    return renderStandardRoom(roomInfo, onUpgradeClick, currentNumAnts);
  }
  if (roomId === ROOM_TYPES.SELLER && sellerInfo) {
    return <SellerInfoBox sellerInfo={sellerInfo} toggleCallSellerDialog={toggleCallSellerDialog} refreshColonyData={refreshColonyData} />;
  }
  if (roomId === ROOM_TYPES.STORAGE && roomInfo) {
    return renderStorage(roomInfo as WareHouse, onUpgradeClick);
  }
  if (roomId === ROOM_TYPES.HOSPITAL && roomInfo) {
    return renderHospital(roomInfo as Hospital, onUpgradeClick);
  }
  return renderDefaultRoom(roomInfo);
};

// ──────── DESKTOP INFO BOX ────────
const RoomInfoBox = (props: RoomInfoBoxProps) => {
  if (!props.isVisible) {
    return null;
  }
  const pos = INFO_BOX_POSITIONS_DESKTOP[props.roomId];
  if (!pos) {
    return null;
  }
  const style = {
    position: 'absolute',
    top: pos.top,
    '--base-left': pos.left,
    '--base-right': pos.right,
    '--base-top': pos.top,
  } as React.CSSProperties;
  return (
    <div className={`room-info-box room-${props.roomId} ${pos.className}`} style={style}>
      {renderRoomContent(
        props.roomId,
        props.onUpgradeRoomBtnClick,
        props.toggleCallSellerDialog,
        props.refreshColonyData,
        props.roomInfo,
        props.currentNumAnts,
        props.sellerInfo
      )}
    </div>
  );
};

// ──────── MOBILE INFO BOX ────────
export const RoomMobileInfoBox = (props: RoomInfoBoxProps) => {
  if (!props.isVisible) {
    return null;
  }
  const pos = INFO_BOX_POSITIONS_MOBILE[props.roomId];
  if (!pos) {
    return null;
  }
  const style = {
    position: 'absolute',
    '--base-bottom': pos.bottom,
    '--base-right': pos.right,
  } as React.CSSProperties;
  return (
    <div className={`room-info-box room-${props.roomId} ${pos.className}`} style={style}>
      {renderRoomContent(
        props.roomId,
        props.onUpgradeRoomBtnClick,
        props.toggleCallSellerDialog,
        props.refreshColonyData,
        props.roomInfo,
        props.currentNumAnts,
        props.sellerInfo
      )}
    </div>
  );
};

export default RoomInfoBox;
