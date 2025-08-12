import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import SellerBloc from '../bloc/SellerBloc';
import { Seller } from './Seller';
import RepositoryManager from '@ComponentsRoot/core/RepositoryManager';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import ColonyBloc from '@ComponentsRoot/ColonyNewStyle/bloc/ColonyBloc';

export type swapMaterials = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  total: number;
};

type materialForSwap = {
  materialId: number;
  quantity: number;
};

export type BodySwapEventSeller = {
  _id: string;
  colonyId: string;
  swap: {
    user: materialForSwap[];
    seller: materialForSwap[];
  };
};

export type SellerBlocProps = {
  colonyBloc: ColonyBloc;
  data: Seller;
  sellerDialog: boolean;
  swapModal: boolean;
  repositoryManager: RepositoryManager;
  colony: Colony;
};

export type SellerSubject = {
  isLoading: boolean;
  sellerData: Seller | null;
  hasError: null | any;
  toastr: ToastrSubjectType;
  swapModal: boolean;
  btnSwapDisabled: boolean;
  tempSwapMaterials: {
    user: swapMaterials;
    seller: swapMaterials;
    capacityWarehouse: { swapCount: number | null; wareHouseCapacity: number; enoughtCapacity: boolean| null };
  };
};

export const defaultDataSubjectSeller = {
  isLoading: false,
  sellerData: null,
  hasError: null,
  toastr: toastrObjDefValue,
  sellerDialog: false,
  swapModal: false,
  btnSwapDisabled: true,
  tempSwapMaterials: {
    user: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      total: 0,
    },
    seller: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      total: 0,
    },
    capacityWarehouse: { swapCount: null, wareHouseCapacity: 0, enoughtCapacity: null },
  },
};

export type SellerViewProps = {
  bloc: SellerBloc;
  subjectValue: SellerSubject;
  sellerData: Seller;
  sellerDialog: boolean;
  swapModal: boolean;
  colony: Colony;
};