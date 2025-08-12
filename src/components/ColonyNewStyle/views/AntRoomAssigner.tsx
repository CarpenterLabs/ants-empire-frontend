import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { getItemTypeByItem } from '@ComponentsRoot/Inventory/Utils/InventoryUtils';
import { InventoryItemPropsType } from '@ComponentsRoot/Inventory/types/InventoryItemPropsType';
import InventoryItem from '@ComponentsRoot/Inventory/views/InventoryItem';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { useState } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import Style from '../styles/antRoomAssigner.module.scss';
import { BaseRoomType } from '../types/RoomType';
import { Button } from 'reactstrap';
import ColonyBloc from '../bloc/ColonyBloc';

const AntRoomAssigner = (props: {
  addAntsToColonyRoomFn: ColonyBloc['addAntsToColonyRoom'];
  isAssignerOpen: boolean;
  antsOnInventory: Ant[];
  room: BaseRoomType;
  intl: IntlShape;
  antsAlreadyInsideRoom: Ant[];
  handleCloseModalFn: () => void;
}) => {
  const [selected, setSelected] = useState<string[]>([]);

  const getAllowedAntTypesByRoom = (): 'soldier' | 'flying' | 'worker' | null => {
    if (props.room.roomId === 1) return 'worker';
    if (props.room.roomId === 2) return 'flying';
    if (props.room.roomId === 3) return 'soldier';

    return null;
  };

  const handleSelection = (item: InventoryItemPropsType['item']) => {
    if (selected.includes(item._id!)) {
      setSelected(selected.filter((itemId) => itemId !== item._id));
    } else {
      // Check if already more than allowed with the available capacity of the desired room
      // if true, disable 'selection mode'
      if (areMoreSelectedThanAllowed()) {
        return;
      }
      setSelected([...selected, item._id!]);
    }
  };

  // Get only the ants on inventory filtered by room type, that way the user can't
  // assign an incorrect type ant to the desired room
  const filterDataByRoomType = (): Ant[] => {
    const allowedTypesOfAnts = getAllowedAntTypesByRoom();
    return props.antsOnInventory
      .filter((ant: Ant) => ant.type === allowedTypesOfAnts)
      .map((antInMap: Ant) => {
        return { ...antInMap, selected: selected.includes(antInMap._id!) };
      });
  };

  // Get the availableCapacity of the room
  const getRoomAvailableCapacity = () => {
    // current room level - ants inside room already
    return props.room.level! - props.antsAlreadyInsideRoom.length;
  };

  // Returns if the user can still selecting registers
  // checking the number of selected agains roomAvailableCapacity
  const areMoreSelectedThanAllowed = (): boolean => {
    // return selected.length >= props.room.level;
    return selected.length >= getRoomAvailableCapacity();
  };

  const getTotalPower = () => {
    const antsSelected = props.antsOnInventory.filter((ant) => selected.includes(ant._id!));
    const powerTotalToIncrease = antsSelected.reduce((sum, item) => sum + item.power, 0);
    return powerTotalToIncrease + props.room.currentRoomAntsPower!;
  };

  const mountAntRoomAssignerModalBody = () => {
    return (
      <div className={Style.addAntsToRoomMainRegion}>
        <div className='currentRoomInfo'>
          <div className='antsPower'>
            <span className='pwr'>{props.intl.formatMessage({ id: 'colony.antAssigner.power' })} :</span>
            <span className='pwrCurr'> {props.room.currentRoomAntsPower}</span>
            <span className='pwrTotal'>/{props.room.maxAllocPowerCurrentLvl}</span>
          </div>
          <div className='antsCountOnRoom'>
            <span className='apostrofe'>
              <b>{getAllowedAntTypesByRoom()?.toUpperCase()}</b>
              {props.intl.formatMessage({ id: 'colony.antAssigner.apostrofeSEn' })}
            </span>
            <img className='miniAntIcon' src='/images/finals/icons/ant_icon.png' alt='ant' />
            <div className='roomCount'>
              <span className='curr'>{`${props.antsAlreadyInsideRoom.length ? props.antsAlreadyInsideRoom.length : 0}`}</span>
              <span className='roomCountTotal'>{`/${props.room.level}`}</span>
            </div>
          </div>
        </div>

        <div className='infoArea'>
          <span className='pleaseMsg'>{props.intl.formatMessage({ id: 'colony.antAssigner.pleaseSelectAnts' })}</span>

          <div className='dynamicSelectZone'>
            <span className='selected'>{props.intl.formatMessage({ id: 'colony.antAssigner.selected' })?.toUpperCase()}</span>
            <span className='currentSelectionCount'> {selected.length}</span>
            <span className='roomMaxAnts'>/{getRoomAvailableCapacity()}</span>
          </div>

          <div className={`power ${getTotalPower() > props.room.maxAllocPowerCurrentLvl! && 'error'}`}>
            <span className='pwr'>{props.intl.formatMessage({ id: 'colony.antAssigner.power' })?.toUpperCase()} : </span>
            <span className='selectedSum'>{getTotalPower()}</span>
            <span className='maxsum'>/{props.room.maxAllocPowerCurrentLvl}</span>
          </div>
        </div>

        <div className='antsToAssign'>
          {filterDataByRoomType().map((item, idx) => {
            return (
              <InventoryItem
                onCardClick={(item: InventoryItemPropsType['item']) => {
                  handleSelection(item);
                }}
                multiSelectEnabled
                key={idx}
                itemType={getItemTypeByItem(item)}
                item={item}
                miniCard
              />
            );
          })}
        </div>
      </div>
    );
  };

  const mountAssignerModalHeader = () => {
    return (
      <div className={Style.assignModalHeader}>
        <div className='assignerHeader'>
          <div>{`${props.intl.formatMessage({ id: 'colony.room.addAntTo' })} ${props.room.name.toUpperCase()}`}</div>
        </div>
      </div>
    );
  };

  const mountModalFooterBtns = () => {
    return (
      <>
        <div className='footerAssigner'>
          <div className='textInventory'>
            <span className='main'>{props.intl.formatMessage({ id: 'colony.antAssigner.antsOnInventoryOfType' })} </span>
            <span className='type'>{getAllowedAntTypesByRoom()?.toUpperCase()}</span>
          </div>
          <Button
            disabled={selected.length === 0 || getTotalPower() > props.room.maxAllocPowerCurrentLvl!}
            // color='primary'
            onClick={async () => await props.addAntsToColonyRoomFn(selected)}
            className='assignBtn'
          >
            <FormattedMessage id='ant.assign' />
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      {props.isAssignerOpen && (
        <CustomModal
          size={'lg'}
          body={mountAntRoomAssignerModalBody()}
          open
          class={`${Style.assignAntToRoomModal} addAntToRoomModalMain`}
          title={mountAssignerModalHeader()}
          togglerModal={props.handleCloseModalFn}
          footer={mountModalFooterBtns()}
          modalHeaderClassName='standarModalHeader'
        />
      )}
      {/* {renderLoaderIfNeeded(props.subjectValue.isLoading)} */}
      {/* {renderToastrIfNeeded(props.subjectValue.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)} */}
    </>
  );
};

export default AntRoomAssigner;
