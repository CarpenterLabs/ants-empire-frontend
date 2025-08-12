import {
  BodySwapEventSeller,
  SellerBlocProps,
  SellerSubject,
  defaultDataSubjectSeller,
  swapMaterials,
} from '../types/SellerSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import SellerRepository from '@Repositories/SellerRepository';
import { Seller } from '../types/Seller';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { Material } from '@ComponentsRoot/Colony/types/Material';
import { BaseRoomType, WareHouse } from '@ComponentsRoot/Colony/types/RoomType';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { v4 as uuidv4 } from 'uuid';

export default class SellerBloc extends BaseBloc<SellerSubject> {
  providerProps: SellerBlocProps;
  sellerRepository: SellerRepository;

  constructor(props: SellerBlocProps) {
    super(defaultDataSubjectSeller);
    this.providerProps = props;
    this.sellerRepository = this.providerProps.repositoryManager.getSellerRepository();
  }

  emptyTempSwapMaterials = () => defaultDataSubjectSeller.tempSwapMaterials;

  resetSwap = (type: 'seller' | 'user') => {
    const prevTempMaterials = this.getSubjectValue().tempSwapMaterials;
    this.setNextSubjectValue({
      tempSwapMaterials: {
        ...prevTempMaterials,
        [type]: this.emptyTempSwapMaterials()[type],
        capacityWarehouse: this.emptyTempSwapMaterials().capacityWarehouse,
      },
    });
  };

  swapMaterials = async (colony: Colony, tempSwapMaterials: SellerSubject['tempSwapMaterials']) => {
    try {
      const swapObj: BodySwapEventSeller = {
        _id: colony.seller._id,
        colonyId: colony._id,
        swap: {
          user: [],
          seller: [],
        },
      };

      Object.keys(tempSwapMaterials.user).forEach((materialId) => {
        if (materialId !== 'total') {
          const quantity = tempSwapMaterials.user[materialId as keyof swapMaterials];
          if (quantity > 0) {
            swapObj.swap.user.push({ materialId: Number(materialId), quantity });
          }
        }
      });
      Object.keys(tempSwapMaterials.seller).forEach((materialId) => {
        if (materialId !== 'total') {
          const quantity = tempSwapMaterials.seller[materialId as keyof swapMaterials];
          if (quantity > 0) {
            swapObj.swap.seller.push({ materialId: Number(materialId), quantity });
          }
        }
      });

      this.setLoading(true);
      const response = await this.sellerRepository.sellerSwap(swapObj); // refresh colony
      if (!response.errors) {
        await this.providerProps.colonyBloc.refreshColonyData();
        this.setNextSubjectValue({
          toastr: this.setToastrObj('success', 'seller.swapSuccessfully'),
          swapModal: false,
          tempSwapMaterials: this.emptyTempSwapMaterials(),
          isLoading: false,
        });
      } else {
        this.setNextSubjectValue({
          toastr: this.setToastrObj('success', 'seller.swapError'),
          isLoading: false,
        });
      }
    } catch (error) {
      this.setNextSubjectValue({
        toastr: this.setToastrObj('error', 'seller.seller.swapError'),
        isLoading: false,
      });
    }
  };

  checkSum = (tempSwapMaterials: SellerSubject['tempSwapMaterials'], userSwap: 'user' | 'seller') => {
    if (tempSwapMaterials.user.total === 0 || tempSwapMaterials.seller.total === 0) return false;
    if (userSwap === 'user') {
      if (tempSwapMaterials.user.total > tempSwapMaterials.seller.total) return 'warning';
      if (tempSwapMaterials.user.total === tempSwapMaterials.seller.total) return true;
      return false;
    } else if (userSwap === 'seller') {
      if (tempSwapMaterials.user.total >= tempSwapMaterials.seller.total) return true;
      return false;
    }
  };

  checkBtnSwapDisabled = (tempSwapMaterials: SellerSubject['tempSwapMaterials']) => {
    const { user, seller } = tempSwapMaterials;
    if (user.total === 0 || seller.total === 0 || !tempSwapMaterials.capacityWarehouse.enoughtCapacity) return true;
    return seller.total > user.total;
  };

  private calculateSumMaterials = (
    tempSwapMaterials: SellerSubject['tempSwapMaterials'],
    materials: Material[],
    userSwap: 'user' | 'seller',
    discount?: number
  ) => {
    let total = 0;
    materials.forEach((material) => {
      total += material.internalValue * tempSwapMaterials[userSwap][material.materialId as keyof swapMaterials];
    });
    if (userSwap === 'seller' && discount) {
      total = total - (total * discount) / 100;
    }
    return total;
  };

  calculateTotalMaterials = (colonyMaterials: Material[]) => {
    let total = 0;
    colonyMaterials.forEach((material) => {
      total += Number(material.value);
    });
    return total;
  };

  changeSwapMaterials = (
    materialId: number,
    newValue: number,
    maxValue: number,
    materials: Material[],
    userSwap: 'user' | 'seller',
    discount?: number
  ) => {
    const prevTempMaterials = this.getSubjectValue().tempSwapMaterials;
    const swapType = { ...prevTempMaterials[userSwap], [materialId]: newValue < maxValue ? newValue : maxValue };
    const tempSwapMaterials = { ...prevTempMaterials, [userSwap]: swapType };
    tempSwapMaterials[userSwap].total = this.calculateSumMaterials(tempSwapMaterials, materials, userSwap, discount);
    tempSwapMaterials.capacityWarehouse = this.warehouseSpaceEnough(tempSwapMaterials);
    this.setNextSubjectValue({ tempSwapMaterials: tempSwapMaterials });
  };

  warehouseSpaceEnough = (tempSwapMaterials: { user: swapMaterials; seller: swapMaterials }) => {
    const colony = this.providerProps.colony;
    const wareHouse = colony.rooms.find((room: BaseRoomType) => room.roomId === 5) as WareHouse;

    const userSum = Object.keys(tempSwapMaterials.user)
      .filter((key) => key !== 'total')
      .reduce((acc, key) => acc + tempSwapMaterials.user[key], 0);
    const sellerSum = Object.keys(tempSwapMaterials.seller)
      .filter((key) => key !== 'total')
      .reduce((acc, key) => acc + tempSwapMaterials.seller[key], 0);
    return {
      swapCount: Number(wareHouse.currentMaterialTotalCount) + Number(sellerSum) - Number(userSum),
      wareHouseCapacity: Number(wareHouse.currentCapacityByLevel),
      enoughtCapacity:
        Number(wareHouse.currentMaterialTotalCount) + Number(sellerSum) - Number(userSum) <=
        Number(wareHouse.currentCapacityByLevel),
    };
  };

  firePremiumSeller = async (colonyId: string, sellerId: string, costPremiumSeller: number, socketSellerUuid: string) => {
    this.setLoading();
    return await this.sellerRepository.genPendingPremiumSellerCall(
      colonyId,
      sellerId,
      String(costPremiumSeller),
      socketSellerUuid
    );
  };

  callSeller = async (sellerData: Seller, colonyId: string, outletContext: OutletContextType) => {
    const eventSellerUpdateObj = {
      _id: sellerData._id,
      colonyId: colonyId,
      seller_last_called_date: sellerData.available.freeCall,
      seller_last_called_nectar_date: sellerData.available.paidCall,
    };

    this.setLoading(true);
    try {
      if (!eventSellerUpdateObj.seller_last_called_date && eventSellerUpdateObj.seller_last_called_nectar_date) {
        // PremiumSeller on SC Usecase
        return await this.callPremiumSeller(sellerData, colonyId, outletContext);
      } else {
        // Free seller
        const response = await this.sellerRepository.sellerUpdate(eventSellerUpdateObj);
        if (response.seller_last_called_date || response.seller_last_called_nectar_date) {
          this.refreshAndShowSeller();
        } else {
          this.setNextSubjectValue({
            toastr: this.setToastrObj('error', 'seller.callError'),
            isLoading: false,
          });
        }
      }
    } catch (error) {
      this.setNextSubjectValue({
        toastr: this.setToastrObj('error', 'seller.callError'),
        isLoading: false,
      });
    }
  };

  callPremiumSeller = async (sellerData: Seller, colonyId: string, outletContext: OutletContextType) => {
    this.setLoading(true);
    const socketSellerUuid = uuidv4();
    const eventSellerUpdateObj = {
      _id: sellerData._id,
      colonyId: colonyId,
      seller_last_called_date: sellerData.available.freeCall,
      seller_last_called_nectar_date: sellerData.available.paidCall,
    };

    try {
      const response = await this.sellerRepository.sellerUpdate(eventSellerUpdateObj);
      if (response.seller_last_called_date || response.seller_last_called_nectar_date) {
        if (response.seller_last_called_nectar_date) {
          // Open socket
          const socket = outletContext.socketIOService;

          // Notify backend to start process and subscribe to the UUID
          // Listen for the specific UUID response
          socket.handleSocketConnection(
            socket,
            socketSellerUuid,
            async (data: any) => {
              await this.refreshAndShowSeller();
            },
            (error) => {
              this.setErrorOnBloc(error);
            }
          );

          // Open metamask to pay tx
          await this.firePremiumSeller(colonyId, sellerData._id, sellerData.callNectarCost, socketSellerUuid);
        }
      }
    } catch (err) {
      outletContext.socketIOService.closeSocket(outletContext.socketIOService, socketSellerUuid);
      this.setNextSubjectValue({
        toastr: this.setToastrObj('error', 'seller.callError'),
        isLoading: false,
      });
    }
  };

  refreshAndShowSeller = async () => {
    await this.providerProps.colonyBloc.refreshColonyData();
    await this.providerProps.colonyBloc.closeSellerDialog();
    this.setNextSubjectValue({
      toastr: this.setToastrObj('success', 'seller.callSuccessfully'),
      isLoading: false,
      swapModal: true,
    });
  };

  toggleSwapModal() {
    const current = this.getSubjectValue().swapModal;
    this.setNextSubjectValue({
      swapModal: !current,
      ...(current ? { tempSwapMaterials: this.emptyTempSwapMaterials() } : {}),
    });
  }

  closeSwapModal = () => {
    this.setNextSubjectValue({
      swapModal: false,
      tempSwapMaterials: this.emptyTempSwapMaterials(),
    });
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectSeller.toastr });
  };

  resetBloc = () => {
    // this.setNextSubjectValue({ ...defaultDataSubjectSeller });
    this.setNextSubjectValue({ hasError: null, isLoading: false });
  };
}
