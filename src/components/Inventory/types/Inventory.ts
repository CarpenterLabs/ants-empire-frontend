import { Ant } from "@ComponentsRoot/Ant/types/Ant";
import { PurchasedMaterialBox } from "@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox";
import { PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';

export type Inventory = {
  ants: Array<Ant & { selected: boolean }>;
  purchasedPacks: Array<PurchasedPack & { selected: boolean }>;
  purchasedMaterialBoxes: Array<PurchasedMaterialBox & { selected: boolean }>;
};
