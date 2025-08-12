import CustomModal from '@ComponentsRoot/core/CustomModal';
import { FormattedMessage, IntlShape } from 'react-intl';
import ModalStyle from '@ComponentsRoot/Market/styles/BuyNFTModal.module.scss';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
// import AntMiniCard from '@ComponentsRoot/AntList/views/AntMiniCard';
import { Button } from 'reactstrap';
import { MarketListing } from '../types/MarketListing';
import AntMarketCard from '@ComponentsRoot/AntList/views/AntMarketCard';
import { useState } from 'react';
import { InputNumberBase } from '@ComponentsRoot/core/InputNumberBase';

const BuyNFTModal = (props: {
  handleCloseModalFn: () => void;
  intl: IntlShape;
  antToBuy: Ant;
  listing: MarketListing;
  playerIsTheOwner: boolean;
  isGuest: boolean;
  triggerPurchaseOnSC: (listingId: number) => Promise<void>;
  triggerUpdatePriceOnSC: (listingId: number, newPrice: number) => Promise<void>;
  triggerDelistNftOnSC?: (listingId: number) => Promise<void>;
}) => {
  const [newPrice, setPrice] = useState<number>(0);
  const [editPriceInptVisible, setEditPriceInptVisible] = useState<boolean>(false);
  const [confirming, setConfirmingDelist] = useState(false);

  const isEditButtonDisabled = () => {
    if (editPriceInptVisible) {
      if (newPrice) return false;
      return true;
    }

    return false; //so enabled
  };

  const getModalBody = () => {
    return (
      <div className={ModalStyle.buyNFTModal}>
        <div className='mainbody'>
          <div className='list-ants'>
            {/* <AntMiniCard ant={props.antToBuy} /> */}
            <AntMarketCard
              ant={props.antToBuy}
              listingItem={props.listing}
              onClickAntCard={() => {}}
              playerIsTheOwner={props.playerIsTheOwner}
            />
          </div>
          <div className='feeText'>
            <FormattedMessage id='market.devFee' />
          </div>
          {/* <div className='priceArea'>
            {props.listing.price}
          </div> */}
          <div className='button-box'>
            {!props.playerIsTheOwner && (
              <Button
                disabled={props.isGuest}
                className='purchaseBtn'
                onClick={async () => await props.triggerPurchaseOnSC(props.listing.listingId)}
              >
                <FormattedMessage id='market.purchaseFor' /> {props.listing.price}
                <img alt='Nectar Logo' src={`/images/finals/icons/nectar.png`} />
              </Button>
            )}

            {props.playerIsTheOwner && (
              <div className={`${editPriceInptVisible ? 'editMode' : ''} ownerBtns`}>
                {props.playerIsTheOwner && (
                  <Button
                    className={`editButton ${editPriceInptVisible && newPrice ? 'saveBtn' : ''}`}
                    disabled={isEditButtonDisabled()}
                    // color='warning'
                    // style={{ color: 'white' }}
                    onClick={async () =>
                      !editPriceInptVisible
                        ? setEditPriceInptVisible(true)
                        : await props.triggerUpdatePriceOnSC(props.listing.listingId, newPrice)
                    }
                  >
                    {editPriceInptVisible && newPrice ? (
                      <FormattedMessage id='market.editPriceSave' />
                    ) : (
                      <>
                        <img src='/images/finals/icons/pickaxe.png' alt='edit' />
                        <FormattedMessage id='market.editPrice' />
                      </>
                    )}
                  </Button>
                )}

                {props.playerIsTheOwner && (
                  <Button
                    className='cancelButton'
                    onClick={() => {
                      if (!confirming) {
                        // 1st click: Ask for confirmation
                        setConfirmingDelist(true);
                      } else {
                        // 2nd click: Perform action
                        setEditPriceInptVisible(false);
                        setPrice(0);
                        setConfirmingDelist(false); // Reset confirmation state
                        if (props.triggerDelistNftOnSC) {
                          (async () => {
                            await props.triggerDelistNftOnSC!(props.listing.listingId);
                          })();
                        }
                      }
                    }}
                  >
                    {confirming ? (
                      'Are you sure?'
                    ) : (
                      <>
                        <img src='/images/finals/icons/fail_icon.png' alt='delist' /> <FormattedMessage id='market.delist' />
                      </>
                    )}
                  </Button>
                )}

                {editPriceInptVisible && (
                  <div className='newPriceZone fadeIn'>
                    <span className='newPriceTitle'>
                      <FormattedMessage id='market.newPrice' />
                    </span>
                    <InputNumberBase
                      className='newPriceInpt'
                      maxDecimals={2}
                      value={newPrice}
                      setValueFn={(value: number) => setPrice(value)}
                      name='newPrice'
                    />
                    <Button
                      className='cancelButtonNewPrice'
                      onClick={() => {
                        setEditPriceInptVisible(false);
                        setPrice(0);
                      }}
                      // color='danger'
                    >
                      <img src='/images/finals/icons/fail_icon.png' alt='cancel' />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          {props.isGuest && <div className='notLoged'>Please, Connect your Wallet</div>}
        </div>
      </div>
    );
  };

  const mountModalHeader = () => {
    return (
      <div>
        <div className='assignerHeader'>
          <div>{props.intl.formatMessage({ id: props.playerIsTheOwner ? 'market.manageAnt' : 'market.purchaseAntTitle' })}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <CustomModal
        size={'lg'}
        body={getModalBody()}
        open
        class={ModalStyle.mainBuyModal}
        title={mountModalHeader()}
        togglerModal={props.handleCloseModalFn}
        modalHeaderClassName='standarModalHeader'
      />
    </>
  );
};

export default BuyNFTModal;
