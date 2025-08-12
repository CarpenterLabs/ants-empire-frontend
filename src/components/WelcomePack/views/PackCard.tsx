import { Button, Card, CardBody, CardImg, Col } from 'reactstrap';
import Style from '../styles/packCard.module.scss';
import _ from 'lodash';
import { PackToBuy, antGuaranteed } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { get100 } from '../bloc/WelcomePackBloc';
import { PackCardState } from '../types/PackSubject';
const PackCard = (props: PackCardState) => {
  const packToBuy = props.expeReward.matchedItem as PackToBuy;
  const numGuaranteed: number = packToBuy.ant_guaranteed && packToBuy.ant_guaranteed.length ? packToBuy.ant_guaranteed.length : 0;

  return (
    <div className={Style.packCard}>
      <div className={`packCard-content ${!props.expeReward.available && !props.expeReward.purchased ? `disabled` : ``} fadeIn`}>
        <Card
          className={`${!props.expeReward.available && !props.expeReward.purchased ? `unavailable` : ``} ${
            packToBuy.packToBuyId
          }`}
        >
          {packToBuy.priceDiscount && props.expeReward.available ? (
            <div className='offer circle'>
              <p className='discount'>{`-${packToBuy.percentDiscount}%`}</p>
            </div>
          ) : (
            ''
          )}

          <div className={`mystery-img-box ${packToBuy.family} ${packToBuy.packToBuyId}`}>
            <CardImg variant='top' src={`/images/finals/icons/map.png`} />
          </div>

          <div className='wrapper'>
            {' '}
            <div className='card-header'>
              <p className='title-pack'>{packToBuy.title}</p>
              <p className='title-price'>
                <span className='price'>
                  {packToBuy.priceDiscount && props.expeReward.available ? (
                    <span className='old-price'>{packToBuy.price}</span>
                  ) : (
                    ''
                  )}
                  <span className='final-price'>
                    {packToBuy.priceDiscount && props.expeReward.available ? packToBuy.priceDiscount : packToBuy.price}
                  </span>
                  <img alt='Nectar Logo' src={`/images/finals/icons/nectar.png`} />
                </span>
              </p>
            </div>
            {Number(packToBuy.ant_guaranteed?.length) !== packToBuy.num_mints &&
              renderDefault(packToBuy.ant_rarity, packToBuy.ant_type, packToBuy.num_mints, numGuaranteed)}
            {numGuaranteed > 0 ? renderGuaranteed(packToBuy.ant_guaranteed) : ''}
            <CardBody>
              <p className='carddesc'>{packToBuy.description}</p>
              <div className='button-box'>
                {packToBuy.max_buy_qty ? (
                  <p className='purchased-times'>
                    {`This pack can only be purchased ${packToBuy.max_buy_qty} time${packToBuy.max_buy_qty > 1 ? `s` : ``}`}
                  </p>
                ) : (
                  ''
                )}
                <Button
                  className={`${!props.expeReward.available ? `disabled` : ``} claimBtn`}
                  disabled={!props.expeReward.available}
                  onClick={async () =>
                    await props.buyPack(
                      {
                        family: packToBuy.family,
                        num_mints: packToBuy.num_mints,
                        packToBuyId: packToBuy.packToBuyId,
                        colonyId: props.colonyId,
                        price: packToBuy.price,
                      },
                      props.outletVal
                    )
                  }
                >
                  {props.expeReward.purchased ? `PURCHASED` : !props.expeReward.available ? `UNAVAILABLE` : `BUY`}
                </Button>
              </div>
            </CardBody>
          </div>
        </Card>
      </div>
    </div>
  );
};

const getRarityIconSrc = (rarity: string) => {
  if (rarity === 'common') {
    return '/images/finals/icons/common.png';
  } else if (rarity === 'rare') {
    return '/images/finals/icons/rare.png';
  } else if (rarity === 'epic') {
    return '/images/finals/icons/epic.png';
  }

  // legen default
  return '/images/finals/icons/legendary.png';
};

const mountNotGuaranteedPercentZone = (item: [string, number]) => {
  return [<span className='percentSp'>{item[1]}%</span>, <span className='rarityName'>{item[0]}</span>];
};

const renderRarity = (rarity: PackToBuy['ant_rarity']) => {
  return rarity
    .filter((item: [string, number]) => item[1] !== 0)
    .map((item: [string, number], key: number) => (
      <div key={key} className={`power rarity-${item[0]}`}>
        <div className='rarityLogo'>
          <img src={getRarityIconSrc(item[0])} alt='rarity icon' />
        </div>
        {/* <div className='rarityPercent'> {item[1] === 100 ? `${item[0]}` : mountNotGuaranteedPercentZone(item)}</div> IF WE WANT TO NOT SHOW 100% if guaranteed*/} 
        <div className='rarityPercent'> {mountNotGuaranteedPercentZone(item)}</div>
      </div>
    ));
};


const renderType = (type: PackToBuy['ant_type']) => {
  return type
    .filter((item: [string, number]) => item[1] !== 0)
    .map((item: [string, number], key: number) => (
      <div key={key} className={`type ${item[0]}`}>
        <img alt='ant icon rarity' src={getTypeIconImgSrcByType(item[0])} /> {item[1] === 100 ? item[0] : `${item[1]}%`}
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

const renderDefault = (
  ant_rarity: PackToBuy['ant_rarity'],
  ant_type: PackToBuy['ant_type'],
  num_mints: PackToBuy['num_mints'],
  numGuaranteed: number
) => {
  return (
    <div className='general-box'>
      <div className='general-content'>
        <div className='default-box'>
          <div className='inside'>
            {/* <span>{num_mints - numGuaranteed}</span> */}
            <img className='ant' src={`/images/finals/Welcome_Pack/question_mark.png`} alt='ant' />
          </div>
        </div>
      </div>

      <div className='general-content bl'>
        <div className='box-type bb'>{renderRarity(ant_rarity)}</div>
        <div className='box-type'>{renderType(ant_type)}</div>
      </div>
    </div>
  );
};


export const getTypeIconImgSrcByType = (type: string) => {
  if (type === 'worker') {
    return '/images/finals/icons/pickaxe.png';
  } else if (type === 'soldier') {
    return '/images/finals/icons/soldier.png';
  }

  // flying default
  return '/images/finals/icons/bow.png';
};

export default PackCard;
