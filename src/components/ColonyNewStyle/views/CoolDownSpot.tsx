import { useState, useEffect } from 'react';
import styles from '../styles/coolDownSpot.module.scss';
import { DateTime } from 'luxon';
import { SpotType } from '../types/SpotType';
import { getDateTimeByColony } from '@ComponentsRoot/core/CryptoAntsUtils';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';

const CoolDownSpot = (props: {
  last_time_recollect: SpotType['last_time_recollect'];
  cooldown_minutes: SpotType['cooldown_minutes'];
  refreshColony: () => Promise<void>;
  colony: Colony;
}) => {
  const [count, setCount] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const lastTimeRecollect = DateTime.fromISO(props.last_time_recollect!, { zone: 'utc' });
    const cooldownMinutes = props.cooldown_minutes;

    const calculateCount = () => {
      const currentTime = getDateTimeByColony(props.colony);
      const elapsedTime = currentTime.diff(lastTimeRecollect, 'minutes').minutes;
      const remainingMinutes = cooldownMinutes - elapsedTime;

      if (remainingMinutes <= 0) {
        clearInterval(timer);
        (async () => {
          await props.refreshColony();
        })();
        return;
      }

      const hours = Math.floor(remainingMinutes / 60);
      const minutes = Math.floor(remainingMinutes % 60);
      const seconds = Math.floor((remainingMinutes % 1) * 60);

      setCount({ hours, minutes, seconds });
    };

    calculateCount();

    const timer = setInterval(calculateCount, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.last_time_recollect, props.cooldown_minutes, props.refreshColony]);

  const formatTime = () => {
    const { hours, minutes, seconds } = count;
    if (hours === 0 && minutes === 0 && seconds === 0) {
      return '1s';
    } else if (hours === 0 && minutes === 0 && seconds <= 60) {
      return `${seconds}s`;
    } else if (hours === 0 && minutes === 1 && seconds === 0) {
      return '1m';
    } else if (hours === 1 && minutes === 0 && seconds === 0) {
      return '1h';
    }
    return `${hours > 0 ? `${hours}h` : ''} ${minutes > 0 ? `${minutes}m` : ''}`;
  };

  // compute percentage fill (0–100)
  const remainingTotalMin = count.hours * 60 + count.minutes + count.seconds / 60;
  const percent = Math.max(0, Math.min(100, (remainingTotalMin / props.cooldown_minutes) * 100));

  return (
    <div className={styles.coolDown}>
      <div className='coolDownContent' style={{ '--percent': percent } as React.CSSProperties}></div>
      <div className='time'>{formatTime()}</div>
    </div>
  );
};

export default CoolDownSpot;
