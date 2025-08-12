import AntBloc from '../bloc/AntBloc';
import { AntSubject } from '../types/AntSubject';
import AntList from '@ComponentsRoot/AntList/providers/AntListProvider';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import { MintControls } from './MintControls';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
// import { useAccount } from 'wagmi';

const AntView = (props: { bloc: AntBloc; data: AntSubject }) => {
  // const { isConnected, address } = useAccount();

  useEffect(() => {
    (async () => {
      await props.bloc.getPrice();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <br></br>
      <h5>
        <FormattedMessage id='ant.mintAnt' />
      </h5>
      <MintControls fireMintFn={props.bloc.createAnts} />
      <br />
      <p>
        <img alt='Nectar Logo' style={{ width: '20px' }} src={`/images/nectar.png`} /> {props.data.price}
      </p>
      <AntList mintData={props.data.mintData} {...props.bloc.providerProps} setLoadingFn={props.bloc.setLoading} />
      {renderLoaderIfNeeded(props.data.isLoading)}
      {renderToastrIfNeeded(props.data.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
    </>
  );
};

export default AntView;
