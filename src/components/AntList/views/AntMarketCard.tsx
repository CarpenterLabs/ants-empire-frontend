/* eslint-disable jsx-a11y/alt-text */
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { MarketListing } from '@ComponentsRoot/Market/types/MarketListing';
import { Card, CardImg } from 'reactstrap';
import Style from '../styles/antMarketCard.module.scss';

const AntMarketCard = (props: {
  ant: Ant;
  listingItem: MarketListing;
  selected?: boolean;
  playerIsTheOwner: boolean;
  onClickAntCard?: (antToBuy: Ant, listing: MarketListing) => void;
}) => {
  return (
    <div className={`${Style.antMarketCard} fadeIn`}>
      <Card
        {...(props.onClickAntCard && { onClick: (e) => props.onClickAntCard!(props.ant!, props.listingItem) })}
        className={`rarity-${props.ant.rarity} ${props.ant.usedtimes === 0 && 'unavailable'} ${
          props.selected ? 'selected' : ''
        } animatedOne`}
      >
        <div className='usedtimes'>
          <div>{props.ant.usedtimes} ❤</div>
          {/* <div>💼...{props.ant.owner.substring(props.ant.owner.length - 5, props.ant.owner.length)}</div> */}
          {props.playerIsTheOwner && <div>{props.playerIsTheOwner ? '⭐' : ''}</div>}
          {props.ant.isUpgraded && <div>{props.ant.isUpgraded ? '⏫' : ''}</div>}
        </div>

        <CardImg variant='top' src={`${props.ant.image}`} />

        <div className='box-type'>
          <img className={`type ${props.ant.type}`} src={`/images/${props.ant.type}.png`} />
          <div className='power'>
            <span className={`rarity-${props.ant.rarity}`}>{props.ant.power}</span>
          </div>
        </div>
        <div className='priceAndNftId'>
          <div className='price'>
            <span className='priceTxt'>{props.listingItem.price.toString()} </span>
            <img alt='Nectar Logo' style={{ width: '14px' }} src={`/images/nectar.png`} />
          </div>
          <div className='ownerInfo'>
            <span>💼...{props.ant.owner.substring(props.ant.owner.length - 5, props.ant.owner.length)}</span>
          </div>
          <div className='tokenId'>#{props.ant.tokenId}</div>
        </div>
      </Card>
    </div>
  );
};

export default AntMarketCard;
