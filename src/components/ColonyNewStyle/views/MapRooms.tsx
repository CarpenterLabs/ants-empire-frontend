import React from 'react';
import { RoomDataPosition, ColonyViewProps, MapRoomsProps } from '../types/Colony';
import Room from './Room';
import RoomInfoBox from './RoomInfoBox';

// ──────── BASE CONFIGS ────────
const baseRoomsDesktop: RoomDataPosition[] = [
  { id: 1, name: 'Barrack', src: '/images/finals/room_barrack.png', top: 71.6, left: 4.49, width: 26.15, height: 26.34 },
  { id: 2, name: 'Control Room', src: '/images/finals/room_control.png', top: 21.02, left: 3.32, width: 27.58, height: 23.52 },
  { id: 3, name: 'Living Quarter', src: '/images/finals/room_quarter.png', top: 45.02, left: 1.87, width: 28.36, height: 24.95 },
  { id: 4, name: 'Workshop', src: '/images/finals/room_workshop.png', top: 42.36, left: 76.64, width: 20.91, height: 19.77 },
  { id: 5, name: 'Storage', src: '/images/finals/room_storage.png', top: 82.41, left: 76.46, width: 17.6, height: 17.18 },
  { id: 6, name: 'Hospital', src: '/images/finals/room_hospital.png', top: 63.56, left: 73.33, width: 21.02, height: 18.19 },
  {
    id: 7,
    name: 'Collection',
    src: '/images/finals/room_collection_empty.png',
    top: 69.44,
    left: 38.68,
    width: 29.48,
    height: 26.76,
  },
  { id: 8, name: 'Tavern', src: '/images/finals/room_tavern.png', top: 28.86, left: 37.82, width: 30.73, height: 35.23 },
  { id: 9, name: 'Seller', src: '/images/finals/room_seller_on.png', top: 20.95, left: 75.0, width: 17.42, height: 20.79 },
  { id: 10, name: 'Expedition', src: '/images/finals/room_expedition.png', top: 0, left: 22.4, width: 55.18, height: 20.79 },
];

const baseRoomsMobile: RoomDataPosition[] = [
  { id: 1, name: 'Barrack', src: '/images/finals/room_barrack.png', width: 95, position: 5 },
  { id: 2, name: 'Control Room', src: '/images/finals/room_control.png', width: 95, position: 3 },
  { id: 3, name: 'Living Quarter', src: '/images/finals/room_quarter.png', width: 95, position: 4 },
  { id: 4, name: 'Workshop', src: '/images/finals/room_workshop.png', width: 95, position: 7 },
  { id: 5, name: 'Storage', src: '/images/finals/room_storage.png', width: 95, position: 9 },
  { id: 6, name: 'Hospital', src: '/images/finals/room_hospital.png', width: 95, position: 8 },
  { id: 7, name: 'Collection', src: '/images/finals/room_collection_empty.png', width: 95, position: 2 },
  { id: 8, name: 'Tavern', src: '/images/finals/room_tavern_mobile.png', width: 95, position: 1 },
  { id: 9, name: 'Seller', src: '/images/finals/room_seller_on.png', width: 95, position: 6 },
  { id: 10, name: 'Expedition', src: '/images/finals/UI_BG_NoUnderground.png', width: 375, position: 0 },
];

// ──────── HELPERS ────────
const getRooms = (base: RoomDataPosition[], sellerActive: boolean): RoomDataPosition[] =>
  base.map((r) =>
    r.id === 9 ? { ...r, src: sellerActive ? '/images/finals/room_seller_on.png' : '/images/finals/room_seller_off.png' } : r
  );

const buildRoomData = (room: RoomDataPosition, props: ColonyViewProps) => {
  const showInfoBox = ![7, 8, 10].includes(room.id);
  const roomInfo = room.id !== 10 ? props.colonyData.rooms.find((r) => Number(r.roomId) === room.id) : undefined;
  const sellerInfo = room.id === 9 ? props.colonyData.seller : undefined;
  const spotsInfo =
    room.id === 7
      ? {
          disabledOverlaySrc: '/images/finals/icons/unavailable_icon.png',
          chestSrc: '/images/finals/icons/random.png',
          colonyData: props.colonyData,
          handlerManageSpot: props.handlerManageSpot,
          refreshColonyData: props.refreshColonyData,
        }
      : undefined;
  const currentNumAnts =
    room.id === 1
      ? props.colonyData.ants_resume.type.worker
      : room.id === 2
      ? props.colonyData.ants_resume.type.flying
      : room.id === 3
      ? props.colonyData.ants_resume.type.soldier
      : undefined;
  const showLights = room.id !== 9 || props.colonyData.seller.available.active;

  return { room, showInfoBox, roomInfo, sellerInfo, spotsInfo, currentNumAnts, showLights };
};

// ──────── ROOMS CONTAINER ────────
const MapRooms = (props: MapRoomsProps) => {
  const sellerActive = props.colonyData.seller.available.active;
  const base = props.isMobile ? baseRoomsMobile : baseRoomsDesktop;
  const roomsList = getRooms(base, sellerActive);

  // Mobile
  if (props.isMobile) {
    roomsList.sort((a, b) => a.position! - b.position!);
    return (
      <div className='room-list-vertical'>
        {roomsList.map((entry) => {
          const { room, showInfoBox, roomInfo, sellerInfo, spotsInfo, currentNumAnts, showLights } = buildRoomData(entry, props);
          return (
            <Room
              key={room.id}
              {...room}
              showLights={showLights}
              roomInfo={roomInfo}
              sellerInfo={sellerInfo}
              spotsInfo={spotsInfo}
              currentNumAnts={currentNumAnts}
              getOpenDetailModalByRoomId={props.getOpenDetailModalByRoomId}
              isMobile
              showInfoBox={showInfoBox}
              handleClickUpgradeRoomBtn={props.handleClickUpgradeRoomBtn}
              toggleCallSellerDialog={props.toggleCallSellerDialog}
            />
          );
        })}
      </div>
    );
  }

  // Desktop
  return (
    <>
      {roomsList.map((entry) => {
        const { room, showInfoBox, roomInfo, sellerInfo, spotsInfo, currentNumAnts, showLights } = buildRoomData(entry, props);
        return (
          <React.Fragment key={room.id}>
            <Room
              {...room}
              showLights={showLights}
              roomInfo={roomInfo}
              sellerInfo={sellerInfo}
              spotsInfo={spotsInfo}
              currentNumAnts={currentNumAnts}
              getOpenDetailModalByRoomId={props.getOpenDetailModalByRoomId}
              isMobile={false}
              showInfoBox={false}
              handleClickUpgradeRoomBtn={props.handleClickUpgradeRoomBtn}
            />
            {showInfoBox && (
              <RoomInfoBox
                roomId={room.id}
                roomInfo={roomInfo}
                sellerInfo={sellerInfo}
                currentNumAnts={currentNumAnts}
                isVisible={showInfoBox}
                onUpgradeRoomBtnClick={props.handleClickUpgradeRoomBtn}
                toggleCallSellerDialog={props.toggleCallSellerDialog}
                refreshColonyData={props.refreshColonyData}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default MapRooms;
