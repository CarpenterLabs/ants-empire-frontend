import ColonyBloc from '../bloc/ColonyBloc';

export type LightMode = 'morning' | 'midday' | 'night' | 'auto';
export type Phase = 'morning' | 'midday' | 'night';
export type ModeToggleProps = {
  lightMode: LightMode;
  autoPhase: Phase;
  onToggle: ColonyBloc['toggleLightMode'];
};
