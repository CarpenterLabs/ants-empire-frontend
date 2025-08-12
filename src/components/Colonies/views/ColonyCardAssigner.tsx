// import { FormattedMessage } from 'react-intl';
import { Card, CardBody, CardImg, CardTitle, Col } from 'reactstrap';
import Style from '../styles/colonyCardAssigner.module.scss';
import { Colony } from '../types/Colony';
import { materialEmojisRelation } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import { useEffect, useState } from 'react';
import { maxDecimals } from '@ComponentsRoot/core/CryptoAntsUtils';
import { roomsEmojisRelation } from '@ComponentsRoot/Colony/types/RoomType';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { PurchasedPack } from '@ComponentsRoot/ControlPanel/components/CPanelStandard/types/Cache';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import { isAnt } from '@ComponentsRoot/Inventory/Utils/InventoryUtils';

const ColonyCardAssigner = (
  props: Colony & {
    antsColony: Ant[];
    miniCard?: boolean;
    onCardClick: () => void;
    isSelected?: boolean;
    defaultSelected?: boolean;
    itemsToAssign: (Ant | PurchasedMaterialBox | PurchasedPack)[];
  }
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

  const renderRooms = () => {
    return props.rooms
      .filter((room) => room.capacity_ants)
      .map((room, key) => {
        const roomIdByAntType = {
          worker: 1,
          flying: 2,
          soldier: 3,
        };
        const allAntsByRoom = props.itemsToAssign.filter((item) => {
          if (isAnt(item)) {
            const ant = item as Ant;
            return ant.power && roomIdByAntType[ant.type] === room.roomId;
          }
          return false;
        });
        const currentAntsInRoom = props.antsColony.filter(ant => ant.roomid === room.roomId);
        const totalAntsInRoom = allAntsByRoom.length + currentAntsInRoom.length;
        const powerTotalToIncrease = (allAntsByRoom as Ant[]).reduce((sum, item) => sum + item.power, 0);
        const powerTotalInRoom = room.currentRoomAntsPower! + powerTotalToIncrease;
        let canIncrease: boolean | null = null;
        if(powerTotalInRoom > room.maxAllocPowerCurrentLvl! || totalAntsInRoom > room.level!){
          canIncrease = false;
        }else if(powerTotalToIncrease === 0 && allAntsByRoom.length === 0){
          canIncrease = null;
        }else{
          canIncrease = true;
        }
        return (
          <div
            key={key}
            className={`box-room ${canIncrease}`}
          >
            <p className={`ant-number ${totalAntsInRoom > room.level! && 'bold'}`}>
              <img src={'/images/micro-ant.png'} className='miniAntIcon' alt='miniAnt' />
              {totalAntsInRoom}/{room.level}
            </p>
            <p>
              {`${room.name}`}
              <span className='emoji-room'> {roomsEmojisRelation[room.roomId as number]} </span>

            </p>
            <p
              className={`power ${powerTotalInRoom > room.maxAllocPowerCurrentLvl! && 'bold'}`}
            >{`${powerTotalInRoom}/${room.maxAllocPowerCurrentLvl}`}</p>
          </div>
        );
      });
  };

  const checkIfRenderSelectedIcon = () => {
    return (
      <div className={`selectionCircle circle fadeIn selected`}>
        <p className='check'>{'✓'}</p>
      </div>
    );
  };

  return (
    <div className={Style.colonyCardAssigner} onClick={props.onCardClick}>
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
            {' '}
            {renderRooms()}
            <div className={`count-ants ${props.type}`}>
              <p className='count'>{props.ants_resume.total}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ColonyCardAssigner;
