import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import MarketRepository from '@Repositories/MarketRepository';
import { MarketSubject, defaultDataSubjectMarket } from '../types/MarketSubject';
// import { v4 as uuidv4 } from 'uuid';
// import SocketIOService from '@Services/SocketIOService';
import { v4 as uuidv4 } from 'uuid';
import { MarketFilters } from '../types/MarketFilters';
import { MarketListing } from '../types/MarketListing';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';

export default class MarketBloc extends BaseBloc<MarketSubject> {
  marketRepository: MarketRepository;
  providerProps: OutletContextType;
  constructor(props: OutletContextType) {
    super(defaultDataSubjectMarket);
    this.providerProps = props;
    this.marketRepository = props.repositoryManager.getMarketRepository();
  }

  getMarketData = async (filters?: MarketFilters) => {
    try {
      if (filters) {
        this.setNextSubjectValue({ isLoading: true, activeFilters: filters });
      }

      const marketData = await this.marketRepository.getMarketData(this.getSubjectValue().activeFilters!);

      this.setNextSubjectValue({
        marketData: marketData,
        isLoading: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  triggerPurchaseOnSC = async (listingId: number) => {
    const newUuid = uuidv4();
    try {
      this.setLoading();

      this.providerProps.socketIOService.handleSocketConnection(
        this.providerProps.socketIOService,
        newUuid,
        async (data: any) => {
          this.setLoading(false);
          this.cleanAntToBuy();
          await this.getMarketData();

          this.setNextSubjectValue({
            toastr: this.setToastrObj('success', 'market.buyNftSuccess'),
          });
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      await this.marketRepository.purchaseNFT(listingId, newUuid);
    } catch (error) {
      this.providerProps.socketIOService.closeSocket(this.providerProps.socketIOService, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  triggerUpdatePriceOnSC = async (listingId: number, newPrice: number) => {
    const newUuid = uuidv4();
    try {
      this.setLoading();

      this.providerProps.socketIOService.handleSocketConnection(
        this.providerProps.socketIOService,
        newUuid,
        async (data: any) => {
          this.setLoading(false);
          this.cleanAntToBuy();
          await this.getMarketData();

          this.setNextSubjectValue({
            toastr: this.setToastrObj('success', 'market.editPriceNftSuccess'),
          });
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      await this.marketRepository.updatePriceNFT(listingId, newPrice, newUuid);
    } catch (error) {
      this.providerProps.socketIOService.closeSocket(this.providerProps.socketIOService, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  triggerDelistOnSC = async (listingId: number) => {
    const newUuid = uuidv4();
    try {
      this.setLoading();

      this.providerProps.socketIOService.handleSocketConnection(
        this.providerProps.socketIOService,
        newUuid,
        async (data: any) => {
          this.setLoading(false);
          this.cleanAntToBuy();
          await this.getMarketData();

          this.setNextSubjectValue({
            toastr: this.setToastrObj('success', 'market.nftDelistedSuccessfully'),
          });
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      await this.marketRepository.delistNFT(listingId, newUuid);
    } catch (error) {
      this.providerProps.socketIOService.closeSocket(this.providerProps.socketIOService, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  onClickBuyAntMarketCard = (antToBuy: Ant, listing: MarketListing) => {
    this.setNextSubjectValue({ antToBuy: antToBuy, listingToBuy: listing });
  };

  cleanAntToBuy = () => {
    this.setNextSubjectValue({ antToBuy: undefined, listingToBuy: undefined });
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectMarket.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
    // this.setNextSubjectValue({ ...defaultDataSubjectColony });
  };
  setTab = (tab: string) => {
    this.setNextSubjectValue({ activeTab: tab });
  };
}
