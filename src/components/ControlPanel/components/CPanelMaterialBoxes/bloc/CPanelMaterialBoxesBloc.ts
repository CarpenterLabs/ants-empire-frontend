import {
  CPanelMaterialBoxesBlocProps,
  defaultCPanelMBoxesSubjData,
  getNewMaterialBoxToBuyTemplate,
} from '../types/CPanelMaterialBoxesSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import _ from 'lodash';
import { CPanelMaterialBoxesSubject } from '../types/CPanelMaterialBoxesSubject';
import { MaterialBoxToBuy } from '@ComponentsRoot/MaterialBox/types/MaterialBoxToBuy';
import { differenceObj } from '@ComponentsRoot/core/CryptoAntsUtils';
import { EditMaterialBoxToBuyFormValueTypes } from '@ComponentsRoot/MaterialBox/types/EditMaterialBoxToBuyFormValueTypes';

export default class CPanelMaterialBoxesBloc extends BaseBloc<CPanelMaterialBoxesSubject> {
  providerProps: CPanelMaterialBoxesBlocProps;
  constructor(props: CPanelMaterialBoxesBlocProps) {
    super(defaultCPanelMBoxesSubjData);
    this.providerProps = props;
  }

  saveAllMaterialBoxesConfig = async (newDataMaterialBoxes: CPanelMaterialBoxesSubject['materialBoxes']) => {
    try {
      const operationMaterialBoxes = this.createMongoOperation(newDataMaterialBoxes!);
      await this.providerProps.cpanelBloc.saveMaterialBoxesToBuy(operationMaterialBoxes);

      this.resetBloc();
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  private createMongoOperation = (currentMaterialBoxes: MaterialBoxToBuy[]) => {
    const initialMaterialBoxes = this.getSubjectValue().initialData;
    const operations: Partial<MaterialBoxToBuy>[] = [];
    const editedMBoxes = currentMaterialBoxes.filter((mBox) => mBox.action);
    editedMBoxes.forEach((newMaterialBox) => {
      const oldMBox = initialMaterialBoxes!.find((original: MaterialBoxToBuy) => newMaterialBox._id === String(original._id));
      if (oldMBox) {
        if (newMaterialBox.action === 'update') {
          delete (newMaterialBox as EditMaterialBoxToBuyFormValueTypes).isCurrentlyEditingMaterialBox;
          const diff: Partial<MaterialBoxToBuy> = differenceObj(newMaterialBox, oldMBox);

          // Map materials into array of materials and delete root properties before send
          diff.materials = [];
          for (let a = 0; a <= 4; a++) {
            if (diff.hasOwnProperty(`material${a + 1}`)) {
              // set it to the main materials array
              diff.materials[a] = [a + 1, diff[`material${a + 1}`]];
              delete diff[`material${a + 1}`];
            } else {
              diff.materials[a] = newMaterialBox.materials[a];
            }
          }

          // diff.materials = [...newMaterialBox.materials, ...diff.materials];

          operations.push({
            _id: newMaterialBox._id,
            ...diff,
          });
        } else if (newMaterialBox.action === 'remove') {
          operations.push({
            _id: newMaterialBox._id,
            action: newMaterialBox.action,
          });
        }
      } else if (newMaterialBox.isTemporary) {
        delete newMaterialBox.createdMBox_id;
        delete newMaterialBox.isTemporary;
        delete (newMaterialBox as EditMaterialBoxToBuyFormValueTypes).isCurrentlyEditingMaterialBox;

        // Map materials into array of materials and delete root properties before send
        for (let a = 0; a <= 4; a++) {
          if (newMaterialBox.hasOwnProperty(`material${a + 1}`)) {
            // set it to the main materials array
            newMaterialBox.materials[a] = [a + 1, newMaterialBox[`material${a + 1}`]];
            delete newMaterialBox[`material${a + 1}`];
          }
        }

        operations.push(newMaterialBox);
      }
    });
    return operations;
  };

  setEditableMaterialBoxCard = (mBoxSelected: EditMaterialBoxToBuyFormValueTypes, wantToEditMode: boolean) => {
    const materialBoxes = this.getSubjectValue().materialBoxes;
    let data = _.cloneDeep(materialBoxes) as EditMaterialBoxToBuyFormValueTypes[];
    data = data!.map((mBox: EditMaterialBoxToBuyFormValueTypes) => {
      delete mBox.isCurrentlyEditingMaterialBox;
      return mBox;
    });
    let indexSelectedMBoxToBuy;
    if (!mBoxSelected._id) {
      indexSelectedMBoxToBuy = data!.findIndex((mBox) => mBox.createdMBox_id === mBoxSelected.createdMBox_id);
    } else {
      indexSelectedMBoxToBuy = data!.findIndex((mBox) => mBox._id === mBoxSelected._id);
    }
    data![indexSelectedMBoxToBuy].isCurrentlyEditingMaterialBox = wantToEditMode;
    this.setNextSubjectValue({ materialBoxes: data });
  };

  handleChangeMaterialBox = (
    value: string | number | boolean,
    key: keyof EditMaterialBoxToBuyFormValueTypes,
    selectedMaterialBox: EditMaterialBoxToBuyFormValueTypes
  ) => {
    const prevState = this.getSubjectValue();

    // mBoxToBuyId to uppercase, weight to number
    if (key === 'mBoxToBuyId') value = String(value).toUpperCase();
    if (key === 'price') value = Number(value);
    if (key.includes('material')) value = Number(value);

    const mBoxesTempTabData = prevState.materialBoxes;
    const data = _.cloneDeep(mBoxesTempTabData);
    const updatedMBoxToBuy = { ...selectedMaterialBox, [key]: value };

    const indexMBoxToBuy = selectedMaterialBox._id
      ? data!.findIndex((mBox) => mBox._id === selectedMaterialBox._id)
      : data!.findIndex((mBox) => mBox.createdMBox_id === selectedMaterialBox.createdMBox_id);

    updatedMBoxToBuy.action = selectedMaterialBox._id ? 'update' : 'create';
    data![indexMBoxToBuy] = updatedMBoxToBuy;

    this.setNextSubjectValue({ materialBoxes: data });
    this.updateDataMaterialBoxes(data as MaterialBoxToBuy[]);
  };

  checkDifference = (mBoxSelected: MaterialBoxToBuy) => {
    const initialData = _.cloneDeep(this.getSubjectValue().initialData);
    let diff: { [key: string]: any } = {};
    if (mBoxSelected._id) {
      const indexSelectedPack = initialData!.findIndex((mbx) => mbx._id === mBoxSelected._id);
      diff = _.cloneDeep(differenceObj(mBoxSelected, initialData![indexSelectedPack]));
    } else {
      diff = _.cloneDeep(mBoxSelected);
    }
    if (diff.hasOwnProperty('isCurrentlyEditingMaterialBox')) delete diff['isCurrentlyEditingMaterialBox'];
    return Object.keys(diff).length ? diff : {};
  };

  resetViewElementsToOriginalState = (initialData: MaterialBoxToBuy[]) => {
    this.setNextSubjectValue({ saveBtnDisabled: true, initialData: initialData, materialBoxes: initialData, wantReset: true });
    this.updateDataMaterialBoxes(initialData);
  };

  setWantResetToFalse = () => {
    this.setNextSubjectValue({ wantReset: false });
  };

  private checkMaterialBoxesConditions = (newState: MaterialBoxToBuy[]) => {
    const result = !newState.some((mBoxToBuy) => {
      return mBoxToBuy.mBoxToBuyId && this.isDuplicateValueOnMaterialBoxes('mBoxToBuyId', mBoxToBuy.mBoxToBuyId);
    });
    return result;
  };

  private isDuplicateValueOnMaterialBoxes = (nameField: keyof MaterialBoxToBuy, value: string | number | boolean) => {
    const materialBoxesTempTabData = this.getSubjectValue().materialBoxes;
    return materialBoxesTempTabData!.filter((mBoxToBuy) => mBoxToBuy[nameField] === value).length > 1;
  };

  private updateDataMaterialBoxes = (newValue: MaterialBoxToBuy[]) => {
    const initialData = this.getSubjectValue().initialData;
    const iniData = _.cloneDeep(initialData);
    let newState = _.cloneDeep(newValue);
    //remove property edited & action before compare with initialData
    newState = newState.map((mBox) => {
      delete (mBox as EditMaterialBoxToBuyFormValueTypes).isCurrentlyEditingMaterialBox;
      mBox.action !== 'remove' && delete mBox.action;
      return mBox;
    });
    const diff: Partial<MaterialBoxToBuy> = differenceObj(newState, iniData);
    if (diff && Object.keys(diff).length && this.checkMaterialBoxesConditions(newState)) {
      this.providerProps.cpanelBloc.changeTab('MaterialBoxes', false);
      this.setNextSubjectValue({ saveBtnDisabled: false });
    } else {
      this.providerProps.cpanelBloc.changeTab('MaterialBoxes', true);
      this.setNextSubjectValue({ saveBtnDisabled: true });
    }
  };

  setMaterialBoxesTempData = (initialData: MaterialBoxToBuy[]) => {
    this.setNextSubjectValue({ materialBoxes: initialData, initialData: initialData });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultCPanelMBoxesSubjData.toastr });
  };

  addNewMaterialBox = (mBoxSelectedToClone?: MaterialBoxToBuy) => {
    const mBoxes = this.getSubjectValue().materialBoxes;
    const data = _.cloneDeep(mBoxes);

    const createdMBoxes = mBoxes!.filter((mBox) => mBox.isTemporary && mBox.createdMBox_id);

    let newMBox;
    if (mBoxSelectedToClone) {
      const clonedMbox = _.cloneDeep(mBoxSelectedToClone);
      delete clonedMbox._id;
      //  delete clonedMbox.edited
      clonedMbox.action = 'create';
      clonedMbox.isTemporary = true;
      clonedMbox.mBoxToBuyId = `newMBox_${createdMBoxes.length + 1}`;
      clonedMbox.createdMBox_id = `newMBox_${createdMBoxes.length + 1}`;
      clonedMbox.published = false;
      newMBox = clonedMbox;
    } else {
      newMBox = getNewMaterialBoxToBuyTemplate(createdMBoxes.length + 1);
    }

    data!.unshift(newMBox as MaterialBoxToBuy);
    this.setNextSubjectValue({ materialBoxes: data });
    this.updateDataMaterialBoxes(data as MaterialBoxToBuy[]);
  };

  handleRemoveMBoxToBuy = (mBoxToRemove: MaterialBoxToBuy, action: 'remove' | 'undo') => {
    const packsTempTabData = this.getSubjectValue().materialBoxes;
    const data = _.cloneDeep(packsTempTabData);
    let indexMBox;
    if (!mBoxToRemove._id) {
      //This MBox NOT exist in mongo, remove in view
      indexMBox = data!.findIndex((mBox) => mBox.createdMBox_id === mBoxToRemove.createdMBox_id);
      data!.splice(indexMBox, 1);
    } else {
      //This Mbox exist in mongo
      indexMBox = data!.findIndex((mBox) => mBox._id === mBoxToRemove._id);

      if (action === 'remove') {
        data![indexMBox].action = 'remove';
      } else if (action === 'undo') {
        delete data![indexMBox].action;
      }
    }
    this.setNextSubjectValue({ materialBoxes: data });
    this.updateDataMaterialBoxes(data as MaterialBoxToBuy[]);
  };
}
