import React, { useEffect } from 'react';
import AntListBloc from '../bloc/AntListBloc';
import { AntListSubject } from '../types/AntListSubject';
import Style from '../styles/antListView.module.scss';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { FormattedMessage } from 'react-intl';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
// import AntListFilter from '../../AntFilter/providers/AntFilterProvider';
// import AntOrderProvider from '@ComponentsRoot/AntOrder/providers/AntOrderProvider';
import { useAccount } from 'wagmi';
import AntMiniCard from './AntMiniCard';

const AntListView = (props: {
  bloc: AntListBloc;
  data: AntListSubject;
  mintData: any;
  setLoadingParentFn: (bool?: boolean) => void;
}) => {
  const { isConnected, address } = useAccount();

  useEffect(() => {
    (async () => {
      await props.bloc.listAllAnts();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mintData]); // checks for changes in the values in this array

  useEffect(() => {
    let unwatch: undefined | (() => void); // Declare unwatch outside the if block to make it accessible in the cleanup function

    if (isConnected && address) {
      unwatch = props.bloc.providerProps.repositoryManager
        .getAntRepository()
        .initializeANTSCEventsListeners(props.bloc.listAllAnts, address);
    }

    // Cleanup function
    return () => {
      if (unwatch) {
        // Check if unwatch is defined before calling it
        unwatch();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  return (
    <div className={`${Style.antListView} fadeIn`}>
      <div className='antListView-content'>
        {props.data.listData && props.data.listData.length ? (
          <div className='filter-order'>
            {/* <AntListFilter filterChanged={props.bloc.changeFilter} ants={props.data.listData} /> */}
            {/* <AntOrderProvider orderChanged={props.bloc.changeOrder} ants={props.data.filteredData} /> */}
          </div>
        ) : (
          ''
        )}

        <h5>
          <FormattedMessage id='cpanel.antList' />: ({props.bloc.getLength()})
        </h5>

        {props.data && props.data.listData && props.data.listData.length ? (
          <>
            <div className='list-ants'>
              {props.data.listData.map((ant: Ant, key: number) => (
                <React.Fragment key={key}>
                  <AntMiniCard ant={ant} />
                </React.Fragment>
              ))}
            </div>
          </>
        ) : props.data.listData && props.data.listData.length ? (
          <FormattedMessage id={'mintPage.withoutAntsFilter'} />
        ) : (
          <FormattedMessage id={'mintPage.withoutAnts'} />
        )}
      </div>
      {renderLoaderIfNeeded(props.data.isLoading)}
    </div>
  );
};
export default AntListView;
