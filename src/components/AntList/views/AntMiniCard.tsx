/* eslint-disable jsx-a11y/alt-text */
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
// import CustomModal from '@ComponentsRoot/core/CustomModal';
// import { FormattedMessage } from 'react-intl';
import { Card, CardImg } from 'reactstrap';
// import { Button, Card, CardImg } from 'reactstrap';

import Style from '../styles/antMiniCard.module.scss';
import { FormattedMessage } from 'react-intl';
// import AntDetail from './AntDetail';

const AntMiniCard = (props: {
  ant: Ant;
  selected?: boolean;
  onClickAntCard?: (ant: Ant) => void; //Special prop to work with when we are inside colony
}) => {
  return (
    <div className={`${Style.antMiniCard} fadeIn`}>
      <Card
        {...(props.onClickAntCard && { onClick: (e) => props.onClickAntCard!(props.ant!) })}
        className={`rarity-${props.ant.rarity} ${props.ant.usedtimes === 0 && 'unavailable'} ${props.selected ? 'selected' : ''}`}
      >
        {props.selected !== undefined && props.ant.usedtimes !== 0 && (
          <div className={`selectionCircle circle fadeIn ${props.selected ? 'selected' : ''}`}>
            <p className='discount'>{props.selected ? '✓' : ''}</p>
          </div>
        )}
        <div className='usedtimes'>
          <div>
            {props.ant.usedtimes} <FormattedMessage id={`ant.usedtimes`} />
          </div>
          <div>{props.ant.isUpgraded ? '⏫' : ''}</div>          
        </div>

        <CardImg /*className={`specie ${props.ant.specie}`}*/ variant='top' src={`${props.ant.image}`} />
        <div className='tokenId'>#{props.ant.tokenId}</div>
        <div className='marketBadge'>{props.ant.inMarket ? '🔖' : ''}</div>
        <div className='box-type'>
          {/* <img className={`specie ${props.ant.specie}`} src={`/images/leaf.png`} /> */}
          <img className={`type ${props.ant.type}`} src={`/images/${props.ant.type}.png`} />
          <div className='power'>
            <span className={`rarity-${props.ant.rarity}`}>{props.ant.power}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AntMiniCard;
