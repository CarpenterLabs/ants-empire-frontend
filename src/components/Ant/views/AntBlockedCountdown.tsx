import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import styles from '../styles/CoolDownAnt.module.scss';

const AntBlockedCountdown = (props: { remainingMilliseconds: number; onTimerEndFn?: () => Promise<void> }) => {
  const [count, setCount] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateCount = () => {
      const currentTime = DateTime.now();
      const remainingMilliseconds = props.remainingMilliseconds - (currentTime.toMillis() - startTime.toMillis());

      if (remainingMilliseconds <= 0) {
        clearInterval(timer);
        (async () => {
          if (props.onTimerEndFn) {
            await props.onTimerEndFn();
          }
        })();
        return;
      }

      const days = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);

      setCount({ days, hours, minutes, seconds });
    };

    const startTime = DateTime.now();

    calculateCount();

    const timer = setInterval(calculateCount, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.remainingMilliseconds]);

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
    <div className={styles.coolDownAnt}>
      <div className='coolDownContent'>
        <p>{formatTime()}</p>
      </div>
    </div>
  );
};

export default AntBlockedCountdown;
