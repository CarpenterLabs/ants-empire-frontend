import { FormattedMessage } from 'react-intl';
import { Card, CardImg, CardBody, CardTitle, Button } from 'reactstrap';
import Style from '../styles/InventoryItem.module.scss';
import { InventoryItemPropsType } from '../types/InventoryItemPropsType';
import { isAnt, isPurchasedMaterialBox, isPurchasedPack } from '../Utils/InventoryUtils';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';

const InventoryItem = (props: InventoryItemPropsType) => {
  const renderSelectionInventoryCircle = () => {
    if (props.multiSelectEnabled && props.item.hasOwnProperty('selected') && typeof props.item.selected === 'boolean') {
      return (
        <div className={`selectionCircle circle fadeIn ${props.item.selected ? 'selected' : ''}`}>
          <p className='discount'>{props.item.selected ? '✓' : '-'}</p>
        </div>
      );
    }

    return <></>;
  };

  const getAntSelectionCircle = (ant: Ant) => {
    if (!ant.isBlockedUntil) {
      return renderSelectionInventoryCircle();
    }

    return <></>;
  };

  // const getDisabledStatusForOpenBtn = () => {};

  const getCardByItemType = () => {
    if (isAnt(props.item)) {
      return (
        <Card
          onClick={() => props.onCardClick!(props.item, props.inventoryDataKey)}
          className={`rarity-${props.item.rarity} ${props.item.selected ? 'selected' : ''} ${props.miniCard ? 'miniCard' : ''} ${
            props.item.isBlockedUntil ? 'blocked' : ''
          } ${props.item.inMarket ? 'blocked' : ''}`}
        >
          {/* {props.multiSelectEnabled && !props.item.isBlockedUntil && renderSelectionInventoryCircle()} */}
          {getAntSelectionCircle(props.item)}

          {props.item.isBlockedUntil && props.antBlockedCountDown}
          <CardImg /*className={`specie ${props.item.specie}`}*/ variant='top' src={`/images/mini-ant.png`} />
          <div className='box-type'>
            {/* <img alt={props.item.specie} className={`specie ${props.item.specie}`} src={`/images/leaf.png`} /> */}
            <img alt={props.item.type} className={`type ${props.item.type}`} src={`/images/${props.item.type}.png`} />
            <div className='power'>
              <span className={`rarity-${props.item.rarity}`}>{props.item.power}</span>
            </div>
            <div className='marketBadge'>
              <span>{props.item.inMarket ? '🔖' : ''}</span>
            </div>
          </div>

          <CardBody>
            <div className='button-box'>
              <Button
                disabled={props.multiSelectEnabled}
                className='ant'
                color='primary'
                onClick={() => props.handleClickAntDetailBtn!(props.item as Ant)}
              >
                🔎
              </Button>
              <Button disabled={props.multiSelectEnabled} className='ant' color='primary'>
                <FormattedMessage id='ant.sell' />
              </Button>
            </div>
          </CardBody>
        </Card>
      );
    }

    if (isPurchasedPack(props.item)) {
      return (
        <Card className={`pack`}>
          <div className='offer circle'>
            <p className='discount'>{`!`}</p>
          </div>
          <CardImg className='packImg' variant='top' src={`/images/chest.png`} />
          <CardBody className='pack'>
            <CardTitle>{props.item.title}</CardTitle>
            <div className='button-box'>
              <Button onClick={() => props.handleOpenPack!(props.item)} className='pack' color='primary'>
                <FormattedMessage id='general.open' />
              </Button>
            </div>
          </CardBody>
        </Card>
      );
    }

    if (isPurchasedMaterialBox(props.item)) {
      return (
        <Card
          onClick={() => props.onCardClick!(props.item, props.inventoryDataKey)}
          className={`materialBox ${props.miniCard ? 'miniCard' : ''}`}
        >
          <div className='materialBoxCardTitleLabeled'>{props.item.name}</div>

          {props.multiSelectEnabled ? (
            renderSelectionInventoryCircle()
          ) : (
            // <div className='offer circle'>
            //   <p className='discount'>{`!`}</p>
            // </div>
            <></>
          )}

          <CardImg className='mBoxImg' variant='top' src={`/images/finals/icons/chest.png`} />
          <CardBody className='materialBoxBody'>
            <div className='materialsInsideBox'>
              {props.item.materials.map(([materialId, materialQtty], key) => {
                const material = MATERIAL_LIST.find((mat) => mat.id === materialId);
                return (
                  <div className='matInside' key={key.toString()}>
                    <img src={material?.src} alt={material?.alt} />
                    <span>{materialQtty}</span>
                  </div>
                );
              })}
            </div>
            {!props.materialBoxProperties?.onInventory && (
              <div className='button-box'>
                <Button
                  disabled={!props.materialBoxProperties?.canBeOpened}
                  onClick={async () =>
                    await props.materialBoxProperties?.handleOpenPurchasedMaterialBox!(props.item as PurchasedMaterialBox)
                  }
                  className='materialBoxBtn'
                >
                  {props.materialBoxProperties && props.materialBoxProperties!.materialBoxMainBtni18nTextId && (
                    <FormattedMessage id={props.materialBoxProperties!.materialBoxMainBtni18nTextId} />
                  )}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      );
    }

    if (props.itemType === 'empty') {
      return (
        <Card className={`empty`}>
          <CardBody className='pack'></CardBody>
        </Card>
      );
    }

    return <></>;
  };

  return (
    <>
      {isAnt(props.item) && props.item.inMarket ? (
        <></>
      ) : (
        <div className={`${Style.inventoryItemCard} fadeIn `}>
          <div className={`box-inventory ${props.itemType} ${props.materialBoxProperties?.onInventory ? 'onInv' : ''} fadeIn`}>{getCardByItemType()}</div>
        </div>
      )}
    </>
  );
};

export default InventoryItem;
