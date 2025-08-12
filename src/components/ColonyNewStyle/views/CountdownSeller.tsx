import { useState, useEffect, useRef } from 'react';
import { DateTime } from 'luxon';
import { CountdownSellerProps } from '@ComponentsRoot/Seller/types/Seller';

const CountdownSeller = ({ endTimeISO, active_time, onExpire }: CountdownSellerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startTime = DateTime.fromISO(endTimeISO, { zone: 'utc' });
    const endTime = startTime.plus({ hours: active_time });

    const updateTimer = () => {
      const now = DateTime.utc();
      if (now >= endTime) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpire?.();
        return;
      }

      const diff = endTime.diff(now, ['days', 'hours', 'minutes', 'seconds']).toObject();
      setTimeLeft({
        days: Math.floor(diff.days ?? 0),
        hours: Math.floor(diff.hours ?? 0),
        minutes: Math.floor(diff.minutes ?? 0),
        seconds: Math.floor(diff.seconds ?? 0),
      });
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endTimeISO, active_time, onExpire]);

  const { days, hours, minutes, seconds } = timeLeft;
  if (days > 0) return <span>{`${hours}h ${minutes}m ${seconds}s`}</span>;
  if (hours > 0) return <span>{`${hours}h ${minutes}m ${seconds}s`}</span>;
  if (minutes > 0) return <span>{`${minutes}m ${seconds}s`}</span>;
  return <span>{`${seconds}s`}</span>;

  

};

export default CountdownSeller;
