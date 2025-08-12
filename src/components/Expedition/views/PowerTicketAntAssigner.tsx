import { Ant, powerTypeSteps } from '@ComponentsRoot/Ant/types/Ant';
import { getItemTypeByItem } from '@ComponentsRoot/Inventory/Utils/InventoryUtils';
import { InventoryItemPropsType } from '@ComponentsRoot/Inventory/types/InventoryItemPropsType';
import InventoryItem from '@ComponentsRoot/Inventory/views/InventoryItem';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { useState } from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import Style from '../styles/powerTicketAssigner.module.scss';
import { Button } from 'reactstrap';
import { PurchasedPowerTicket } from '../types/PowerTicket';
import SocketIOService from '@Services/SocketIOService';
import { useOutletContext } from 'react-router/dist';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';

const PowerTicketAntAssigner = (props: {
  addPowerToSelectedAntFn: (purchasedPowerTicket: PurchasedPowerTicket, ant: Ant, socket: SocketIOService) => Promise<void>;
  ants: Ant[];
  intl: IntlShape;
  handleCloseModalFn: () => void;
  purchasedPowerTicket: PurchasedPowerTicket;
  isPowerTicketAssignerOpen: boolean;
}) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  const [selected, setSelected] = useState<string[]>([]);
  const MAX_SELECTION = 1;

  const getSelectedAnt = () => {
    return props.ants.find((ant) => ant._id === selected[0]);
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

  // Returns if the user can still selecting registers
  const areMoreSelectedThanAllowed = (): boolean => {
    return selected.length >= MAX_SELECTION;
  };

  // const getTotalPower = () => {
  //   const antsSelected = props.antsOnInventory.filter((ant) => selected.includes(ant._id!));
  //   const powerTotalToIncrease = antsSelected.reduce((sum, item) => sum + item.power, 0);
  //   return powerTotalToIncrease + props.room.currentRoomAntsPower!;
  // };

  // Get only the ants on inventory filtered by room type, that way the user can't
  // assign an incorrect type ant to the desired room
  const setSelectedOnAnts = (): Ant[] => {
    const antsByRarity = props.ants.filter((ant) => ant.rarity === props.purchasedPowerTicket.rarity && !ant.isUpgraded);
    return antsByRarity.map((antInMap: Ant) => {
      return { ...antInMap, selected: selected.includes(antInMap._id!) };
    });
  };

  const mountPowerTicketAssignerModalBody = () => {
    return (
      <div className={Style.addPowerToAntMainRegion}>
        <div className='selectAntTxt'>
          <span>{props.intl.formatMessage({ id: 'expedition.powerTicketAssignerTitle' })}</span>
        </div>
        <div className='antsToAssign'>
          {setSelectedOnAnts().map((item, idx) => {
            return (
              <InventoryItem
                onCardClick={(item: InventoryItemPropsType['item']) => {
                  handleSelection(item);
                }}
                key={idx}
                itemType={getItemTypeByItem(item)}
                item={item}
                miniCard
              />
            );
          })}
        </div>

        <div className='powerPreview fadeIn'>{getPowerSumResultPreview()}</div>
      </div>
    );
  };

  const mountAssignerModalHeader = () => {
    return (
      <div className={Style.assignModalHeader}>
        <div className='assignerHeader'>
          <div>
            Use {props.purchasedPowerTicket.rarity} Power Ticket +{props.purchasedPowerTicket.powerAmount}
          </div>
        </div>
      </div>
    );
  };

  const getPowerSumResultPreview = () => {
    let newPower = 0;
    if (selected && selected[0]) {
      // Find the next type limit for the current power
      const nextStep = powerTypeSteps.find((step) => step > getSelectedAnt()!.power);

      const sum = getSelectedAnt()!.power + props.purchasedPowerTicket.powerAmount;
      if (sum > nextStep!) {
        newPower = nextStep!;
      } else {
        newPower = sum;
      }

      // return `Current Power: ${getSelectedAnt()!.power} ➡️ New Power: ${newPower}`;
      return (
        <div className='pwrZone fadeIn'>
          <span>Current Power:</span>
          <span className='val'>{getSelectedAnt()!.power}</span>
          <img src='/images/finals/use_power/arrow_icon.png' alt='arrow' style={{ width: '35px' }} />
          <span>New Power:</span>
          <span className='valTwo'>{newPower}</span>
        </div>
      );
    }

    return <></>;
  };

  const mountModalFooterBtns = () => {
    return (
      <div className='modalFooter'>
        <Button
          disabled={selected.length === 0}
          className='upgradeBtn'
          // color='primary'
          onClick={async () =>
            await props.addPowerToSelectedAntFn(props.purchasedPowerTicket, getSelectedAnt()!, outletContext.socketIOService)
          }
        >
          <FormattedMessage id='ant.powerUp' />
        </Button>
      </div>
    );
  };

  return (
    <>
      {props.isPowerTicketAssignerOpen && (
        <CustomModal
          size={'lg'}
          body={mountPowerTicketAssignerModalBody()}
          open={props.isPowerTicketAssignerOpen}
          class={Style.assignAntToRoomModal}
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

export default PowerTicketAntAssigner;
