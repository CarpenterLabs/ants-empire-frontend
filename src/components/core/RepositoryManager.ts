import NodeApiDS from '@DataSource/NodeApiDS';
import MintRepository from '@Repositories/MintRepository';
import AntRepository from '@Repositories/AntRepository';
import AntListRepository from '@Repositories/AntListRepository';
import AuthRepository from '@Repositories/AuthRepository';
import AccountRepository from '@Repositories/AccountRepository';
import ControlPanelRepository from '@Repositories/ControlPanelRepository';
import WelcomePackRepository from '@Repositories/WelcomePackRepository';
import ColonyRepository from '@Repositories/ColonyRepository';
import ShopRepository from '@Repositories/ShopRepository';
import SellerRepository from '@Repositories/SellerRepository';
import FarmingQuestRepository from '@Repositories/FarmingQuestRepository';
import FaucetRepository from '@Repositories/FaucetRepository';
import MarketRepository from '@Repositories/MarketRepository';

export default class RepositoryManager {
  mintRepository: MintRepository;
  antRepository: AntRepository;
  antListRepository: AntListRepository;
  authRepository: AuthRepository;
  accountRepository: AccountRepository;
  controlPanelRepository: ControlPanelRepository;
  welcomePackRepository: WelcomePackRepository;
  colonyRepository: ColonyRepository;
  shopRepository: ShopRepository;
  sellerRepository: SellerRepository;
  farmingQuestRepository: FarmingQuestRepository;
  faucetRepository: FaucetRepository;
  marketRepository: MarketRepository;

  constructor(nodeApiDS: NodeApiDS) {
    this.mintRepository = new MintRepository(nodeApiDS);
    this.antRepository = new AntRepository(nodeApiDS);
    this.antListRepository = new AntListRepository(nodeApiDS);
    this.authRepository = new AuthRepository(nodeApiDS);
    this.accountRepository = new AccountRepository(nodeApiDS, this.authRepository);
    this.controlPanelRepository = new ControlPanelRepository(nodeApiDS);
    this.welcomePackRepository = new WelcomePackRepository(nodeApiDS);
    this.colonyRepository = new ColonyRepository(nodeApiDS);
    this.shopRepository = new ShopRepository(nodeApiDS);
    this.sellerRepository = new SellerRepository(nodeApiDS);
    this.farmingQuestRepository = new FarmingQuestRepository(nodeApiDS);
    this.faucetRepository = new FaucetRepository(nodeApiDS);
    this.marketRepository = new MarketRepository(nodeApiDS);
  }

  getAccountRepository = () => {
    return this.accountRepository;
  };

  getMintRepository = () => {
    return this.mintRepository;
  };

  getAntRepository = () => {
    return this.antRepository;
  };

  getAntListRepository = () => {
    return this.antListRepository;
  };

  getAuthRepository = () => {
    return this.authRepository;
  };

  getControlPanelRepository = () => {
    return this.controlPanelRepository;
  };

  getWelcomePackRepository = () => {
    return this.welcomePackRepository;
  };

  getColonyRepository = () => {
    return this.colonyRepository;
  };

  getShopRepository = () => {
    return this.shopRepository;
  };

  getSellerRepository = () => {
    return this.sellerRepository;
  };

  getFarmingQuestRepository = () => {
    return this.farmingQuestRepository;
  };

  getFaucetRepository = () => {
    return this.faucetRepository;
  };

  getMarketRepository = () => {
    return this.marketRepository;
  };
}
