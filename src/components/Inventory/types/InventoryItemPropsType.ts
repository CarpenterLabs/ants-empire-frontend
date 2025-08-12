import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import { Inventory } from './Inventory';
import { PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';

export type InventoryItemPropsType = {
  item: (Ant | PurchasedPack | PurchasedMaterialBox) & { selected?: boolean };
  itemType: 'ant' | 'pack' | 'materialBox' | 'empty';
  multiSelectEnabled?: boolean;
  inventoryDataKey?: keyof Inventory;
  onCardClick?: (item: InventoryItemPropsType['item'], inventoryDataKey?: InventoryItemPropsType['inventoryDataKey']) => void;
  handleOpenPack?: (item: InventoryItemPropsType['item']) => void;
  miniCard?: boolean;
  handleClickAntDetailBtn?: (item: Ant) => void;
  // handleOpenPurchasedMaterialBox?: (item: PurchasedMaterialBox) => Promise<void>;
  // materialBoxMainBtni18nTextId?: string;
  materialBoxProperties?: {
    handleOpenPurchasedMaterialBox: (item: PurchasedMaterialBox) => Promise<void>;
    materialBoxMainBtni18nTextId: string;
    canBeOpened: boolean;
    onInventory: boolean;
  };
  antBlockedCountDown?: JSX.Element;  
};
