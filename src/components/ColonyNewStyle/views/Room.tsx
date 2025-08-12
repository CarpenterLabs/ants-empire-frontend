import React from 'react';
import { RoomProps } from '../types/Colony';
import { RoomLights } from './MapLights';
import { SpotsView } from './SpotsView';
import { RoomMobileInfoBox } from './RoomInfoBox';

const Room = (props: RoomProps) => {
  const containerStyle: React.CSSProperties = props.isMobile
    ? { width: `${props.width}%`, position: 'relative' }
    : {
        position: 'absolute',
        top: `${props.top}%`,
        left: `${props.left}%`,
        width: `${props.width}%`,
        height: `${props.height}%`,
      };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: props.isMobile ? 'auto' : '100%',
    objectFit: 'contain',
    pointerEvents: 'none',
  };

  return (
    <div
      className={`room ${props.id === 9 && !props.sellerInfo?.available.active ? 'seller-inactive' : ''}`}
      data-room-id={props.id}
      {...(props.isMobile ? { 'data-room-position': props.position } : {})}
      style={containerStyle}
      onClick={() => props.getOpenDetailModalByRoomId(props.id)}
    >
      <img src={props.src} alt={props.roomInfo?.name || ''} style={imgStyle} />

      {/* SpotsView solo para Collection (id === 7) */}
      {props.id === 7 && props.spotsInfo && <SpotsView roomId={props.id} isVisible spotsInfo={props.spotsInfo} />}

      {/* Luces de la sala */}
      <RoomLights roomId={props.id} isVisible={props.showLights} mobile={props.isMobile} />

      {/* InfoBox*/}
      {props.isMobile && props.showInfoBox && (
        <RoomMobileInfoBox
          roomId={props.id}
          roomInfo={props.roomInfo}
          sellerInfo={props.sellerInfo}
          currentNumAnts={props.currentNumAnts}
          isVisible={props.showInfoBox}
          onUpgradeRoomBtnClick={props.handleClickUpgradeRoomBtn!}
          toggleCallSellerDialog={props.toggleCallSellerDialog!}
          refreshColonyData={props.refreshColonyData!}
        />
      )}
    </div>
  );
};

export default Room;
