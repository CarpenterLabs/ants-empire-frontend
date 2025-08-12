import { AntsLoader, renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import React, { useEffect } from 'react';
import InventoryBloc from '../bloc/InventoryBloc';
import { InventorySubject } from '../types/InventorySubject';
import Style from '../styles/InventoryView.module.scss';
import { FormattedMessage } from 'react-intl';
import InventoryItem from './InventoryItem';
import { Inventory } from '../types/Inventory';
import { Row, Col, Button } from 'reactstrap';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import RevealedWelcomePackModal from '@ComponentsRoot/WelcomePack/views/RevealedWelcomePackModal';
import ColonyItemAssignerProvider from '@ComponentsRoot/ColonyItemAssigner/providers/ColonyItemAssignerProvider';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import AntDetailView from '@ComponentsRoot/AntDetail/views/AntDetailView';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import { getItemTypeByItem } from '../Utils/InventoryUtils';
import { StandarToastrObjProperties, ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import AntBlockedCountdown from '@ComponentsRoot/Ant/views/AntBlockedCountdown';
import { getTimeRemainingUntilAntUnblocked } from '@ComponentsRoot/core/CryptoAntsUtils';
import ListAntMarketModal from '@ComponentsRoot/Market/views/ListAntMarketModal';

const InventoryView = (props: { bloc: InventoryBloc; data: InventorySubject }) => {
  useEffect(() => {
    (async () => {
      await props.bloc.getInventory();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderEmptyInvItems = (num: number) => {
    const emptyInvItems: JSX.Element[] = [];
    for (let n = 0; n < num; n++) {
      emptyInvItems.push(<InventoryItem key={n.toString() + 'empty'} itemType={'empty'} item={null as any} />);
    }

    return emptyInvItems;
  };

  const getAntCountDownJSX = (ant: Ant) => {
    return (
      <AntBlockedCountdown
        remainingMilliseconds={getTimeRemainingUntilAntUnblocked(ant.isBlockedUntil!)}
        onTimerEndFn={props.bloc.getInventory}
      />
    );
  };

  const renderInvItem = (inventory: Inventory) => {
    const keys = Object.keys(inventory);
    return (
      <div className='inventory-items'>
        {keys.map((key, idx) => {
          return (
            <React.Fragment key={idx}>
              {inventory[key as keyof Inventory].map((itm, idxIn) => {
                return (
                  <InventoryItem
                    inventoryDataKey={key as keyof Inventory}
                    onCardClick={props.bloc.onCardClick}
                    handleClickAntDetailBtn={props.bloc.handleClickAntDetailBtn}
                    handleOpenPack={props.bloc.handleOpenPack}
                    multiSelectEnabled={props.data.multiSelectEnabled}
                    key={idxIn}
                    itemType={getItemTypeByItem(itm)}
                    materialBoxProperties={{
                      canBeOpened: true,
                      handleOpenPurchasedMaterialBox: props.bloc.handleOpenPurchasedMaterialBox,
                      materialBoxMainBtni18nTextId: 'inventory.sendToColony',
                      onInventory: true
                    }}
                    item={itm as (Ant | PurchasedPack | PurchasedMaterialBox) & { selected?: boolean }}
                    {...(getItemTypeByItem(itm) === 'ant' &&
                      itm.isBlockedUntil && { antBlockedCountDown: getAntCountDownJSX(itm as Ant) })}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
        {renderEmptyInvItems(17)}
      </div>
    );
  };

  const renderSelectAllBtn = () => {
    if (props.data.multiSelectEnabled) {
      return (
        <Button onClick={props.bloc.selectAllSelectableItems} className='selectAllBtn fadeIn'>
          {props.bloc.providerProps.intl.formatMessage({
            id: 'inventory.selectAll',
          })}
        </Button>
      );
    }
    return <></>;
  };

  const renderCancelMultiSelectBtn = () => {
    if (props.data.multiSelectEnabled) {
      return (
        <Button onClick={props.bloc.cancelMultiSelect} className='cnclBtn fadeIn'>
          {props.bloc.providerProps.intl.formatMessage({
            id: 'general.cancel',
          })}
        </Button>
      );
    }
    return <></>;
  };

  const getMultiSelectBtnTextByStatus = () => {
    if (props.data.multiSelectEnabled) {
      const selectedCount = props.bloc.getSelectedInvItemsCount();

      if (selectedCount === 0) {
        return props.bloc.providerProps.intl.formatMessage({ id: 'inventory.pleaseSelectItems' });
      }

      return props.bloc.providerProps.intl.formatMessage(
        {
          id: 'inventory.elementsToAssingToColony',
        },
        { itemsnumber: selectedCount, single: selectedCount === 1 ? '' : 's' }
      );
    }
    return <FormattedMessage id={'inventory.assignElementsToColony'} />;
  };

  const getIfAssignToColonyBtnIsDisabled = () => {
    if (props.data.multiSelectEnabled && props.bloc.getSelectedInvItemsCount() === 0) {
      return true;
    }

    return false;
  };

  const renderToolbar = () => {
    return (
      <Row className='toolbar'>
        <Col xs='12' className='mainRow'>
          {((props.data?.inventoryData?.ants && props.data.inventoryData.ants.length > 0) ||
            (props.data?.inventoryData?.purchasedMaterialBoxes &&
              props.data.inventoryData.purchasedMaterialBoxes.length > 0)) && (
            <>
              <Button className='assignItemsBtn' disabled={getIfAssignToColonyBtnIsDisabled()} onClick={props.bloc.onMultiSelectBtnClick}>
                {getMultiSelectBtnTextByStatus()}
              </Button>
              {renderSelectAllBtn()}
              {renderCancelMultiSelectBtn()}
            </>
          )}
          <span className='antsOnMktInfo'>
            <span>Ants on Market</span>{' '}
            <span className='count'>{props.data?.inventoryData?.ants.filter((ant) => ant.inMarket).length}</span>
          </span>
        </Col>
      </Row>
    );
  };

  const renderAssignItemsToColonyModalIfNeeded = () => {
    if (props.data.isOpenAssignToColonyModal) {
      return (
        <ColonyItemAssignerProvider
          cancelHandler={props.bloc.cancelAssignItemsToColonyModal}
          itemsToAssign={props.bloc.getSelectedInventoryItems()}
          colonyRepository={props.bloc.providerProps.repositoryManager.getColonyRepository()}
          intl={props.bloc.providerProps.intl}
          afterAssignFn={props.bloc.assignToColonyCompleted}
          autoAssignWhenOpen
        />
      );
    }
    return <></>;
  };

  const renderRevealedPackIfNeeded = () => {
    if (props.data.packToOpen) {
      return (
        <RevealedWelcomePackModal
          pack={props.data.packToOpen}
          resolveWelcomePackFn={props.bloc.resolveWelcomePack}
          togglerRevealedWelcomePackModalFn={props.bloc.togglerRevealedWelcomePackModal}
          togglerOtherPacksFn={() =>
            props.bloc.providerProps.navigate(
              props.bloc.providerProps.configManager.getRoutesRelation().WELCOME_PACK.absolutePath,
              { state: { fromInventory: true } }
            )
          }
        />
      );
    }
    return <></>;
  };

  const renderAntDetailIfNeeded = () => {
    if (props.data.antToOpenDetail) {
      return (
        <AntDetailView
          onCloseFn={props.bloc.closeAntDetailModal}
          ant={props.data.antToOpenDetail}
          onClickSellAnt={props.bloc.onClickSellAntBtn}
        />
      );
    }
    return <></>;
  };

  const renderListAntMarketIfNeeded = () => {
    if (props.data.antToListMarket) {
      return (
        <ListAntMarketModal
          antToList={props.data.antToListMarket}
          handleCloseModalFn={props.bloc.closeListAntMarketModal}
          intl={props.bloc.providerProps.intl}
          triggerListOnSC={props.bloc.listAntOnMarketplace}
        />
      );
    }

    return <></>;
  };

  const getExtraJsxForToastrAfterAssign = (endedActionOnSubject: StandarToastrObjProperties) => {
    return (
      <>
        <Button
          style={{ color: 'white', backgroundColor: '#4f3727', border: 'none', fontWeight: 500, fontSize: '14px' }}
          className='selectAllBtn fadeIn'
          onClick={() => props.bloc.providerProps.navigate(endedActionOnSubject.hrefTo!)}
        >
          {props.bloc.providerProps.intl.formatMessage({ id: 'colony.goToColony' })}
        </Button>
      </>
    );
  };

  const needExtraJSXOnToastr = (toastrSubjectVal: ToastrSubjectType) => {
    const endedAction: keyof ToastrSubjectType | string | undefined = Object.keys(toastrSubjectVal).find(
      (key) => toastrSubjectVal[key as keyof ToastrSubjectType].show === true
    );
    if (endedAction) {
      const textId = toastrSubjectVal[endedAction as keyof ToastrSubjectType].textId;
      if (textId === 'market.nftListedSuccessfully') {
        return undefined;
      }

      return getExtraJsxForToastrAfterAssign;
    }
    return undefined;
  };

  const renderInventory = () => {
    return (
      <>
        <div className={`${Style.inventoryView} fadeIn`}>
          <div className='general-box'>
            <div className='pageTitle'>
              <FormattedMessage id='inventory.title' />
            </div>
            {renderToolbar()}
            {renderInvItem(props.data.inventoryData as Inventory)}
          </div>
        </div>
        {renderLoaderIfNeeded(props.data.isLoading)}
        {renderRevealedPackIfNeeded()}
        {renderAssignItemsToColonyModalIfNeeded()}
        {renderAntDetailIfNeeded()}
        {renderListAntMarketIfNeeded()}
        {renderToastrIfNeeded(
          props.data.toastr,
          props.bloc.resetSubjectActions,
          props.bloc.providerProps.intl,
          needExtraJSXOnToastr(props.data.toastr)
        )}
      </>
    );
  };

  return <>{props.data.inventoryData ? renderInventory() : <AntsLoader />}</>;
};
export default InventoryView;
