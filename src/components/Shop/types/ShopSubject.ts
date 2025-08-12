import { toastrObjDefValue } from '@ComponentsRoot/Toastr/ToastrManager';
import { ToastrSubjectType } from '@ComponentsRoot/Toastr/types/ToastrSubjectType';
import { Shop } from './Shop';

export type ShopSubject = {
  isLoading: boolean;
  shopData: Shop | null;
  hasError: null | any;
  toastr: ToastrSubjectType;
};

export const defaultDataSubjectShop: ShopSubject = {
  isLoading: false,
  shopData: null,
  hasError: null,
  toastr: toastrObjDefValue
}
