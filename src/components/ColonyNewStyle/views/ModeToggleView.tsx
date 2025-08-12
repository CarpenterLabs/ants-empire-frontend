import classNames from 'classnames';
import { LightMode } from '../types/ModeToggleType';

const ModeToggle = ({ lightMode, autoPhase, onToggle }) => {
  const buttons: { mode: LightMode; icon: string }[] = [
    { mode: 'morning', icon: '☀️' },
    { mode: 'midday', icon: '🌞' },
    { mode: 'night', icon: '🌙' },
    { mode: 'auto', icon: '🌎' },
  ];

  return (
    <div className='modeToggle'>
      {buttons.map(({ mode, icon }) => {
        const isSelected = lightMode === mode;
        const isAutoActive = lightMode === 'auto' && autoPhase === mode;
        return (
          <button
            key={mode}
            className={classNames(mode, {
              selected: isSelected,
              'auto-active': isAutoActive,
            })}
            onClick={() => onToggle(mode)}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
};

export default ModeToggle;
