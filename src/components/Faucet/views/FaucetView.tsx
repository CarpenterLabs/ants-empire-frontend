import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { toast } from 'react-toastify';
import { Button } from 'reactstrap';
import FaucetBloc from '../bloc/FaucetBloc';
import Style from '../styles/faucetView.module.scss';
import { FaucetSubject } from '../types/FaucetSubject';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';

const functionToShowToastr = () => {
  toast.success('Claim successful!', {
    position: 'top-right',
    autoClose: 5000, // 5 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const FaucetView = (props: { bloc: FaucetBloc; data: FaucetSubject }) => {
  useEffect(() => {
    (async () => {
      await props.bloc.getFaucetBalance();
    })();

    const unsub = props.bloc.faucetRepository.subscribeToSuccessFullClaim(
      props.bloc.providerProps.accountData?.owner!,
      functionToShowToastr
    );

    return () => {
      unsub!(); // Cleanup function to stop watching the event
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={Style.faucetView}>
      <div className='general-faucet-container fadeIn'>
        <div className='subContainer'>
          <div className='title'>
            <span className='nec'>Nectar</span>
            <span>FAUCET</span> <img alt='Nectar Logo' style={{ width: '40px' }} src={`/images/finals/icons/nectar.png`} />
          </div>
          <div className='balance'>
            <span className='txt'>Faucet Balance: </span>
            {props.data.faucetBalance}
          </div>
        </div>
        <div className='subContainer claim'>
          <Button className='claimBtn' onClick={async () => await props.bloc.claim()}>
            <FormattedMessage id='general.claim' />
          </Button>
        </div>
      </div>

      {renderLoaderIfNeeded(props.data.isLoading)}
    </div>
  );
};

export default FaucetView;
