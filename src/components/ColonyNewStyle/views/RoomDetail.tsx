import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { getItemTypeByItem } from '@ComponentsRoot/Inventory/Utils/InventoryUtils';
import InventoryItem from '@ComponentsRoot/Inventory/views/InventoryItem';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { IntlShape } from 'react-intl';
import Style from '../styles/roomDetail.module.scss';
import { BaseRoomType } from '../../Colony/types/RoomType';
import { Button } from 'reactstrap';
import ColonyBloc from '../../Colony/bloc/ColonyBloc';
import { getEmblem } from '../types/RoomType';



const RoomDetail = (props: {
  ants: Ant[];
  intl: IntlShape;
  handleCloseModalFn: () => void;
  room: BaseRoomType;
  isRoomDetailOpen: boolean;
  toggleUpgradeRoomModal: ColonyBloc['toggleUpgradeRoomModal'];
  toggleAddAntsModal: ColonyBloc['handleOpenAddAntToRoomModal'];
}) => {
  //   const outletContext: OutletContextType = useOutletContext<OutletContextType>();

  const getEmptySlotBg = (roomId: number): string => {
    switch (roomId) {
      case 1:
        return '/images/finals/roomDetail/barrack_card_default.png';
      case 2:
        return '/images/finals/roomDetail/control_card_default.png';
      case 3:
        return '/images/finals/roomDetail/quarter_card_default.png';
      default:
        return '/images/finals/roomDetail/control_card_default.png';
    }
  };

  const mountRoomDetailModalBody = () => {
    const totalSlots = 10;
    // const filledSlots = props.ants;
    // const emptySlots = Array.from({ length: totalSlots - filledSlots.length });

    return (
      <div className={Style.roomDetailMain}>
        <div className={'left'}>
          <div className='levelZone'>
            <span>LVL</span>
            <span className='lvlVal'>{props.room.level}</span>
          </div>
          <div className='roomImg'>
            <img className='roomEmblem' src={getEmblem(props.room.roomId)} alt='room emblem' />
          </div>
          <div className={'stats'}>
            <div className={'stat total'}>
              <span className='title'>TOTAL ANTS</span>
              <span className='value'>
                {props.ants.length}
                <span className='sub'>/{totalSlots}</span>
              </span>
            </div>
            <div className={'stat pwr'}>
              <span className='title'>TOTAL POWER</span>
              <span className='value'>
                {props.ants.reduce((acc, ant) => acc + (ant.power || 0), 0)}
                <span className='sub'>/{props.room.maxAllocPowerCurrentLvl}</span>
              </span>
            </div>
          </div>
          <Button onClick={() => props.toggleUpgradeRoomModal(props.room.roomId)} className={'levelUpBtn'}>
            LEVEL UP
          </Button>
        </div>

        <div className={'right'}>
          <div className={'cardGrid'}>
            {Array.from({ length: 10 }).map((_, index) => {
              const ant = props.ants[index];
              const isUnlocked = index < props.room.level!;

              if (ant) {
                return (
                  <div className={'cardSlot withAnt'} key={`filled-${index}`}>
                    <InventoryItem item={ant} itemType={getItemTypeByItem(ant)} />
                    <div className={'cardButtons'}>
                      <button className={'detailBtn'}>DETAIL</button>
                      <button className={'removeBtn'}>REMOVE</button>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className={'cardSlot'} key={`empty-${index}`}>
                    <div
                      onClick={() => {
                        if (isUnlocked) {
                          props.toggleAddAntsModal(props.room);
                        }
                      }}
                      className={`emptySlot ${isUnlocked ? 'canAdd' : 'emptyAndLocked'}`}
                    >
                      <img
                        src={isUnlocked ? '/images/finals/roomDetail/add_icon.png' : getEmptySlotBg(props.room.roomId)}
                        alt={isUnlocked ? 'Add' : 'Locked'}
                        className={`${isUnlocked ? 'addimg' : 'blockedimg'}`}
                      />
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  };

  const mountRoomDetailModalHeader = () => {
    return (
      <div className={Style.assignModalHeader}>
        <div className='RoomDetailHeader'>
          <div>{props.room.name}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {props.isRoomDetailOpen && (
        <CustomModal
          size={'xl'}
          body={mountRoomDetailModalBody()}
          open={props.isRoomDetailOpen}
          class={'dormitoryMainModal'}
          title={mountRoomDetailModalHeader()}
          togglerModal={props.handleCloseModalFn}
          modalHeaderClassName='standarModalHeader'
        />
      )}
    </>
  );
};

export default RoomDetail;
