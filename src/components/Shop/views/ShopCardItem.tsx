import { MaterialBoxToBuy } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import React from 'react';
import Style from '../styles/ShopCardItem.module.scss';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { MATERIAL_LIST } from '@ComponentsRoot/constants/iconLists';
import { Button } from 'reactstrap';
import { useOutletContext } from 'react-router-dom';
const ShopCardItem = (props: {
  materialBox: MaterialBoxToBuy;
  purchaseMaterialBoxFn: (mboxIdToBuy: string, outletContext: OutletContextType) => Promise<void>;
  isToastrVisible: boolean;
}) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  return (
    <div className={Style.shopCardItem}>
      <div className='wsk-cp-product'>
        <div className='priceZone'>
          <span>{props.materialBox.price}</span>{' '}
          <img alt='Nectar Logo' style={{ width: '35px' }} src={`/images/finals/icons/nectar.png`} />
        </div>
        <div className='wsk-cp-img'>
          <img src='/images/finals/icons/chest.png' alt='Product' />
        </div>
        <div className='wsk-cp-text'>
          <div className='title-product'>
            <span>{props.materialBox.name ?? 'notitle'}</span>
          </div>
          <div className='description-prod'>
            <span>{props.materialBox.description}</span>
          </div>
          <div className='materialsInsideBox'>
            {props.materialBox.materials.map(([materialId, materialQtty], key) => {
              const material = MATERIAL_LIST.find((mat) => mat.id === materialId);
              return (
                <div className='matInside' key={key.toString()}>
                  <img src={material?.src} alt={material?.alt} />
                  <span>{materialQtty}</span>
                </div>
              );
            })}
          </div>
          <div className='card-footer'>
            <Button
              className={`buyBtn`}
              onClick={
                props.isToastrVisible
                  ? () => {}
                  : async () => await props.purchaseMaterialBoxFn(props.materialBox.mBoxToBuyId, outletContext)
              }
            >
              BUY <img src='/images/finals/icons/cart.png' alt='cart' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ShopCardItem);
