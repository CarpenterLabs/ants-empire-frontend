import { InventoryItemPropsType } from '@ComponentsRoot/Inventory/types/InventoryItemPropsType';
import ColonyItemAssignerBloc from '../bloc/ColonyItemAssignerBloc';

export type ColonyItemAssignerViewPropsType = {
  cancelHandler: () => void;
  bloc: ColonyItemAssignerBloc;
  data: ColonyItemAssignerBloc['data'];
  itemsToAssign: InventoryItemPropsType['item'][];
  autoAssignWhenOpen: boolean;
};
