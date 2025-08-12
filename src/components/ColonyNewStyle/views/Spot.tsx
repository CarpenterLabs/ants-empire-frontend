import { SpotType, spotEmojisSrcRelation } from '../types/SpotType';
import { SlotStatus, SpotProps } from '../types/Colony';
import CoolDownSpot from '@ComponentsRoot/ColonyNewStyle/views/CoolDownSpot';

export const Spot = ({ id, top, left, width, spot, unLockedCount, spotsInfo, spotImageSrc, materialAdjustment }: SpotProps) => {
  const { disabledOverlaySrc, chestSrc, handlerManageSpot, refreshColonyData, colonyData } = spotsInfo;

  /** returns both the status and the correct image src for that spot */
  function deriveSlotData(spot: SpotType): { status: SlotStatus; materialSrc: string } {
    // unlocked=false + has a spotId  → disabled+its icon
    if (!spot.unlocked && spot.spotId !== 0) {
      return {
        status: 'disabled',
        materialSrc: spotEmojisSrcRelation[spot.spotId],
      };
    }
    // unlocked=true → material+its icon
    if (spot.unlocked) {
      return {
        status: 'material',
        materialSrc: spotEmojisSrcRelation[spot.spotId],
      };
    }
    // otherwise → chest + fallback icon
    return {
      status: 'chest',
      materialSrc: spotEmojisSrcRelation[0],
    };
  }

  const { status, materialSrc } = deriveSlotData(spot);

  const handleClick = async () => {
    if ((spot.unlocked === true && !spot.coolDownStatus) || (spot.unlocked === false && unLockedCount === 1)) {
      await handlerManageSpot(spot, Number(spot.spotKey), colonyData.farmingTools);
    }
  };

  const getMaterialStyles = () => {
    const baseStyles = {
      position: 'absolute' as const,
      objectFit: 'contain' as const,
      pointerEvents: 'none' as const,
      imageRendering: 'crisp-edges' as any,
      display: 'block' as const,
      zIndex: 1,
    };

    if (materialAdjustment) {
      return {
        ...baseStyles,
        top: `${materialAdjustment.top}%`,
        left: `${materialAdjustment.left}%`,
        transform: 'translate(-50%, -50%) translateZ(0)',
      };
    }

    return {
      ...baseStyles,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) translateZ(0)',
      width: '100%',
      height: '100%',
    };
  };

  return (
    <div
      key={id}
      onClick={async () => await handleClick()}
      className={`spots-item ${unLockedCount === 1 ? 'firstLocked' : ''} ${unLockedCount > 1 ? 'not-allowed' : ''}`}
      style={{
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: `${width}%`,
        zIndex: 5,
        // cursor: isClickable ? 'pointer' : 'default',
      }}
    >
      <img
        src={spotImageSrc}
        alt=''
        className='spot-base'
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          imageRendering: 'crisp-edges' as any,
          display: 'block',
          transform: 'translateZ(0)',
        }}
      />

      {status !== 'chest' && materialSrc && <img src={materialSrc} alt='' className='material' style={getMaterialStyles()} />}

      {status === 'chest' && <img src={chestSrc} alt='' className='chest' style={getMaterialStyles()} />}

      {status === 'disabled' && <img src={disabledOverlaySrc} alt='' className='overlay' />}

      {/* Cooldown component */}
      {spot.coolDownStatus && (
        <CoolDownSpot
          last_time_recollect={spot.last_time_recollect}
          cooldown_minutes={spot.cooldown_minutes}
          refreshColony={refreshColonyData}
          colony={colonyData}
        />
      )}
    </div>
  );
};
