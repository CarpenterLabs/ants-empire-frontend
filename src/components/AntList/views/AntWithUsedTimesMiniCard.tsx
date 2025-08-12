import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { Card, CardImg } from 'reactstrap';
import Style from '../styles/antMiniCard.module.scss';
import HospitalBloc from '@ComponentsRoot/Hospital/bloc/HospitalBloc';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';

const AntWithUsedTimesMiniCard = (props: {
  ant: Ant;
  originalPool: number;
  currentPool: number;
  colony: Colony;
  changeUsedTimesValue: HospitalBloc['changeUsedTimesValue'];
}) => {
  return (
    <div className={`${Style.antMiniCard} fadeIn`}>
      <Card className={`rarity-${props.ant.rarity}`}>
        <CardImg /*className={`specie ${props.ant.specie}`}*/ variant='top' src={`/images/mini-ant.png`} />
        <div className='box-type without-border'>
          {/* <img alt={props.ant.specie} className={`specie ${props.ant.specie}`} src={`/images/leaf.png`} /> */}
          <img alt={props.ant.type} className={`type ${props.ant.type}`} src={`/images/${props.ant.type}.png`} />
          <div className='power'>
            <span className={`rarity-${props.ant.rarity}`}>{props.ant.power}</span>
          </div>
        </div>
        <div className='box-usedtimes'>
          <p className='icon'>🩹</p>
          <input
            className='input-usedtimes'
            type='number'
            value={props.ant.usedtimes}
            onChange={(e) =>
              props.changeUsedTimesValue(
                props.ant,
                Number(e.target.value),
                props.colony.ants.find((antColony) => antColony._id === props.ant._id) as Ant,
                props.currentPool,
                props.colony
              )
            }
          />
        </div>
      </Card>
    </div>
  );
};

export default AntWithUsedTimesMiniCard;
