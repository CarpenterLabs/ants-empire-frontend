import { Seller } from '@ComponentsRoot/Seller/types/Seller';
import ColonyBloc from '../bloc/ColonyBloc';
import CountdownSeller from './CountdownSeller';

const SellerInfoBox = (props: { 
  sellerInfo: Seller;
  toggleCallSellerDialog: ColonyBloc['toggleCallSellerDialog'];
  refreshColonyData: ColonyBloc['refreshColonyData'];
}) => {
  const { freeCall, paidCall, active } = props.sellerInfo.available;

  const renderCooldown = () => {
    const lastDateCalled = paidCall
      ? props.sellerInfo.last_called_date
      : props.sellerInfo.last_purchased_nectar_date;

    return active ? (
      <>
        Leaves in <CountdownSeller
          endTimeISO={lastDateCalled}
          onExpire={props.refreshColonyData}
          active_time={props.sellerInfo.active_time}
        />
      </>
    ) : (
      'Inactive'
    );
  };

  const renderActionButton = () => {
    if (active && paidCall) {
      return (
        <p onClick={props.toggleCallSellerDialog} className='premium-call'>
          <span className='nectar-cost'>
            <img alt='Nectar Logo' src='/images/finals/icons/nectar.png' />
            {props.sellerInfo.callNectarCost}
          </span>
        </p>
      );
    }
    if (active) {
      return <p className='cooldown'>Next monday</p>;
    }
    if (paidCall) {
      return (
        <p onClick={props.toggleCallSellerDialog} className='premium-call'>
          <span className='nectar-cost'>
            <img alt='Nectar Logo' src='/images/finals/icons/nectar.png' />
            {props.sellerInfo.callNectarCost}
          </span>
        </p>
      );
    }
    if (freeCall) {
      return (
        <p onClick={props.toggleCallSellerDialog} className='cooldown'>
          FREE CALL
        </p>
      );
    }
    return <p className='cooldown'>Next monday</p>;
  };

  const isInactiveClass = (active && !paidCall) || (!active && !freeCall && !paidCall)
    ? 'seller-inactive'
    : '';

  return (
    <div className={`infobox id-9 seller ${isInactiveClass}`}>
      <div className='main-box'>
        <div className='room-name'>SELLER</div>
        <div className='seller-info'>
          <p className='cooldown'>{renderCooldown()}</p>
        </div>
      </div>
      <div className='secondary-box'>
        <div className={`inside-secondary-box ${paidCall ? 'premium-call-box' : ''}`}>{renderActionButton()}</div>
      </div>
    </div>
  );
};

export default SellerInfoBox;