import { MaterialBoxToBuy } from './MaterialBoxToBuy';

export type EditMaterialBoxToBuyFormValueTypes = MaterialBoxToBuy & {
  isCurrentlyEditingMaterialBox?: boolean;
  createdMBoxTemp_id?: string;
  diff?:Partial<MaterialBoxToBuy>;
} & Record<`material${1 | 2 | 3 | 4 | 5}`, any>;
