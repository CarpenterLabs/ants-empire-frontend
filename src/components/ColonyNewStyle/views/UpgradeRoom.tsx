import CustomModal from '@ComponentsRoot/core/CustomModal';
import { FormattedMessage, IntlShape } from 'react-intl';
import Style from '../styles/upgradeRoom.module.scss';
import { BaseRoomType, Hospital, WareHouse, WorkShop } from '../types/RoomType';
import { Button } from 'reactstrap';
import { getMaterialEmojiByToolRequirement } from '@ComponentsRoot/BlackSmith/views/BlackSmithView';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useOutletContext } from 'react-router-dom';
import ColonyBloc from '../bloc/ColonyBloc';
import { ColonySubject } from '../types/ColonySubject';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';

const UpgradeRoom = (props: {
  intl: IntlShape;
  room: BaseRoomType;
  upgradeRoom: ColonyBloc['upgradeRoom'];
  toggleUpgradeRoomModal: ColonyBloc['toggleUpgradeRoomModal'];
  colonyData: ColonySubject['colonyData'];
  isUpgradeRoomOpen: boolean;
}) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();

  const getModalTitle = () => (
    <>
      <FormattedMessage id='colony.room.upgrade.accept' /> {`${props.room.name}`}
    </>
  );
  const mountModalFooterBtns = () => {
    const roomSelected = props.room;
    // const roomSelected = props.data.colonyData?.rooms.find((room) => room.roomId === props.data.selectedRoomToUpgrade);
    return (
      <>
        <Button
          disabled={!roomSelected?.nextLevel!.status}
          color='primary'
          className='upgradeBtn'
          onClick={async () => await props.upgradeRoom(roomSelected!.roomId, outletContext)}
        >
          <FormattedMessage id='colony.room.upgrade.accept' />
        </Button>
      </>
    );
  };

  const mountMainModalBody = () => {
    const roomSelected = props.room;
    //const roomSelected = props.data.colonyData?.rooms.find((room) => room.roomId === props.data.selectedRoomToUpgrade);
    if (roomSelected) {
      return (
        <div className={`${Style.gridUpgrade} fadeIn`}>
          {renderNextLvlRoomByType(roomSelected)}
          <div className='reqs'>
            {roomSelected?.nextLevel!.requeriments.map((requeriment, key) => {
              let materialAmmountToUpgrade;
              if (requeriment.materialId === 0) {
                // El ammount de nectar actual de ese momento del player
                materialAmmountToUpgrade = outletContext.accountData?.nectar!;
              } else {
                materialAmmountToUpgrade = props.colonyData?.materials.find(
                  (material) => material.materialId === requeriment.materialId
                )!.value;
              }
              return (
                <div
                  key={key}
                  className={`material-required ${
                    materialAmmountToUpgrade !== undefined && materialAmmountToUpgrade < requeriment.quantity ? 'unavailable' : ''
                  }`}
                >
                  <div className={`material-box type-${requeriment.materialId}`}>
                    <span>
                      {requeriment.materialId === 0 ? (
                        <img alt='Nectar Logo' style={{ width: '35px' }} src={`/images/finals/icons/nectar.png`} />
                      ) : (
                        <img
                          alt={MATERIAL_LIST.find((m) => m.id === requeriment.materialId)?.alt}
                          src={MATERIAL_LIST.find((m) => m.id === requeriment.materialId)?.src}
                        />
                      )}
                    </span>
                  </div>
                  <span className='text'>{requeriment.quantity}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return <p></p>;
    }
  };

  const renderNextLvlRoomByType = (roomSelected: BaseRoomType) => {
    if (roomSelected.capacity_ants) {
      return (
        <div className='next-power'>
          <div className='ants'>
            <img className='micro-ant' src='/images/finals/icons/ant_icon.png' alt='ant' />
            <span className='currentLvlAndNextOne'>{roomSelected.level}</span>
            <img className='arrow' src='/images/finals/upgrade_room/arrow.png' alt='upgrade' />
            <span className='currentLvlAndNextOne'>{roomSelected.nextLevel?.ants}</span>
          </div>
          <div className='power'>
            <span>💪</span>
            <span className='currentLvlAndNextOne'>{roomSelected.maxAllocPowerCurrentLvl}</span>
            <img className='arrow' src='/images/finals/upgrade_room/arrow.png' alt='upgrade' />
            <span className='currentLvlAndNextOne'>{roomSelected.nextLevel?.power}</span>
          </div>
        </div>
      );
    } else if (roomSelected.roomId === 5) {
      const warehouse = roomSelected as WareHouse;
      return (
        <div className='next-power'>
          <div className='power'>
            <img src='/images/finals/icons/storage_box_icon.png' alt='storage icon' />
            <span className='currentLvlAndNextOne'>{warehouse.capacity_by_levels[warehouse.level!]}</span>
            <img className='arrow' src='/images/finals/upgrade_room/arrow.png' alt='upgrade' />
            <span className='currentLvlAndNextOne'>{warehouse.capacity_by_levels[warehouse.level! + 1]}</span>
          </div>
        </div>
      );
    } else if (roomSelected.roomId === 6) {
      const hospital = roomSelected as Hospital;
      return (
        <div className='next-power'>
          <div className='power'>
            <img src='/images/finals/icons/hospital_HP_icon.png' alt='hospital icon' />
            <span className='currentLvlAndNextOne'>{hospital.restore_by_levels[hospital.level!].discount}%</span>
            <img className='arrow' src='/images/finals/upgrade_room/arrow.png' alt='upgrade' />
            <span className='currentLvlAndNextOne'>{hospital.restore_by_levels[hospital.level! + 1].discount}%</span>
          </div>
        </div>
      );
    } else if (roomSelected.roomId === 4) {
      const workshop = roomSelected as WorkShop;
      return (
        <div className='next-power big workshop'>
          <span className='currAndNext'>Current</span>
          <div className='discountByLvlsInfoZone'>
            <div className='inside header'>
              <span className='lvSpan'>{props.intl.formatMessage({ id: 'LV' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.hacha' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.pico' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.pala' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.cubo' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.regadera' })}</span>
            </div>
            <div className={`inside levelRow currentLevel`}>
              {<div className={`cell lvlCell`}>{workshop.level!}</div>}
              {Object.keys(workshop.discount_by_levels![workshop.level!]).map((discountKey, toolIndex) => (
                <div className='cell' key={discountKey}>
                  {workshop.discount_by_levels![workshop.level!][discountKey].map((cost, idx) => (
                    <span className='costData' key={idx}>
                      {getMaterialEmojiByToolRequirement(toolIndex + 1, cost.materialId, '25px')} {cost.quantity}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <span className='currAndNext'>Next</span>
          <div className='discountByLvlsInfoZone'>
            <div className='inside header'>
              <span className='lvSpan'>{props.intl.formatMessage({ id: 'LV' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.hacha' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.pico' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.pala' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.cubo' })}</span>
              <span>{props.intl.formatMessage({ id: 'colony.tool.regadera' })}</span>
            </div>
            <div className={`inside levelRow currentLevel`}>
              {<div className={`cell lvlCell ${workshop.level! + (1 % 2) ? 'even' : 'odd'}`}>{workshop.level! + 1}</div>}
              {Object.keys(workshop.discount_by_levels![workshop.level! + 1]).map((discountKey, toolIndex) => (
                <div className='cell' key={discountKey}>
                  {workshop.discount_by_levels![workshop.level! + 1][discountKey].map((cost, idx) => (
                    <span className='costData' key={idx}>
                      {getMaterialEmojiByToolRequirement(toolIndex + 1, cost.materialId, '25px')} {cost.quantity}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      {props.isUpgradeRoomOpen && (
        <CustomModal
          body={mountMainModalBody()}
          open
          size='md'
          class={`upgrade-modal ${props.room.roomId === 4 ? 'workshopModal' : ''}`}
          title={getModalTitle()}
          footer={mountModalFooterBtns()}
          togglerModal={props.toggleUpgradeRoomModal}
          modalHeaderClassName='standarModalHeader'
        />
      )}
    </>
  );
};

export default UpgradeRoom;
