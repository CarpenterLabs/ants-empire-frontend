import { getItemTypeByItem } from '@ComponentsRoot/Inventory/Utils/InventoryUtils';
import InventoryItem from '@ComponentsRoot/Inventory/views/InventoryItem';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { IntlShape } from 'react-intl';
import { Fragment } from 'react';
import Style from '../styles/wareHouseModal.module.scss';
import { PurchasedPowerTicket } from '@ComponentsRoot/Expedition/types/PowerTicket';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import ColonyBloc from '../bloc/ColonyBloc';
import MiniPwrTicketCard from './MiniPwrTicketCard';
import { Inventory } from '@ComponentsRoot/Inventory/types/Inventory';
import { WareHouse } from '../types/RoomType';

const WareHouseModal = (props: {
  intl: IntlShape;
  handleCloseModalFn: () => void;
  isWareHouseModalOpen: boolean;
  mBoxes?: PurchasedMaterialBox[];
  purchasedTickets?: PurchasedPowerTicket[];
  onClickPowerTicketCard: ColonyBloc['handleClickMiniPwrTicketCard'];
  handleOpenPurchasedMaterialBox?: (purchasedMaterialBox: PurchasedMaterialBox) => Promise<void>;
  room: WareHouse;
}) => {
  const renderPurchasedTickets = () => {
    return props.purchasedTickets!.map((pwrTicket, idx) => (
      <div className={'cardSlot'} key={idx}>
        <MiniPwrTicketCard
          onClickCard={(ticket: PurchasedPowerTicket) => props.onClickPowerTicketCard!(ticket)}
          powerTicket={pwrTicket}
          key={idx}
        />
      </div>
    ));
  };

  const renderMBoxes = () => {
    const wareHouse = props.room;
    if (props.mBoxes?.length) {
      return props.mBoxes.map((materialBox: PurchasedMaterialBox, index) => {
        const countMaterialInsideBox = materialBox.materials.reduce((count, material) => count + material[1], 0);
        return materialBox.state !== 'opened' ? (
          <div className={'cardSlot'} key={`cardSlot` + index.toString()}>
            <InventoryItem
              inventoryDataKey={'purchasedMaterialBoxes' as keyof Inventory}
              multiSelectEnabled={false}
              key={index.toString()}
              onCardClick={() => null}
              itemType={getItemTypeByItem(materialBox)}
              materialBoxProperties={{
                handleOpenPurchasedMaterialBox: props.handleOpenPurchasedMaterialBox!,
                materialBoxMainBtni18nTextId: 'general.open',
                canBeOpened: wareHouse?.currentCapacityByLevel! - wareHouse?.currentMaterialTotalCount! >= countMaterialInsideBox,
                onInventory: false
              }}
              item={materialBox as PurchasedMaterialBox & { selected?: boolean }}
            />
          </div>
        ) : (
          <Fragment key={index.toString()}></Fragment>
        );
      });
    }
    return [<Fragment key={wareHouse.roomId.toString()}></Fragment>];
  };

  const mountWareHouseModalBody = () => {
    return (
      <div className={Style.wareHouseModalMain}>
        <div className={'cardGrid'}>
          {renderPurchasedTickets()}
          {renderMBoxes()}
        </div>
      </div>
    );
  };

  const mountWareHouseModalHeader = () => {
    return (
      <div className={Style.assignModalHeader}>
        <div className='WareHouseModalHeader'>
          <div>{props.intl.formatMessage({ id: 'colony.room.warehouse' })}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {props.isWareHouseModalOpen && (
        <CustomModal
          size={'lg'}
          body={mountWareHouseModalBody()}
          open={props.isWareHouseModalOpen}
          class={Style.wareHouseModalFull}
          title={mountWareHouseModalHeader()}
          togglerModal={props.handleCloseModalFn}
          modalHeaderClassName='standarModalHeader'
        />
      )}
    </>
  );
};

export default WareHouseModal;
