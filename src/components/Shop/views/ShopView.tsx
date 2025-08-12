import ShopBloc from '../bloc/ShopBloc';
import { ShopSubject } from '../types/ShopSubject';
import { AntsLoader, renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import Style from '../styles/ShopView.module.scss';
import { useEffect } from 'react';
import { MaterialBoxToBuy } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import ShopCardItem from './ShopCardItem';

const ShopView = (props: { bloc: ShopBloc; data: ShopSubject }) => {
  useEffect(() => {
    (async () => {
      await props.bloc.getShopData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderShop = () => {
    return (
      <div className={`${Style.shopView} fadeIn`}>
        <div className='title'>
          <span>SHOP</span>
        </div>
        {props.data.shopData!.materialBoxToBuy && (
          <div className='shopList'>
            {props.data.shopData!.materialBoxToBuy.map((materialBoxToBuy: MaterialBoxToBuy, key) => (
              <ShopCardItem
                purchaseMaterialBoxFn={props.bloc.purchaseMaterialBox}
                materialBox={materialBoxToBuy}
                key={key.toString()}
                isToastrVisible={Object.values(props.data.toastr).some(({ show }) => show)}
              />
            ))}
          </div>
        )}
        {renderLoaderIfNeeded(props.data.isLoading)}
        {renderToastrIfNeeded(props.data.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
      </div>
    );
  };

  return <>{props.data.shopData ? renderShop() : <AntsLoader />}</>;
};

export default ShopView;
