import { renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { renderToastrIfNeeded } from '@ComponentsRoot/Toastr/ToastrManager';
import Style from '../styles/MarketView.module.scss';
import MarketBloc from '../bloc/MarketBloc';
import { MarketSubject } from '../types/MarketSubject';
import MarketFilterPanel from './MarketFilterPanel';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import AntMarketCard from '@ComponentsRoot/AntList/views/AntMarketCard';
import Pagination from './Pagination';
import BuyNFTModal from './BuyNFTModal';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { useEffect } from 'react';

const MarketView = (props: { bloc: MarketBloc; data: MarketSubject; isGuest: boolean }) => {
  useEffect(() => {
    (async () => {
      const { activeFilters, activeTab } = props.data;
      if (!activeFilters) return;

      await props.bloc.getMarketData({
        ...activeFilters,
        owner: activeTab !== 'Market',
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data.activeTab]);

  const renderPurchaseModalIfNeeded = () => {
    if (props.data.antToBuy && props.data.listingToBuy) {
      return (
        <BuyNFTModal
          antToBuy={props.data.antToBuy}
          listing={props.data.listingToBuy}
          handleCloseModalFn={props.bloc.cleanAntToBuy}
          intl={props.bloc.providerProps.intl}
          triggerPurchaseOnSC={props.bloc.triggerPurchaseOnSC}
          triggerUpdatePriceOnSC={props.bloc.triggerUpdatePriceOnSC}
          playerIsTheOwner={props.data.antToBuy.owner === props.bloc.providerProps.accountData?.owner}
          isGuest={props.isGuest}
          triggerDelistNftOnSC={
            props.data.antToBuy.owner === props.bloc.providerProps.accountData?.owner ? props.bloc.triggerDelistOnSC : undefined
          }
        />
      );
    }

    return <></>;
  };

  // const getCircles = () => {
  //   // return new Array(100).fill(<div className='circle'></div>);
  //   return Array.from({ length: 15 }, (_, i) => <div key={i + 1} className='firefly'></div>);
  // };

  const renderMarket = (mynfts: boolean) => {
    return (
      <div className='mainPageContainer'>
        <MarketFilterPanel
          mynftsTab={mynfts}
          getMarketDataFn={props.bloc.getMarketData}
          currentPage={props.data.marketData?.pagination.page!}
        />
        {props.data.marketData && (
          <div className='nftsList'>
            {props.data.marketData.ants.map((ant: Ant, key: number) => (
              <AntMarketCard
                ant={ant}
                key={key}
                listingItem={props.data.marketData?.listings.find((lst) => lst.nftId === ant.tokenId)!}
                onClickAntCard={props.bloc.onClickBuyAntMarketCard}
                playerIsTheOwner={ant.owner === props.bloc.providerProps.accountData?.owner}
              />
            ))}
          </div>
        )}

        {props.data.marketData && (
          <Pagination
            pagination={props.data.marketData?.pagination!}
            onPageChange={async (newPage: number) =>
              await props.bloc.getMarketData({ ...props.data.activeFilters!, page: newPage, owner: mynfts })
            }
          />
        )}

        {renderPurchaseModalIfNeeded()}
        {renderLoaderIfNeeded(props.data.isLoading)}
        {renderToastrIfNeeded(props.data.toastr, props.bloc.resetSubjectActions, props.bloc.providerProps.intl)}
      </div>
    );
  };

  return (
    <div className={`${Style.marketView} fadeIn`}>
      <Nav tabs>
        <NavItem className={`mrkt ${props.data.activeTab === 'Market' ? `active` : ``}`}>
          <NavLink className={`${props.data.activeTab === 'Market' ? `active` : ``}`} onClick={() => props.bloc.setTab('Market')}>
            <FormattedMessage id={'market.marketTab'} />
          </NavLink>
        </NavItem>
        {!props.isGuest && (
          <NavItem className={`myNfts ${props.data.activeTab === 'Mynfts' ? `active` : ``}`}>
            <NavLink
              className={`${props.data.activeTab === 'Mynfts' ? `active` : ``}`}
              onClick={() => props.bloc.setTab('Mynfts')}
            >
              <FormattedMessage id={'market.mynftsTab'} />
            </NavLink>
          </NavItem>
        )}
      </Nav>
      <TabContent activeTab={props.data.activeTab}>
        <TabPane tabId='Market'>{props.data.activeTab === 'Market' && renderMarket(false)}</TabPane>
        {!props.isGuest && <TabPane tabId='Mynfts'>{props.data.activeTab === 'Mynfts' && renderMarket(true)}</TabPane>}
      </TabContent>
    </div>
  );
};

export default MarketView;
