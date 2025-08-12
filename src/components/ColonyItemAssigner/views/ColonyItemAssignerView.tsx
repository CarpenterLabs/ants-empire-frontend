import CustomModal from '@ComponentsRoot/core/CustomModal';
import { InventoryItemPropsType } from '@ComponentsRoot/Inventory/types/InventoryItemPropsType';
import InventoryItem from '@ComponentsRoot/Inventory/views/InventoryItem';
// import { AntsLoader } from '@Layout/components/AntsLoader';
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';
import { ColonyItemAssignerViewPropsType } from '../types/ColonyItemAssignerViewPropsType';
import Style from '../styles/ColonyItemAssignerView.module.scss';
import ColonyCardAssigner from '@ComponentsRoot/Colonies/views/ColonyCardAssigner';
import { AntsLoader, renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { CryptoAntsSlider } from '@ComponentsRoot/core/CryptoAntsSlider';
import { getItemTypeByItem } from '@ComponentsRoot/Inventory/Utils/InventoryUtils';
import { BaseRoomType } from '@ComponentsRoot/Colony/types/RoomType';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { getEmblem } from '@ComponentsRoot/ColonyNewStyle/types/RoomType';

const ColonyItemAssignerView = (props: ColonyItemAssignerViewPropsType) => {
  useEffect(() => {
    (async () => {
      await props.bloc.getColonies();
      if (props.autoAssignWhenOpen) {
        await props.bloc.resolveAssignItemsToColony(props.itemsToAssign);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSelectedColonyName = () => {
    if (props.data.selectedColony) {
      return ': ' + props.data.selectedColony.name;
    }
    return '';
  };

  const mountModalFooterBtns = () => {
    return (
      <>
        <Button
          disabled={props.data.selectedColony ? false : true}
          color='primary'
          onClick={async () => await props.bloc.resolveAssignItemsToColony(props.itemsToAssign)}
        >
          <FormattedMessage id='inventory.assignElementsToColony' />
          {getSelectedColonyName()}
        </Button>
        <Button color='warning' style={{ color: 'white' }} onClick={() => props.cancelHandler()}>
          <FormattedMessage id='general.cancel' />
        </Button>
      </>
    );
  };

  const getModalTitle = () => {
    return props.bloc.providerProps.intl.formatMessage(
      {
        id: 'inventory.elementsToAssingToColony',
      },
      { itemsnumber: props.itemsToAssign.length, single: props.itemsToAssign.length === 1 ? '' : 's' }
    );
  };

  const renderItemsToAssign = () => {
    return (
      <div className='toAssign-items'>
        {props.itemsToAssign.map((item, idx) => {
          return (
            <InventoryItem
              onCardClick={(item: InventoryItemPropsType['item']) => {
                console.log(item);
              }}
              multiSelectEnabled={false}
              key={idx}
              itemType={getItemTypeByItem(item)}
              item={item}
              miniCard
            />
          );
        })}
      </div>
    );
  };

  const renderColoniesToSelect = () => {
    const coloniesCards = props.data.coloniesData!.map((colony, idx) => {
      return (
        <React.Fragment key={idx}>
          <ColonyCardAssigner
            onCardClick={() => {
              props.bloc.setSelectedColony(colony);
            }}
            miniCard
            defaultSelected={props.data.coloniesData?.length === 1}
            isSelected={props.data.selectedColony?._id === colony._id}
            {...colony}
            itemsToAssign={props.itemsToAssign}
            antsColony={colony.ants}
          />
        </React.Fragment>
      );
    });
    return (
      <div className='coloniesToSelect'>
        <CryptoAntsSlider sliderData={coloniesCards} />
      </div>
    );
  };

  const mountMainModalBody = () => {
    return (
      <>
        <div className={`${Style.itemAssignerView} fadeIn`}>
          <div className='general-box'>
            <div className='list-ants'>{renderItemsToAssign()}</div>

            <div className='arrow'>
              <img className='arrowImg' src={`/images/arrow.png`} alt='Assign Arrow' />
            </div>

            <div className='list-colonies'>{renderColoniesToSelect()}</div>
          </div>
        </div>
      </>
    );
  };

  const mountErrorsModalBody = () => {
    const colonyIdWhereHappened = props.data.assignModalErrorData?.errors[0].destinationColonyId;
    const colonyObjectFromBe: Colony = props.data.coloniesData?.find((colony) => colony._id === colonyIdWhereHappened) as Colony;

    const groupedErrorsByRoom: any = [];
    props.data.assignModalErrorData?.errors.reduce((acc, item) => {
      const { roomId, ...rest } = item;
      if (!acc[roomId]) {
        acc[roomId] = { roomId, ...rest };
        groupedErrorsByRoom.push(acc[roomId]);
      } else {
        acc[roomId] = { ...acc[roomId], ...rest };
      }
      return acc;
    }, {});
    return (
      <div className='mainErrorModalRegion'>
        <div className='destColonyTitle'>{`${props.bloc.providerProps.intl.formatMessage({
          id: 'inventory.assigner.destinationColony',
        })} (${colonyObjectFromBe.name.toUpperCase()})`}</div>
        <div className='roomsZone'>
          {groupedErrorsByRoom.map((error, idx) => {
            const roomError = colonyObjectFromBe.rooms.find((room: BaseRoomType) => room.roomId === error.roomId);
            return (
              <div className='wrapper' key={idx}>
                <div className='inRoomInfo'>
                  <span className='roomTitle'>
                    {roomError?.name.toUpperCase()}
                    {<img src={getEmblem(error.roomId)} alt='room icon' />}
                  </span>

                  <div className='errorInfoDetailed'>
                    {error.exceededCount ? (
                      <>
                        <span className='sectTitle'>
                          {props.bloc.providerProps.intl.formatMessage({
                            id: 'inventory.assigner.availableNumberAntsRoomCapacity',
                          })}
                          <span>{error.roomAvailableCapacity}</span>
                        </span>
                        <span className='sectTitle'>
                          {props.bloc.providerProps.intl.formatMessage({
                            id: 'inventory.assigner.youreTryingToAddNumberAnts',
                          })}
                          <span>{error.exceededCount}</span>
                        </span>
                      </>
                    ) : (
                      ''
                    )}
                    {error.exceededPowerBy ? (
                      <>
                        <span className='sectTitle'>
                          {props.bloc.providerProps.intl.formatMessage({ id: 'inventory.assigner.availablePowerRoomCapacity' })}
                          <span>{error.availablePwrToBeAllocated}</span>
                        </span>
                        <span className='sectTitle'>
                          {props.bloc.providerProps.intl.formatMessage({
                            id: 'inventory.assigner.youreTryingToAddPower',
                          })}
                          <span>{error.exceededPowerBy}</span>
                        </span>
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAssignerErrorsModalIfNeeded = () => {
    if (props.data.assignModalErrorData) {
      return (
        <>
          <CustomModal
            size={'lg'}
            body={mountErrorsModalBody()}
            open
            title={props.bloc.providerProps.intl.formatMessage({ id: props.data.assignModalErrorData.errors[0].i18nError.code })} // todo i18n
            togglerModal={props.bloc.closeErrorsModal}
            class={Style.errorModalRegion}
            modalHeaderClassName='standarModalHeader'
          />
        </>
      );
    }
    return <></>;
  };

  const renderMainModal = () => {
    return (
      <>
        <CustomModal
          body={mountMainModalBody()}
          open
          title={getModalTitle()}
          footer={mountModalFooterBtns()}
          togglerModal={props.cancelHandler}
          class={`fit-content ${props.autoAssignWhenOpen ? 'd-none' : ''}`}
        />
        {renderLoaderIfNeeded(props.data.isLoading)}
        {renderAssignerErrorsModalIfNeeded()}
      </>
    );
  };

  return props.data.coloniesData ? renderMainModal() : <AntsLoader />;
};

export default ColonyItemAssignerView;
