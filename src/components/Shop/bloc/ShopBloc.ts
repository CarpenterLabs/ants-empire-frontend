import { ShopSubject, defaultDataSubjectShop } from '../types/ShopSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import ShopRepository from '@Repositories/ShopRepository';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { v4 as uuidv4 } from 'uuid';
import SocketIOService from '@Services/SocketIOService';
import { MaterialBoxToBuy } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';

export default class ShopBloc extends BaseBloc<ShopSubject> {
  shopRepository: ShopRepository;
  providerProps: OutletContextType;
  constructor(props: OutletContextType) {
    super(defaultDataSubjectShop);
    this.providerProps = props;
    this.shopRepository = props.repositoryManager.getShopRepository();
  }

  getShopData = async () => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      this.setNextSubjectValue({
        shopData: await this.shopRepository.getShopContent(),
        isLoading: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  onMaterialBoxAdded = async (logs) => {
    // console.log('Material Box added logs:', logs);
    this.setNextSubjectValue({ toastr: this.setToastrObj('success', 'buyMaterialBox.success') });
    this.setNextSubjectValue({ isLoading: false });
  };

  fireBuyMaterialBox = async (boxId: string, costBox: number, socket: SocketIOService) => {
    this.setLoading();
    const newUuid = uuidv4();
    try {
      socket.handleSocketConnection(
        socket,
        newUuid,
        async (data: any) => {
          await this.onMaterialBoxAdded(data);
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );
      await this.shopRepository.buyMaterialBoxOnSC(boxId, costBox, newUuid);
    } catch (error) {
      console.error('Error during material box purchase:', error);
      socket.closeSocket(socket, newUuid);
      this.setLoading(false);
    }
  };

  purchaseMaterialBox = async (materialBoxToBuyId: string, outletContext: OutletContextType) => {
    try {
      this.setLoading();
      const validatedMaterialBox: MaterialBoxToBuy = await this.shopRepository.purchaseMaterialBoxToBuy(materialBoxToBuyId);
      if (validatedMaterialBox) {
        await this.fireBuyMaterialBox(validatedMaterialBox.mBoxToBuyId, validatedMaterialBox.price, outletContext.socketIOService);
      } else {
        this.setNextSubjectValue({ toastr: this.setToastrObj('error', 'buyMaterialBox.error') });
      }
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectShop.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
    // this.setNextSubjectValue({ ...defaultDataSubjectColony });
  };
}
