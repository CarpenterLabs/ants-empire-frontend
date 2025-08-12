import { WelcomePackSubject, defaultDataSubjectWelcomePack } from '../types/WelcomePackSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import WelcomePackRepository from '@Repositories/WelcomePackRepository';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { PackToBuy, PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { v4 as uuidv4 } from 'uuid';
import SocketIOService from '@Services/SocketIOService';

export default class WelcomePackBloc extends BaseBloc<WelcomePackSubject> {
  welcomePackRepository: WelcomePackRepository;
  providerProps: OutletContextType;
  constructor(props: OutletContextType) {
    super(defaultDataSubjectWelcomePack);
    this.providerProps = props;
    this.welcomePackRepository = props.repositoryManager.getWelcomePackRepository();
  }

  getWelcomePackData = async (state?: { [key: string]: boolean } | undefined) => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      const fromInventory = state?.fromInventory ? state.fromInventory : false;
      const fromLogin = state?.fromLogin ? state.fromLogin : false;
      const resultPack = (await this.welcomePackRepository.getPurchasedPacks()).filter((rp) => rp.state === 'inventory');
      this.setNextSubjectValue({
        WelcomePackData: {
          available: await this.welcomePackRepository.getAvailableWelcomePack(),
          purchased: resultPack.length ? resultPack[0] : null,
        },
        isRevealedModalOpen: resultPack.length && !fromInventory ? true : false,
        newPlayerModal: fromLogin,
        isLoading: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  manageBuyWP = async (
    pack: Pick<PackToBuy, 'family' | 'packToBuyId' | 'num_mints'>,
    purchased: PurchasedPack | null,
    price: number,
    socket: SocketIOService
  ) => {
    try {
      if (purchased) {
        this.setNextSubjectValue({ isLoading: false, warningBurningModal: true, selectedPack: pack });
      } else {
        await this.buyWP(pack, price, socket);
      }
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  buyWP = async (pack: Pick<PackToBuy, 'family' | 'packToBuyId' | 'num_mints'>, price: number, socket: SocketIOService) => {
    this.setLoading();
    const newUuid = uuidv4();
    try {
      socket.handleSocketConnection(
        socket,
        newUuid,
        async (data: any) => {
          this.setLoading(false);
          await this.getWelcomePackData();
          this.setNextSubjectValue({ toastr: this.setToastrObj('success', 'pack.succesfull'), warningBurningModal: false });
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      // Notify backend to start process and subscribe to the UUID
      // call new repo method and open metamask
      const responseBuyHash = await this.welcomePackRepository.fireBuyWPackBchain(
        pack,
        this.providerProps.accountData?.owner!,
        '',
        price,
        newUuid
      );
      if (responseBuyHash) {
        console.log(responseBuyHash);
      }
    } catch (error) {
      socket.closeSocket(socket, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  resolveWelcomePack = async (
    pack: Pick<PackToBuy, 'family' | 'packToBuyId'>,
    redirectToInventory: () => void,
    socket: SocketIOService
  ) => {
    const newUuid = uuidv4();

    try {
      this.setNextSubjectValue({ isLoading: true });

      socket.handleSocketConnection(
        socket,
        newUuid,
        async (data: any) => {
          this.setLoading(false);
          redirectToInventory();
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      await this.welcomePackRepository.fireResolvePackBchain(this.providerProps.accountData?.owner!, pack, newUuid);
    } catch (error) {
      socket.closeSocket(socket, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  togglerModal = (idModal: string) => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ [idModal]: !prevState[idModal as keyof WelcomePackSubject] });
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectWelcomePack.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
    // this.setNextSubjectValue({ ...defaultDataSubjectColony });
  };

  getSelectedPackById = (packToBuyId: string) => {
    const subjVal = this.getSubjectValue();
    return subjVal.WelcomePackData.available.find((packToBuy) => packToBuy.packToBuyId === packToBuyId);
  };
}

export function get100(ant_statis: PackToBuy['ant_rarity'] | PackToBuy['ant_type']) {
  const select = ant_statis.find((t: [string, number]) => t[1] === 100);
  return select ? select[0] : false;
}
