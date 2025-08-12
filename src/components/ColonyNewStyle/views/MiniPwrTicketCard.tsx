/* eslint-disable jsx-a11y/alt-text */
import { Card, CardImg } from 'reactstrap';
import Style from '../styles/miniPwrTicketCard.module.scss';
import { PurchasedPowerTicket } from '@ComponentsRoot/Expedition/types/PowerTicket';

const MiniPwrTicketCard = (props: {
  powerTicket: PurchasedPowerTicket;
  onClickCard?: (ticket: PurchasedPowerTicket) => void;
}) => {
  return (
    <div className={`${Style.miniPowerTicketCard} fadeIn`}>
      <Card {...(props.onClickCard && { onClick: (e) => props.onClickCard!(props.powerTicket!) })} className={``}>
        <CardImg className={``} variant='top' src={`/images/finals/icons/power_ticket.png`} />
        <div className='headerInfo'>
          <div className='power'>
            +{props.powerTicket.powerAmount}
            {/* <span className='icon'>⚡</span> */}
            <img className='pwticketicon' src="/images/finals/icons/power_1.png" alt="power Icon" />
          </div>
        </div>
        <div className='bottom'>
          <p className='smallTxt'>{props.powerTicket.rarity.toUpperCase()} ANT</p>
        </div>
      </Card>
    </div>
  );
};

export default MiniPwrTicketCard;
