import { Ant } from "@ComponentsRoot/Ant/types/Ant";
import { PurchasedPack } from "@ComponentsRoot/ControlPanel/components/CPanelStandard/types/Cache";
import { PurchasedMaterialBox } from "@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox";
import { InventoryItemPropsType } from "../types/InventoryItemPropsType";

type InventoryItemsType = Ant | PurchasedPack | PurchasedMaterialBox;
export function isPurchasedPack(item: InventoryItemsType): item is PurchasedPack {
  return item && (item as PurchasedPack).buyedpack !== undefined;
}

export function isAnt(item: InventoryItemsType): item is Ant {
  return item && (item as Ant).power !== undefined && (item as Ant).rarity !== undefined;
}

export function isPurchasedMaterialBox(item: InventoryItemsType): item is PurchasedMaterialBox {
  return item && (item as PurchasedMaterialBox).buyedMaterialBoxId !== undefined;
}

export const getItemTypeByItem = (item: InventoryItemPropsType["item"]) => {
  let itemType: InventoryItemPropsType["itemType"] = "empty";
  if (isAnt(item)) {
    itemType = "ant";
  }
  if (isPurchasedPack(item)) {
    itemType = "pack";
  }

  if (isPurchasedMaterialBox(item)) {
    itemType = "materialBox";
  }

  return itemType;
};
