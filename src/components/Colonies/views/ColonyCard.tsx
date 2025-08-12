import { FormattedMessage } from 'react-intl';
import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import Style from '../styles/colonyCard.module.scss';
import { Colony } from '../types/Colony';
import { materialEmojisRelation } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import { useEffect, useState } from 'react';
import { maxDecimals } from '@ComponentsRoot/core/CryptoAntsUtils';

const ColonyCard = (
  props: Colony & { miniCard?: boolean; onCardClick: () => void; isSelected?: boolean; defaultSelected?: boolean }
) => {
  const [isDefaultSelected, setIsDefaultSelected] = useState(props.defaultSelected);

  useEffect(() => {
    if (isDefaultSelected && !props.isSelected) {
      // set defaultSelected on parent subject
      props.onCardClick();
    }

    // si viene a true i aun tiene valor en state true
    if (props.isSelected && isDefaultSelected) {
      setIsDefaultSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isSelected]);

  const renderGeneralType = () => {
    return props.materials.map((material) => (
      <div key={material.materialId}>
        <span>{materialEmojisRelation[material.materialId]}</span>
        <span>{maxDecimals(Number(material.value))}</span>
      </div>
    ));
  };

  const renderBoxSpecie = () => {
    return Object.keys(props.ants_resume.specie).map((specie: string, key: number) => (
      <div key={key} className='specie'>
        <img className={specie} src={`/images/leaf.png`} alt={specie} />
        {props.ants_resume.specie[specie]}
      </div>
    ));
  };

  const renderBoxRarity = () => {
    return Object.keys(props.ants_resume.rarity).map((rarity: string, key: number) => (
      <div key={key} className='rarity'>
        <div className={`inside ${rarity}`}>{rarity.substring(0, 1).toLocaleUpperCase()}</div>
        {props.ants_resume.rarity[rarity as keyof Colony['ants_resume']['rarity']]}
      </div>
    ));
  };

  const renderBoxType = () => {
    const types = Object.keys(props.ants_resume.type).reverse();
    return types.map((type: string, key: number) => (
      <div key={key} className='type'>
        <img className={type} src={`/images/${type}.png`} alt={type} />
        {props.ants_resume.type[type]}
      </div>
    ));
  };

  const checkIfRenderSelectedIcon = () => {
    return (
      <div className={`selectionCircle circle fadeIn selected`}>
        <p className='check'>{'✓'}</p>
      </div>
    );
  };

  return (
    <div className={Style.colonyCard} onClick={props.onCardClick}>
      <Card className={`${props.miniCard ? 'miniCard' : ''}`}>
        {(isDefaultSelected || props.isSelected) && checkIfRenderSelectedIcon()}
        <div className='queen-box'>
          <div className='rarity'>
            <img src={`/images/queen.png`} alt='queen' />
            <div className={`queenSpecie ${props.queen.specie}`}>
              <img src={`/images/leaf.png`} alt={`queen ${props.queen.specie}`} />
            </div>
          </div>

          <div className={`specie`}>
            <img
              className={`${props.queen.specie}`}
              src={`/images/materials/${props.queen.specie}.png`}
              alt={`queen ${props.queen.specie}`}
            />
          </div>
        </div>

        <CardImg className={`colony ${props.queen.specie}`} variant='top' src={`/images/colony_out.jpg`} />
        <Col xs={12} className='general-content'>
          <div className='box-type'>{renderGeneralType()}</div>
        </Col>

        <CardBody>
          <CardTitle className={`title ${props.type}`}>
            <b>{props.name}</b> <span>LVL {props.level}</span>
          </CardTitle>
          <div className={`box-ants ${props.type}`}>
            <div className='box-specie'>
              <b>
                <FormattedMessage id='general.specie' />
              </b>
              {renderBoxSpecie()}
            </div>
            <div className='box-rarity'>
              <b>
                <FormattedMessage id='general.rarity.name' />
              </b>
              {renderBoxRarity()}
            </div>
            <div className='box-type'>
              <b>
                <FormattedMessage id='general.type' />
              </b>
              {renderBoxType()}
            </div>
            <div className={`count-ants ${props.type}`}>
              <p className='count'>{props.ants_resume.total}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ColonyCard;
