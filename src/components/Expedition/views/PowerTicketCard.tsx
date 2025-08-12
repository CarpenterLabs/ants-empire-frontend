import { Button, Card, CardBody, CardImg } from 'reactstrap';

import Style from '../styles/powerTicketCard.module.scss';
import { PowerTicket, PurchasedPowerTicket } from '../types/PowerTicket';
import { ExpeditionReward } from '../types/ExpeditionReward';
import ExpeditionBloc from '../bloc/ExpeditionBloc';
import { ExpeditionSubject } from '../types/ExpeditionSubject';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useOutletContext } from 'react-router/dist';

const PowerTicketCard = (props: {
  ticket: PowerTicket;
  expeReward: ExpeditionReward;
  buyPowerTicket: ExpeditionBloc['buyPowerTicket'];
  purchasedPowerTickets: ExpeditionSubject['purchasedPwrTickets'];
  togglePowerTicketAssigner: (powerTicket: PurchasedPowerTicket) => void;
}) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  const isTicketAlreadyUsed = (): boolean => {
    const buyedPwrTicket = props.purchasedPowerTickets?.find(
      (ticket) => ticket.destinationId === props.expeReward.destinationId && ticket.winCount === props.expeReward.winCount
    );
    if (!buyedPwrTicket) return false;
    return buyedPwrTicket!.used;
  };

  const getMainButtonText = () => {
    if (props.expeReward.purchased) {
      if (isTicketAlreadyUsed()) {
        return 'ALREADY USED';
      }
      return 'USE';
    }
    if (!props.expeReward.available) {
      return 'UNAVAILABLE';
    } else {
      return 'BUY';
    }
  };

  const handleMainButtonClick = async () => {
    if (!props.expeReward.purchased) {
      await props.buyPowerTicket(props.expeReward._id!, props.expeReward.price, outletContext.socketIOService);
    } else if (!isTicketAlreadyUsed()) {
      const buyedPwrTicket = props.purchasedPowerTickets?.find(
        (ticket) => ticket.destinationId === props.expeReward.destinationId && ticket.winCount === props.expeReward.winCount
      );
      props.togglePowerTicketAssigner(buyedPwrTicket!);
    }
  };

  return (
    <div className={`${Style.powerTicketCard} fadeIn`}>
      <div className={`ticketCard-content ${!props.expeReward.available ? `disabled` : ``} fadeIn`}>
        <Card className={`${!props.expeReward.available ? `unavailable` : ``}`}>
          <div className='headerInfo'>
            <span className='power'>
              +{props.ticket.powerAmount}
              <span className='icon'>
                <img src='/images/finals/icons/power_1.png' alt='powerIcon' />
              </span>
            </span>
            <span className='price'>
              {props.expeReward.price} <img alt='Nectar Logo' style={{ width: '35px' }} src={`/images/finals/icons/nectar.png`} />
            </span>
          </div>

          <CardImg className={``} variant='top' src={`/images/finals/icons/power_ticket.png`} />
          <div className='wrapper'>
            <div className='infoZone'>
              <div className='title'>Power Ticket</div>
              <div className='desc'>
                +{props.ticket.powerAmount} to any {props.ticket.rarity} ANT
              </div>
              <div className='winCount'>Available at {props.expeReward.winCount} wins</div>
            </div>
            <CardBody>
              <div className='button-box'>
                {props.ticket.maxBuyQty ? (
                  <p className='purchased-times'>
                    {`This Ticket can only be purchased ${props.ticket.maxBuyQty} time${props.ticket.maxBuyQty > 1 ? `s` : ``}`}
                  </p>
                ) : (
                  ''
                )}
                <Button
                  className={`${!props.expeReward.available ? `disabled` : ``} claimBtn`}
                  // color='primary'
                  disabled={!props.expeReward.available}
                  onClick={async () => await handleMainButtonClick()}
                >
                  {getMainButtonText()}
                  {/* {props.expeReward.purchased ? `PURCHASED` : !props.expeReward.available ? `UNAVAILABLE` : `BUY`} */}
                </Button>
              </div>
            </CardBody>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PowerTicketCard;
