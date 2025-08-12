import { CPanelPacksBlocProps, CPanelPacksSubject, defaultCPanelPacksSubjData, allPacksResponseType } from '@ControlPanelComponents/CPanelPacks/types/CPanelPacksSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import _ from 'lodash';
import { antGuaranteed, antProbs, antProbsStatus, PackToBuy, ValidationErrorsPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { differenceObj } from '@ComponentsRoot/core/CryptoAntsUtils';

export default class CPanelPacksBloc extends BaseBloc<CPanelPacksSubject> {
  providerProps: CPanelPacksBlocProps;
  constructor(props: CPanelPacksBlocProps) {
    super(defaultCPanelPacksSubjData);
    this.providerProps = props;
  };

  setPackTempData = (initialData: allPacksResponseType) => {
    this.setNextSubjectValue({ packsTempTabData: initialData, initialData: initialData });
  }

  ToggleBtnFamily = (newStateBtn: boolean) => {
    this.setNextSubjectValue({ newFamilyBtnDisabled: newStateBtn, newFamilyValue: "" });
  }

  handleNewFamilyInput = (value: string) => {
    this.setNextSubjectValue({ newFamilyValue: value });
  }

  saveNewFamily = (newFamily: string) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    data!.families.unshift(newFamily);
    this.setNextSubjectValue({ packsTempTabData: data, newFamilyValue: "", newFamilyBtnDisabled: true });
  }

  setEditableAntProb = (editedPack: PackToBuy, type: string, key: number, antType: "default" | "guaranteed", keyGuaranteed?: number) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    data!.packs = data!.packs.map(({ edited, ...pack }) => pack);
    const indexPacks = data!.packs.findIndex(pack => pack._id === editedPack._id);
    const edited = {
      status: true,
      type,
      key,
      antType,
      keyGuaranteed,
    }
    data!.packs[indexPacks].edited = edited
    this.setNextSubjectValue({ packsTempTabData: data });
  }

  private findIndexPack = (editedPack: PackToBuy) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    let indexPacks;
    if (!editedPack._id && editedPack.isTemporaryPack) {
      indexPacks = data!.packs.findIndex(pack => pack.isTemporaryPack === editedPack.isTemporaryPack);
    } else {
      indexPacks = data!.packs.findIndex(pack => pack._id === editedPack._id);
    }
    return indexPacks;
  }

  checkDifference = (packSelected: PackToBuy) => {
    const initialData = this.getSubjectValue().initialData;
    let diff = {}
    if (packSelected._id) {
      const indexSelectedPack = initialData!.packs.findIndex(pack => pack._id === packSelected._id);
      diff = differenceObj(packSelected, initialData!.packs[indexSelectedPack])
    } else {
      diff = packSelected;
    }
    return Object.keys(diff).length === 0 ? diff : this.validationDifference(packSelected, diff);
  }

  private checkAntProbs = (guaranteed: PackToBuy["ant_guaranteed"]) => {
    const guaranteedProbsChecked: antProbsStatus[] = [];
    guaranteed && guaranteed.forEach((guaranteedItem) => {
      const result: antProbsStatus = {}
      const totalProbsRarity = guaranteedItem.ant_rarity.reduce((sumTotal, [_, num]) => sumTotal + num, 0);
      const totalProbsType = guaranteedItem.ant_type.reduce((sumTotal, [_, num]) => sumTotal + num, 0);
      result.status = "ok";
      if (totalProbsRarity > 100) {
        result.status = "error";
        result.ant_rarity = "error";
      }
      if (totalProbsType > 100) {
        result.status = "error";
        result.ant_type = "error";
      }
      if (Object.keys(result).length) {
        guaranteedProbsChecked.push(result);
      }
    });
    return guaranteedProbsChecked.length ? guaranteedProbsChecked : false;
  }

  private validationDifference = (packSelected: PackToBuy, diff: Partial<PackToBuy>) => {
    // Extra validations
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    let errors: ValidationErrorsPack = diff.errors ? diff.errors : {};
    if (diff.packToBuyId) {
      //check duplicates
      if (packsTempTabData!.packs.filter((pack) => pack.packToBuyId === diff.packToBuyId).length > 1) {
        errors = {
          ...errors,
          packToBuyId: "packToBuyId duplicate"
        };
      }
    }
    if (diff.weight) {
      //check duplicates
      if (packsTempTabData!.packs.filter(pack => pack.family === packSelected.family && pack.weight === diff.weight).length > 1)
        errors = {
          ...errors,
          weight: "weight duplicate"
        }
    }
    if (diff.ant_guaranteed) {
      const errorProbs = this.checkAntProbs(packSelected.ant_guaranteed);
      if (errorProbs) {
        errors = {
          ...errors,
          ant_guaranteed: errorProbs
        }
      }
    }
    if (diff.ant_rarity) {
      if (packSelected.ant_rarity.reduce((sumTotal, [_, num]) => sumTotal + num, 0) > 100) {
        errors = {
          ...errors,
          ant_rarity: "More than 100%"
        }
      }
    }
    if (diff.ant_type) {
      if (packSelected.ant_type.reduce((sumTotal, [_, num]) => sumTotal + num, 0) > 100) {
        errors = {
          ...errors,
          ant_type: "More than 100%"
        }
      }
    }
    if (Object.keys(errors).length) {
      return { ...diff, errors }
    } else {
      return diff;
    }
  }

  handleRemoveGuaranteed = (editedPack: PackToBuy, keyGuaranteed: number | "all") => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    const indexPack = this.findIndexPack(editedPack);
    if (keyGuaranteed === "all") {
      delete data!.packs[indexPack].ant_guaranteed;
    } else {
      data!.packs[indexPack].ant_guaranteed!.splice(keyGuaranteed, 1);
    }
    data!.packs[indexPack].action = "update";
    this.setNextSubjectValue({ packsTempTabData: data });
    this.updateDataPacks(data as allPacksResponseType);
  }

  handleChangeAntProb = (editedPack: PackToBuy, value: [string, number], type: string, key: number, antType: "default" | "guaranteed", keyGuaranteed?: number) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    const indexPack = this.findIndexPack(editedPack);
    data!.packs[indexPack].action = "update";
    if (antType === "default") {
      data!.packs[indexPack][`ant_${type}` as keyof PackToBuy][key] = value
    } else if (antType === "guaranteed" && keyGuaranteed !== undefined) {
      data!.packs[indexPack].ant_guaranteed![keyGuaranteed][`ant_${type}` as keyof antProbs][key] = value;
    }
    this.setNextSubjectValue({ packsTempTabData: data });
    this.updateDataPacks(data as allPacksResponseType);
  }

  setEditableDiscount = (index: number) => {
    this.setNextSubjectValue({ discountEditable: index });
  }

  handleChangeValueDiscount = (value: number, index: number) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    data!.discount_wpack[index] = value;
    this.setNextSubjectValue({ discountEditable: index, packsTempTabData: data });
    this.updateDataPacks(data as allPacksResponseType);
  }

  handleChangeDiscount = (mode: "add" | "remove") => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    if (mode === "add") {
      data?.discount_wpack.push(0)
    } else if (mode === "remove" && data!.discount_wpack.length > 0) {
      data?.discount_wpack.pop()
    }
    this.setNextSubjectValue({ discountEditable: null, packsTempTabData: data });
    this.updateDataPacks(data as allPacksResponseType);
  }

  setEditable = (packSelected: PackToBuy, name: string) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    data!.packs = data!.packs.map(({ edited, ...pack }) => pack);
    let indexPacks;
    if (!packSelected._id) {
      //This pack NOT exist in mongo
      indexPacks = data!.packs.findIndex(pack => pack.createdPack_id === packSelected.createdPack_id);
    } else {
      indexPacks = data!.packs.findIndex(pack => pack._id === packSelected._id);
    }
    data!.packs[indexPacks].edited = name
    this.setNextSubjectValue({ packsTempTabData: data });
  }

  private moreThan100 = (pack: PackToBuy) => {
    const totalRarityProbs = pack.ant_rarity.reduce((sum, [_rarity, num]) => sum + num, 0);
    const totalTypeProbs = pack.ant_type.reduce((sum, [_type, num]) => sum + num, 0);
    if (totalRarityProbs > 100 || totalTypeProbs > 100) {
      return true;
    }
    if (pack.ant_guaranteed && Array.isArray(pack.ant_guaranteed)) {
      for (const guaranteed of pack.ant_guaranteed) {
        const guaranteedRarityProbs = guaranteed.ant_rarity.reduce((sum, [_rarity, num]) => sum + num, 0);
        const guaranteedTypeProbs = guaranteed.ant_type.reduce((sum, [_type, num]) => sum + num, 0);
        if (guaranteedRarityProbs > 100 || guaranteedTypeProbs > 100) {
          return true;
        }
      }
    }
    return false;
  }

  private isDuplicateValue = (nameField: keyof PackToBuy, value: string | number | boolean, family: string) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    return packsTempTabData!.packs.filter(pack => pack[nameField] === value && pack.family === family).length > 1;
  }

  private checkPackConditions = (newState: allPacksResponseType) => {
    const result = !newState.packs.some(pack => {
      if (this.moreThan100(pack)) {
        return true;
      }
      return (pack.packToBuyId && this.isDuplicateValue("packToBuyId", pack.packToBuyId, pack.family)) ||
        (pack.weight && this.isDuplicateValue("weight", pack.weight, pack.family));
    });
    return result;
  }

  private updateDataPacks = (newValue: allPacksResponseType) => {
    const initialData = this.getSubjectValue().initialData;
    const data = _.cloneDeep(initialData);
    const newState = _.cloneDeep(newValue);
    //remove property edited & action before compare with initialData
    newState.packs = newState.packs.map((pack) => {
      delete pack.edited;
      pack.action !== "remove" && delete pack.action;
      return pack
    });
    const diff: Partial<PackToBuy> = differenceObj(newState, data);
    if (Object.keys(diff).length && this.checkPackConditions(newState)) {
      this.providerProps.cpanelBloc.changeTab("Packs", false);
      this.setNextSubjectValue({ packsSaveBtnDisabled: false });
    } else {
      this.providerProps.cpanelBloc.changeTab("Packs", true);
      this.setNextSubjectValue({ packsSaveBtnDisabled: true });
    }
  };

  private addFamilyType = (newFamily: string) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const maxWeight = (Math.max(...packsTempTabData!.packs
      .filter(pack => pack.family === newFamily)
      .map(pack => pack.weight)) + 1
    );
    return `${newFamily}_${(maxWeight === -Infinity) ? 0 : maxWeight}`.toUpperCase()
  }

  handleChangePack = (key: keyof PackToBuy, value: string | number | boolean, packSelected: PackToBuy) => {
    // packToBuyId to uppercase, weight to number
    if (key === "packToBuyId") value = String(value).toUpperCase();
    else if (key === "weight") value = Number(value);

    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    const updatedPack = { ...packSelected, [key]: value, edited: key };

    const indexPacks = packSelected._id
      ? data!.packs.findIndex(pack => pack._id === packSelected._id)
      : data!.packs.findIndex(pack => pack.createdPack_id === packSelected.createdPack_id);

    // useCase Change in Family
    if (key === "family") {
      updatedPack.packToBuyId = this.addFamilyType(value as string);
      updatedPack.weight = Number(updatedPack.packToBuyId.slice(-1));
    }

    updatedPack.action = packSelected._id ? "update" : "create";
    data!.packs[indexPacks] = updatedPack;

    this.setNextSubjectValue({ packsTempTabData: data });
    this.updateDataPacks(data as allPacksResponseType);
  };

  private createMongoOPeration = (actualPacks: PackToBuy[]) => {
    const initialPacks = this.getSubjectValue().initialData!.packs;
    const operation: Partial<PackToBuy>[] = [];
    const editedPacks = actualPacks.filter(pack => pack.action);
    editedPacks.forEach(newpack => {
      const oldPack = initialPacks.find((original: PackToBuy) => newpack._id === String(original._id));
      if (oldPack) {
        if (newpack.action === "update") {
          delete newpack.edited
          const diff: Partial<PackToBuy> = differenceObj(newpack, oldPack);
          //antProbs usecase
          const antProbsToCheck = ['ant_rarity', 'ant_type', 'ant_guaranteed'];
          for (const prop of antProbsToCheck) {
            if (prop in diff) {
              diff[prop as keyof PackToBuy] = newpack[prop as keyof PackToBuy];
            }
          }
          //
          operation.push({
            "_id": newpack._id,
            ...diff
          });
        } else if (newpack.action === "remove") {
          operation.push({
            "_id": newpack._id,
            "action": newpack.action
          });
        }
      } else if (newpack.isTemporaryPack) {
        delete newpack.createdPack_id
        delete newpack.isTemporaryPack
        operation.push(newpack);
      }
    })
    return operation;
  }

  savePacksConfig = async (newDataPacks: CPanelPacksSubject["packsTempTabData"]) => {
    try {
      const initialData = this.getSubjectValue().initialData;
      let operationDiscounts;
      if (JSON.stringify(newDataPacks!.discount_wpack) !== JSON.stringify(initialData?.discount_wpack)) {
        operationDiscounts = {
          type: "master",
          discount_wpack: newDataPacks!.discount_wpack
        };
      }
      const editedPacks = newDataPacks!.packs;
      const operationPacks = this.createMongoOPeration(editedPacks);
      await this.providerProps.cpanelBloc.savePacks(operationPacks, operationDiscounts);
      this.resetCPanelPacksBloc()
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  addNewGuaranteedAnt = (editedPack: PackToBuy) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    let packSelected;
    if (!editedPack._id && editedPack.isTemporaryPack) {
      packSelected = data!.packs.find(pack => pack.createdPack_id === editedPack.createdPack_id);
    } else {
      packSelected = data!.packs.find(pack => pack._id === editedPack._id);
    }
    const newGuaranteed: antGuaranteed = {
      "ant_rarity": [
        ["common", 0],
        ["rare", 0],
        ["epic", 0],
        ["legendary", 0]
      ],
      "ant_type": [
        ["worker", 0],
        ["soldier", 0],
        ["flying", 0]
      ]
    }
    packSelected!.ant_guaranteed ? packSelected!.ant_guaranteed.push(newGuaranteed) : packSelected!.ant_guaranteed = [newGuaranteed]
    this.setNextSubjectValue({ packsTempTabData: data });
    this.updateDataPacks(data as allPacksResponseType);
  }

  resetViewElements = (initialData: allPacksResponseType) => {
    this.setNextSubjectValue({ packsSaveBtnDisabled: true, initialData, packsTempTabData: initialData });
    this.updateDataPacks(initialData as allPacksResponseType);
  }

  changeSelectionFamily = (newFamily: string) => {
    this.setNextSubjectValue({ selectorFamily: newFamily });
  };

  resetCPanelPacksBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false, discountEditable: null });
  };

  handleChangeRemove = (packSelected: PackToBuy, action: "remove" | "undo") => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    let indexPacks;
    if (!packSelected._id) {
      //This pack NOT exist in mongo, remove in view
      indexPacks = data!.packs.findIndex(pack => pack.createdPack_id === packSelected.createdPack_id);
      data!.packs.splice(indexPacks, 1);
    } else {
      //This pack exist in mongo
      indexPacks = data!.packs.findIndex(pack => pack._id === packSelected._id);
      if (action === "remove") {
        data!.packs[indexPacks].action = "remove";
      } else if (action === "undo") {
        delete data!.packs[indexPacks].action
      }
    }
    this.setNextSubjectValue({ packsTempTabData: data });
    this.updateDataPacks(data as allPacksResponseType);
  }

  addNewPack = (packSelected?: PackToBuy) => {
    const packsTempTabData = this.getSubjectValue().packsTempTabData;
    const data = _.cloneDeep(packsTempTabData);
    const createdPacks = packsTempTabData!.packs.filter(pack => pack.isTemporaryPack && pack.createdPack_id);
    let newPack;
    if (packSelected) {
      const familyCount = packsTempTabData!.packs.filter(pack => pack.family === packSelected.family).length;
      const maxWeight = (Math.max(...packsTempTabData!.packs
        .filter(pack => pack.family === packSelected.family)
        .map(pack => pack.weight)) + 1
      );

      const clonePack = _.cloneDeep(packSelected);
      delete clonePack._id
      delete clonePack.edited
      clonePack.action = "create"
      clonePack.createdPack_id = `created_${createdPacks.length + 1}`
      clonePack.isTemporaryPack = true;
      clonePack.title = `Clone of ${clonePack.title}`
      clonePack.packToBuyId = `${clonePack.family}_${familyCount + 1}`.toUpperCase()
      clonePack.published = false
      clonePack.weight = maxWeight
      newPack = clonePack
    } else {
      const familyCount = packsTempTabData!.packs.filter(pack => pack.family === "test").length;
      const maxWeight = (Math.max(...packsTempTabData!.packs
        .filter(pack => pack.family === "test")
        .map(pack => pack.weight)) + 1
      );
      newPack = {
        // "pub_dates": "",
        // ant_guaranteed: ""
        "isTemporaryPack": true,
        "createdPack_id": `created_${createdPacks.length + 1}`,
        "action": "create",
        "title": "New pack",
        "max_buy_qty": 0,
        "description": "",
        // "imguri": "",
        "family": "test",
        "packToBuyId": `test_${familyCount + 1}`.toUpperCase(),
        "price": 0,
        "published": false,
        "num_mints": 1,
        "weight": (maxWeight === -Infinity) ? 1 : maxWeight,
        "ant_rarity": [
          ["common", 0],
          ["rare", 0],
          ["epic", 0],
          ["legendary", 0]
        ],
        "ant_type": [
          ["worker", 0],
          ["soldier", 0],
          ["flying", 0]
        ]
      }
    }
    data!.packs.unshift(newPack as PackToBuy);
    this.setNextSubjectValue({ packsTempTabData: data, selectorFamily: "all" });
    this.updateDataPacks(data as allPacksResponseType);
  }

  // Check errors view //
  checkErrorAntProb = (diff: Partial<PackToBuy>, typeProb: string, keyGuaranteed?: number) => {
    if (!Object.keys(diff).length) {
      return false;
    }
    if (typeProb !== "ant_guaranteed") {
      return !!diff.errors?.[typeProb];
    }
    const antGuaranteedError = diff.errors?.[typeProb]?.[keyGuaranteed as number]?.status === "error";
    return !!antGuaranteedError;
  };

  setBoxStatus = (diff: Partial<PackToBuy>) => {
    let status = ""
    if (Object.keys(diff).length > 0) {
      status = "update";
      if (diff.errors && Object.keys(diff.errors).length > 0 && "errors") {
        if ((diff.errors.ant_guaranteed &&
          Object.keys(diff.errors.ant_guaranteed).length &&
          diff.errors.ant_guaranteed.some((obj: antProbsStatus) => obj.status === "error")))
          status = "errors";
      }
    }
    return status;
  }

  checkErrorField = (diff: Partial<PackToBuy>, nameField: string) => {
    return diff.errors && diff.errors[nameField] && "error"
  }
  // //
}