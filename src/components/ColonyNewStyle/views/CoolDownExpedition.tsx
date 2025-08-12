import { useState, useEffect } from 'react';
import styles from '../styles/coolDownSpot.module.scss';
import { SpotType } from '../types/SpotType';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { getDateTimeByColony } from '@ComponentsRoot/core/CryptoAntsUtils';

const CoolDownExpedition = (props: {
  cooldown_minutes: SpotType['cooldown_minutes'];
  refreshColony: () => Promise<void>;
  colony: Colony
}) => {
  const [count, setCount] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCount = () => {
      const currentTime = getDateTimeByColony(props.colony, true);
      const remainingMilliseconds = props.cooldown_minutes - (currentTime.toMillis() - startTime.toMillis());

      if (remainingMilliseconds <= 0) {
        clearInterval(timer);
        (async () => {
          await props.refreshColony();
        })();
        return;
      }

      const days = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);

      setCount({ days, hours, minutes, seconds });
    };

    const startTime = getDateTimeByColony(props.colony, true);

    calculateCount();

    const timer = setInterval(calculateCount, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cooldown_minutes, props.refreshColony]);

  const formatTime = () => {
    const { days, hours, minutes, seconds } = count;
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  return (
    <div className={styles.coolDown}>
      <div className='coolDownContent'>
        <p>{formatTime()}</p>
      </div>
    </div>
  );
};

export default CoolDownExpedition;
