import { TOOL_LIST } from "@ComponentsRoot/constants/iconLists";

export type FarmingTool = {
  _id?: string;
  imguri: string;
  name: string;
  description: string;
  internalValue?: number;
  cost: Array<{
    materialId: number;
    quantity: number;
    priceWithDiscountApplied?: number;
    percentDiscount?: number;
  }>;
  toolId: number;
};

export type BlackSmith = {
  _id?: string; //master key
  description: string;
  name: string;
  type: string;
  imguri: string;
  farmingTools: FarmingTool[];
};

export const farmingToolsEmojisRelation: { [key: number]: string } = {
  1: '🪓',
  2: '⛏️',
  3: '🥄',
  4: '⚗️',
  5: '🚿',
};

export const getToolSrcByToolId = (toolId: number) => {
  return TOOL_LIST.find((tl) => tl.id === toolId);
};
