import { rarityEmojisRelation } from '@ComponentsRoot/Ant/types/Ant';
import Style from '../styles/packCard.module.scss';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { PackToBuy, antGuaranteed } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import _ from 'lodash';
import { useOutletContext } from 'react-router-dom';
import { Button, Card, CardBody, CardImg, Col } from 'reactstrap';
import { get100 } from '../bloc/WelcomePackBloc';
import { WelcomePackCardState } from '../types/WelcomePackSubject';
const WelcomePackCard = (props: WelcomePackCardState) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  const numGuaranteed: number =
    props.pack.ant_guaranteed && props.pack.ant_guaranteed.length ? props.pack.ant_guaranteed.length : 0;

  const isPurchased = () => {
    return props.pack.packToBuyId === (props.purchased && props.purchased.packToBuyId);
  };

  return (
    <div className={Style.packCard}>
      <div
        onClick={isPurchased() ? props.togglerModal : undefined}
        className={`packCard-content ${!props.pack.available && !isPurchased() ? `disabled` : ``} fadeIn`}
      >
        <Card className={`${!props.pack.available && !isPurchased() ? `unavailable` : ``} ${props.pack.packToBuyId}`}>
          {props.pack.priceDiscount && props.pack.available ? (
            <div className='offer circle'>
              <p className='discount'>{`-${props.pack.percentDiscount}%`}</p>
            </div>
          ) : (
            ''
          )}
          {isPurchased() ? (
            <div className='offer circle buyed'>
              <p className='discount'>{`OPEN`}</p>
            </div>
          ) : (
            ''
          )}
          <div className={`mystery-img-box ${props.pack.family} ${props.pack.packToBuyId}`}>
            <CardImg variant='top' src={`/images/${props.pack.family}.png`} />
          </div>
          <div className='card-header'>
            <p className='title-pack'>{props.pack.title}</p>
            <p className='title-price'>
              <span className='price'>
                {props.pack.priceDiscount && props.pack.available ? <span className='old-price'>{props.pack.price}</span> : ''}
                <span className='final-price'>
                  {props.pack.priceDiscount && props.pack.available ? props.pack.priceDiscount : props.pack.price}
                </span>
                <img alt='USDT logo' style={{ width: '20px' }} src={`/images/tether-usdt-logo.png`} />
              </span>
            </p>
          </div>
          {/* {props.pack.queen_rarity ? renderQueen(props.pack.queen_rarity) : ""} */}
          {Number(props.pack.ant_guaranteed?.length) !== props.pack.num_mints &&
            renderDefault(props.pack.ant_rarity, props.pack.ant_type, props.pack.num_mints, numGuaranteed)}{' '}
          {numGuaranteed > 0 ? renderGuaranteed(props.pack.ant_guaranteed) : ''}
          <CardBody>
            <p>{props.pack.description}</p>
            <div className='button-box'>
              {props.pack.max_buy_qty ? (
                <p className='purchased-times'>
                  {`This pack can only be purchased ${props.pack.max_buy_qty} time${props.pack.max_buy_qty > 1 ? `s` : ``}`}
                </p>
              ) : (
                ''
              )}
              <Button
                className={!props.pack.available ? `disabled` : ``}
                color='primary'
                disabled={!props.pack.available}
                onClick={() =>
                  props.manageBuyWP(
                    { family: props.pack.family, packToBuyId: props.pack.packToBuyId, num_mints: props.pack.num_mints },
                    props.purchased!,
                    props.pack.priceDiscount && props.pack.available ? props.pack.priceDiscount : props.pack.price,
                    outletContext.socketIOService
                  )
                }
              >
                {isPurchased() ? `PURCHASED` : !props.pack.available ? `UNAVAILABLE` : `BUY`}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const renderRarity = (rarity: PackToBuy['ant_rarity']) => {
  return rarity
    .filter((item: [string, number]) => item[1] !== 0)
    .map((item: [string, number], key: number) => (
      <div key={key} className={`power rarity-${item[0]}`}>
        {item[1] === 100 ? `${item[0]}${rarityEmojisRelation[item[0]]}` : `${item[1]}%`}
      </div>
    ));
};

const renderType = (type: PackToBuy['ant_type']) => {
  return type
    .filter((item: [string, number]) => item[1] !== 0)
    .map((item: [string, number], key: number) => (
      <div key={key} className={`type ${item[0]}`}>
        {item[1] === 100 ? item[0] : `${item[1]}%`} <img className='' src={`/images/${item[0]}.png`} alt={item[0]} />
      </div>
    ));
};

const renderGuaranteed = (guaranteed: PackToBuy['ant_guaranteed']) => {
  guaranteed!.forEach((pack: any) => {
    // group equal guaranteed ants
    const coincidences = guaranteed!.filter((gpack: any) => _.isEqual(pack, gpack));
    if (coincidences.length > 1) {
      guaranteed = guaranteed!.filter((gpack: antGuaranteed) => !_.isEqual(pack, gpack));
      guaranteed.push({ ...coincidences[0], number: coincidences.length });
    }
  });

  return guaranteed!.map((item: antGuaranteed, key: number) => (
    <div key={key} className={`general-box guaranteed rarity-${get100(item.ant_rarity)}`}>
      <Col xs={3} className='general-content'>
        <div className='default-box'>
          <div className='inside'>
            <span>{item.number ? item.number : 1}</span>
            <img className='ant' src={`/images/mini-ant.png`} alt={`ant`} />
            {get100(item.ant_type) ? (
              <img
                className={`a-type ${get100(item.ant_type)}`}
                src={`/images/${get100(item.ant_type)}.png`}
                alt={`ant_${get100(item.ant_type)}`}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </Col>
      <Col xs={9} className='general-content bl'>
        <div className='box-type bb'>{renderRarity(item.ant_rarity)}</div>
        <div className='box-type'>{renderType(item.ant_type)}</div>
      </Col>
    </div>
  ));
};

// const renderQueen = (queen_rarity: PackToBuy["queen_rarity"]) => {
//   return <div className="general-box queen">
//     <Col xs={3} className="general-content queen">
//       <div className="default-box">
//         <div className="inside">
//           <img className="ant queen" src={`/images/queen.png`} alt="queen" />
//         </div>
//       </div>
//     </Col>
//     <Col xs={9} className="general-content bl queen">
//       <div className='box-type'>
//         {renderRarity(queen_rarity)}
//       </div>
//     </Col>
//   </div>
// }

const renderDefault = (
  ant_rarity: PackToBuy['ant_rarity'],
  ant_type: PackToBuy['ant_type'],
  num_mints: PackToBuy['num_mints'],
  numGuaranteed: number
) => {
  return (
    <div className='general-box'>
      <Col xs={3} className='general-content'>
        <div className='default-box'>
          <div className='inside'>
            <span>{num_mints - numGuaranteed}</span>
            <img className='ant' src={`/images/mini-ant.png`} alt='ant' />
          </div>
        </div>
      </Col>
      <Col xs={9} className='general-content bl'>
        <div className='box-type bb'>{renderRarity(ant_rarity)}</div>
        <div className='box-type'>{renderType(ant_type)}</div>
      </Col>
    </div>
  );
};

export default WelcomePackCard;
