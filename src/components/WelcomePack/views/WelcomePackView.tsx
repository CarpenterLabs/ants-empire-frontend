import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { PackToBuy } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';
import WelcomePackBloc from '../bloc/WelcomePackBloc';
import Style from '../styles/welcomePackView.module.scss';
import { WelcomePackSubject } from '../types/WelcomePackSubject';
import WelcomePackCard from './WelcomePackCard';
import RevealedWelcomePackModal from './RevealedWelcomePackModal';
import { useOutletContext } from 'react-router-dom';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';

const WelcomePackView = (props: { bloc: WelcomePackBloc; data: WelcomePackSubject }) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  useEffect(() => {
    (async () => {
      await props.bloc.getWelcomePackData(props.bloc.providerProps.location.state as { [key: string]: boolean });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFinalPriceSelectedPack = () => {
    const selectedPack = props.bloc.getSelectedPackById(props.data.selectedPack.packToBuyId);
    const finalPrice = selectedPack!.priceDiscount && selectedPack!.available ? selectedPack!.priceDiscount : selectedPack!.price;
    return finalPrice;
  };

  const renderWarningBurningModalButtons = () => {
    return (
      <>
        <Button color='primary' onClick={() => props.bloc.buyWP(props.data.selectedPack, getFinalPriceSelectedPack(), outletContext.socketIOService)}>
          <FormattedMessage id='general.accept' />
        </Button>
        <Button color='warning' style={{ color: 'white' }} onClick={() => props.bloc.togglerModal('warningBurningModal')}>
          <FormattedMessage id='pack.otherpacks' />
        </Button>
      </>
    );
  };

  const renderNewPlayerModalButtons = () => {
    return (
      <>
        <Button color='primary' onClick={() => props.bloc.togglerModal('newPlayerModal')}>
          <FormattedMessage id='pack.new.accept' />
        </Button>
      </>
    );
  };

  const getRevealedModalBody = () => {
    return (
      <div className={Style.listAntMiniCards}>
        <FormattedMessage id='pack.warning.body' />
      </div>
    );
  };

  const getNewPlayerModalBody = () => {
    return (
      <>
        <p style={{ textAlign: 'center', fontSize: '25px' }}>
          {props.bloc.providerProps.intl.formatMessage({ id: 'pack.new.title' })}
        </p>
        <p>{props.bloc.providerProps.intl.formatMessage({ id: 'pack.new.text2' })}</p>
        <p>{props.bloc.providerProps.intl.formatMessage({ id: 'pack.new.text3' })}</p>
        <p>{props.bloc.providerProps.intl.formatMessage({ id: 'pack.new.text4' })}</p>
        <p>{props.bloc.providerProps.intl.formatMessage({ id: 'pack.new.text5' })}</p>
      </>
    );
  };

  return (
    <div className={`${Style.welcomePackView} fadeIn`}>
      {props.data.WelcomePackData ? (
        <>
          {props.data.WelcomePackData.available ? (
            <div className='listAvailablePacks'>
              {props.data.WelcomePackData.available.map((pack: PackToBuy, key: number) => (
                <WelcomePackCard
                  key={key}
                  pack={pack}
                  manageBuyWP={props.bloc.manageBuyWP}
                  purchased={props.data.WelcomePackData.purchased}
                  togglerModal={() => props.bloc.togglerModal('isRevealedModalOpen')}
                />
              ))}
            </div>
          ) : (
            ''
          )}

          {props.data.WelcomePackData.purchased && props.data.isRevealedModalOpen ? (
            <RevealedWelcomePackModal
              pack={props.data.WelcomePackData.purchased}
              resolveWelcomePackFn={props.bloc.resolveWelcomePack}
              togglerRevealedWelcomePackModalFn={() => props.bloc.togglerModal('isRevealedModalOpen')}
              togglerOtherPacksFn={() => props.bloc.togglerModal('isRevealedModalOpen')}
            />
          ) : (
            ''
          )}

          {props.data.WelcomePackData.purchased && props.data.warningBurningModal ? (
            <CustomModal
              open={true}
              size='xs'
              title={props.bloc.providerProps.intl.formatMessage({ id: 'pack.warning.title' })}
              footer={renderWarningBurningModalButtons()}
              togglerModal={() => props.bloc.togglerModal('warningBurningModal')}
              body={getRevealedModalBody()}
            />
          ) : (
            ''
          )}

          {props.data.newPlayerModal && !props.data.WelcomePackData.purchased ? (
            <CustomModal
              open={true}
              size='xs'
              title={props.bloc.providerProps.intl.formatMessage({ id: 'pack.new.text1' })}
              footer={renderNewPlayerModalButtons()}
              togglerModal={() => props.bloc.togglerModal('newPlayerModal')}
              body={getNewPlayerModalBody()}
            />
          ) : (
            ''
          )}
        </>
      ) : (
        ''
      )}
      {renderLoaderIfNeeded(props.data.isLoading)}
      {renderToastrIfNeeded(props.data.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
    </div>
  );
};

export default WelcomePackView;
