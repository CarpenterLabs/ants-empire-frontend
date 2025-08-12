import { useEffect, useRef } from 'react';
import '../styles/Fireflies.scss';

const random = (min, max) => Math.random() * (max - min) + min;

const Fireflies = (props: { visible: boolean; quantity: number }) => {
  const addedKeyframes = useRef(new Set());

  useEffect(() => {
    const sheet = document.styleSheets[0];

    for (let i = 0; i < props.quantity; i++) {
      if (addedKeyframes.current.has(i)) continue;

      const steps = 6; // More steps = more organic
      let keyframes = `@keyframes move${i} {\n`;

      for (let s = 0; s <= steps; s++) {
        const percent = (s / steps) * 100;
        const x = random(-50, 50);
        // const y = random(-50, 50);
        const y = random(-50, 10);
        const scale = random(0.4, 1);
        keyframes += `  ${percent}% { transform: translateX(${x}vw) translateY(${y}vh) scale(${scale}); }\n`;
      }

      keyframes += `}`;

      try {
        sheet.insertRule(keyframes, sheet.cssRules.length);
        addedKeyframes.current.add(i);
      } catch (e) {
        // prevent crash
      }
    }
  }, [props.quantity]);

  return (
    <>
      {props.visible ? (
        [...Array(props.quantity)].map((_, i) => {
          const duration = `${random(60, 120)}s`;
          const flashDelay = `${random(0, 8000)}ms`;
          const flashDuration = `${random(4000, 10000)}ms`;

          return (
            <div
              key={i}
              className={`firefly move${i}`}
              style={{ animation: `move${i} ${duration} ease-in-out infinite alternate` }}
            >
              <div
                className='glow'
                style={{
                  animationDelay: `0ms, ${flashDelay}`,
                  animationDuration: `12s, ${flashDuration}`,
                }}
              />
            </div>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default Fireflies;
