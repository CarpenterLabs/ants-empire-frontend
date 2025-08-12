import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import ColonyBloc from '@ComponentsRoot/ColonyNewStyle/bloc/ColonyBloc';
import SellerBloc from '../bloc/SellerBloc';
import { SellerSubject } from './SellerSubject';

export type Seller = {
  _id: string;
  published: boolean;
  callNectarCost: number;
  event_requirements: string;
  requirements: {
    levelOfRoom: number;
    roomId: number;
  };
  name: string;
  description: string;
  imguri: string;
  cicle_days: number;
  active_time: number;
  materials: {
    idMaterial: number[];
    discount: number;
  };
  available: {
    freeCall: boolean;
    paidCall: boolean;
    active: boolean;
    requirements: boolean;
  };
  pool_materials: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  last_called_date: string;
  last_purchased_nectar_date: string;
};

export type eventSellerUpdate = {
  _id: string;
  colonyId: string;
  seller_last_called_date: boolean;
  seller_last_called_nectar_date: boolean;
};

export type CountdownSellerProps = {
  endTimeISO: string;
  active_time: number;
  onExpire: ColonyBloc['refreshColonyData'];
};

export type SellerModalViewProps = {
  colony: Colony;
  sellerData: Seller;
  subjectValue: SellerSubject;
  bloc: SellerBloc;
};
