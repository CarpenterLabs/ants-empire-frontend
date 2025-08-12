import { SellerViewProps } from '../types/SellerSubject';
import Style from '../styles/sellerModalView.module.scss';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { Button } from 'reactstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useOutletContext } from 'react-router-dom';
import SellerModalView from './SellerModalView';

const SellerView = (props: SellerViewProps) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  const intl = useIntl();

  const sellerIsDisabled = () => {
    if (props.sellerData.available.freeCall) {
      return false;
    } else if (Number(props.bloc.providerProps.colonyBloc.providerProps.accountData!.nectar) >= props.sellerData.callNectarCost) {
      return false;
    }
    return true;
  };

  // MODAL GENERAL CALL SELLER
  const getModalTitle = (sellerType: 'free' | 'paid') => {
    return <FormattedMessage id={`seller.dialog.title.${sellerType}`} />;
  };
  const mountMainModalBody = (sellerType: 'free' | 'paid') => {
    return (
      <div className={`${Style.sellerCallView} fadeIn`}>
        <div className='general-box'>
          <FormattedMessage id={`seller.dialog.body.${sellerType}`} />
        </div>
      </div>
    );
  };

  const mountModalFooterBtns = () => {
    return (
      <>
        <Button
          onClick={props.bloc.providerProps.colonyBloc.toggleCallSellerDialog}
          className={`levelUpBtn cancel ${sellerIsDisabled() && 'disabled'}`}
        >
          <FormattedMessage id='general.cancel' />
        </Button>

        <Button
          onClick={() => props.bloc.callSeller(props.sellerData, props.colony._id as string, outletContext)}
          className={`levelUpBtn ${sellerIsDisabled() && 'disabled'}`}
        >
          <FormattedMessage id='seller.dialog.accept' />
        </Button>
      </>
    );
  };

  const renderMainModal = () => {
    const sellerType = props.sellerData.available.freeCall ? 'free' : 'paid';
    return (
      <CustomModal
        size='md'
        modalHeaderClassName='standarModalHeader'
        modalBodyClassName='sellerModalBody'
        modalFooterClassName='sellerModalFooter'
        class='withWhiteBorder'
        body={mountMainModalBody(sellerType)}
        open
        title={getModalTitle(sellerType)}
        footer={mountModalFooterBtns()}
        togglerModal={props.bloc.providerProps.colonyBloc.toggleCallSellerDialog}
      />
    );
  };
  //********/

  // MODAL SWAP SELLER
  const getSwapModalTitle = () => {
    return <FormattedMessage id='seller.dialog.swap.title' />;
  };

  const mountSwapMainModalBody = () => (
    <SellerModalView colony={props.colony} sellerData={props.sellerData} subjectValue={props.subjectValue} bloc={props.bloc} />
  );

  const renderSwapMainModal = () => {
    return (
      <CustomModal
        size='xl'
        modalHeaderClassName='standarModalHeader'
        modalBodyClassName='sellerModalBody'
        class='max withWhiteBorder'
        body={mountSwapMainModalBody()}
        open
        title={getSwapModalTitle()}
        togglerModal={() => props.bloc.toggleSwapModal()}
      />
    );
  };
  //********/

  return (
    <div className={Style.sellerView}>
      {props.sellerDialog && renderMainModal()}
      {props.subjectValue.swapModal && renderSwapMainModal()}
      {renderLoaderIfNeeded(props.subjectValue.isLoading)}
      {renderToastrIfNeeded(props.subjectValue.toastr, props.bloc.resetSubjectActions, intl)}
    </div>
  );
};

export default SellerView;
