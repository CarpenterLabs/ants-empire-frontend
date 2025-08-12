import ColoniesBloc from '../bloc/ColoniesBloc';
import { ColoniesSubject } from '../types/ColoniesSubject';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import Style from '../styles/coloniesView.module.scss';
import { useEffect } from 'react';
import ColonyCard from './ColonyCard';

const ColoniesView = (props: { bloc: ColoniesBloc; data: ColoniesSubject }) => {
  useEffect(() => {
    (async () => {
      await props.bloc.getColoniesData();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`${Style.coloniesView} fadeIn`}>
      {props.data.coloniesData ? (
        <div className='listColonies'>
          {props.data.coloniesData.map((colony, key) => (
            <ColonyCard
              onCardClick={() => props.bloc.providerProps.navigate(`/game/colony/${colony._id}`)}
              key={key}
              {...colony}
            />
          ))}
        </div>
      ) : (
        ''
      )}
      {renderLoaderIfNeeded(props.data.isLoading)}
      {renderToastrIfNeeded(props.data.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
    </div>
  );
};

export default ColoniesView;
