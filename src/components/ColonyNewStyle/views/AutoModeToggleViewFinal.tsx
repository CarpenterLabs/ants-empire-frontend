import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { DateTime } from 'luxon';

export type LightMode = 'morning' | 'midday' | 'night';
export type Mode = LightMode | 'auto';

type AutoModeToggleProps = {
  onModeChange?: (mode: LightMode) => void;
  debug?: boolean;
};

/* ▸ MODE RANGES ---------------------------------------------------- */
const modeRanges: Record<LightMode, [number, number]> = {
  morning: [5, 12],   // 05:00 – 11:59
  midday:  [12, 20],  // 12:00 – 19:59
  night:   [20, 29],  // 20:00 – 04:59 (29 = 05 + 24)
};

/* ▸ HELPERS -------------------------------------------------------- */
function getMode(dt: DateTime): LightMode {
  const h = dt.hour < 5 ? dt.hour + 24 : dt.hour;
  if (h < modeRanges.morning[1]) return 'morning';
  if (h < modeRanges.midday[1])  return 'midday';
  return 'night';
}

function getProgress(dt: DateTime, mode: LightMode) {
  const t = dt.hour < 5 ? dt.plus({ hours: 24 }) : dt;
  const [s, e] = modeRanges[mode];
  const start = t.set({ hour: s % 24, minute: 0, second: 0, millisecond: 0 });
  let end     = t.set({ hour: e % 24, minute: 0, second: 0, millisecond: 0 });
  if (e > 24) end = end.plus({ days: 1 });
  const total = end.diff(start).as('milliseconds');
  const elapsed = t.diff(start).as('milliseconds');
  return Math.min(1, Math.max(0, elapsed / total));
}

const bellCurve = (p: number) => 1 - Math.abs(p - 0.5) * 2;

/* Night overlay fade-out (04:30 → 05:30) */
function getNightFadeOut(now: DateTime): number {
  let min = now.hour * 60 + now.minute;          // minutes since 00:00
  if (min < 330) min += 1440;                    // shift 00‑05:29 to 24‑29h
  const start = 1650; // 04:30
  const end   = 1710; // 05:30
  if (min < start) return 1;
  if (min > end)   return 0;
  return 1 - (min - start) / (end - start);
}

/* ▸ COMPONENT ------------------------------------------------------ */
const AutoModeToggle: React.FC<AutoModeToggleProps> = ({ onModeChange, debug = true }) => {
  const [modeSel, setModeSel] = useState<Mode>('auto');
  const lastAutoRef = useRef<LightMode>(getMode(DateTime.local()));

  /* ——— central DOM writer ——— */
  const applyAutoCSS = (now: DateTime) => {
    const mode = getMode(now);
    const prog = getProgress(now, mode);
    const inten = bellCurve(prog);
    const fade  = getNightFadeOut(now);

    const root = document.documentElement;
    root.classList.remove('morning', 'midday', 'night');
    root.classList.add(mode);
    root.style.setProperty('--lightModeProgress', prog.toFixed(3));
    root.style.setProperty('--lightIntensity',  inten.toFixed(3));
    root.style.setProperty('--nightFadeOut',    fade.toFixed(3));

    return mode; // return for caller convenience
  };

  /* manual override handler */
  const applyManualCSS = (m: LightMode) => {
    const root = document.documentElement;
    root.classList.remove('morning', 'midday', 'night');
    root.classList.add(m);
    root.style.setProperty('--lightModeProgress', '0');
    root.style.setProperty('--lightIntensity', '0');
    root.style.setProperty('--nightFadeOut', '1');
  };

  /* button click */
  const handleClick = (m: Mode) => {
    setModeSel(m);
    if (m === 'auto') {
      // immediately sync to clock when user re-enables auto
      const now  = DateTime.local();
      const mode = applyAutoCSS(now);
      lastAutoRef.current = mode; // reset tracker
      onModeChange?.(mode);
    } else {
      applyManualCSS(m);
      onModeChange?.(m);
    }
  };

  /* auto loop */
  useEffect(() => {
    if (modeSel !== 'auto') return;

    const tick = () => {
      const now  = DateTime.local();
      const mode = applyAutoCSS(now);

      if (mode !== lastAutoRef.current) {
        lastAutoRef.current = mode;
        onModeChange?.(mode);
      }

      if (debug) {
        const p = getProgress(now, mode).toFixed(2);
        const f = getNightFadeOut(now).toFixed(2);
        console.info(`[Auto] ${now.toFormat('HH:mm')} mode=${mode} prog=${p} fade=${f}`);
      }
    };

    tick();
    const id = window.setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [modeSel, onModeChange, debug]);

  /* UI buttons */
  const buttons: { mode: Mode; icon: string }[] = [
    { mode: 'morning', icon: '☀️' },
    { mode: 'midday',  icon: '🌞' },
    { mode: 'night',   icon: '🌙' },
    { mode: 'auto',    icon: '🌎' },
  ];

  return (
    <div className="modeToggle">
      {buttons.map(({ mode, icon }) => (
        <button
          key={mode}
          className={classNames(mode, { selected: modeSel === mode })}
          onClick={() => handleClick(mode)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
};

export default AutoModeToggle;
