import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import { BaseRoomType, Hospital, WareHouse } from '../types/RoomType';
import ColonyBloc from '../bloc/ColonyBloc';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { IntlShape } from 'react-intl';
import { PurchasedPowerTicket } from '@ComponentsRoot/Expedition/types/PowerTicket';

const RoomInfoCard = (props: {
  toggleUpgradeRoom: ColonyBloc['toggleUpgradeRoomModal'];
  toggleUnlockRoom: ColonyBloc['toggleUnlockRoomModal'];
  ants: Ant[];
  room: BaseRoomType;
  mBoxes?: PurchasedMaterialBox[];
  purchasedTickets?: PurchasedPowerTicket[];
  roomContent?: JSX.Element | JSX.Element[];
  onClickAddAntToRoom?: (room: BaseRoomType) => Promise<void>;
  handleOpenPurchasedMaterialBox?: (purchasedMaterialBox: PurchasedMaterialBox) => Promise<void>;
  colony: Colony;
  intl: IntlShape;
  onClickAntCard: ColonyBloc['handleClickAntMiniCard'];
  onClickPowerTicketCard?: ColonyBloc['handleClickMiniPwrTicketCard'];
  positions: {
    left: string;
    top: string;
  };
  large: boolean;
  seller?: Colony['seller'];
}) => {
  const renderRoomInfo = () => {
    if (props.room.roomId === 6) {
      return (
        <div className='hospital-right-sidebar'>
          <img className='cross' src='/images/finals/icons/hospital_HP_icon.png' alt='hospital cross' />{' '}
          <span>{`${(props.room as Hospital).healPool}`}</span>
        </div>
      );
    } else if (props.room.roomId === 5) {
      return (
        <div className='hospital-right-sidebar'>
          <img className='storage' src='/images/finals/icons/storage_box_icon.png' alt='storage box' />{' '}
          <span>{`${(props.room as WareHouse).currentCapacityByLevel}`}</span>
        </div>
      );
    } else {
      return props.room.capacity_ants ? (
        <div
          onClick={async () => await props.onClickAddAntToRoom!(props.room)}
          className={`number-ants ${props.ants.length === props.room.level ? 'disabledAddAnts' : ''} ${
            props.room.level === 10 ? 'max' : ''
          }`}
        >
          <div className='roomInfo'>
            <div className={`capacityInfo ${props.ants.length === props.room.level ? 'max-capacity' : ''}`}>
              <img className='antIcon' src='/images/finals/icons/ant_icon.png' alt='antIconinRoom' />
              {props.ants.length !== props.room.level ? <img className='sum' src={`/images/add-room.png`} alt='add Ants' /> : ''}
              <div className='antsCapLine'>
                <span className='antsInRoom'>{`${props.ants.length ? props.ants.length : 0}`}</span>
                <span className='antRoomRest'>{`/${props.room.level}`}</span>
              </div>
            </div>
            <p className='power'>
              ⚡<span className='currRoomPwr'>{`${props.room.currentRoomAntsPower}`}</span>
              <span className='currRoomMax'>{`/${props.room.maxAllocPowerCurrentLvl}`}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className='number-ants trans'></div>
      );
    }
  };

  const getSellerCleanStatus = () => {
    const { freeCall, paidCall } = props.seller!.available!;
    if (freeCall) {
      return props.intl.formatMessage({ id: 'colony.seller.free' });
    } else if (paidCall) {
      return props.intl.formatMessage({ id: 'colony.seller.nectar' }) + props.seller!.callNectarCost;
    }
    return props.intl.formatMessage({ id: 'colony.seller.nextMonday' });
  };

  return (
    <>
      {props.room.level! >= 1 ? (
        <div
          style={{
            left: props.positions.left,
            top: props.positions.top,
          }}
          className={`fadeIn info-box colony-room ${props.room.roomId === 6 || props.room.roomId === 5 ? 'variant' : ''} ${
            props.large ? 'large' : 'small'
          }`}
        >
          <div className='top-bar'>
            <p className='title-room'>
              {/* <span className='emoji-room'> {roomsEmojisRelation[props.room.roomId as number]} </span> */}
              {props.intl.formatMessage({ id: `colony.room.${props.room.name}` })}
            </p>
            {renderRoomInfo()}
          </div>

          <div className='content'>
            {props.room.upgradeable ? (
              <div
                className={`level ${props.room.level === 10 ? 'max' : ''}`}
                onClick={props.room.level !== 10 ? () => props.toggleUpgradeRoom(props.room.roomId) : undefined}
              >
                LV <span className='lvlnumb'>{props.room.level}</span>
                {props.room.level !== 10 ? <img src='/images/finals/icons/arrow_icon.png' alt='arrowlevelup' /> : ''}
              </div>
            ) : (
              <div className='level'>
                {props.room.roomId === 7 ? <span className='sellerTxt'>{getSellerCleanStatus()} </span> : ''}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`info-box colony-room disabled ${props.large ? 'large' : ''}`}
          style={{
            left: props.positions.left,
            top: props.positions.top,
          }}
        >
          <div className='top-bar'>
            <p className='title-room'>
              {/* <span className='emoji-room'> {roomsEmojisRelation[props.room.roomId as number]} </span> */}
              <b>{props.room.name}</b>
            </p>
            {renderRoomInfo()}
          </div>
          <div className='content'>
            {props.room.upgradeable ? (
              <p className='level' onClick={() => props.toggleUnlockRoom(props.room.roomId)}>
                <span>{/* <img className='arrow' src={`/images/lock_1.png`} alt='lock' /> */}</span>
              </p>
            ) : (
              <p className='level trans'></p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RoomInfoCard;
