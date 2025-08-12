import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { InventoryItemPropsType } from '@ComponentsRoot/Inventory/types/InventoryItemPropsType';
import ColonyRepository from '@Repositories/ColonyRepository';
import { ColonyItemAssignerProviderPropsType } from '../providers/ColonyItemAssignerProvider';
import { AddToColonyBodyType } from '../types/AddToColonyBodyType';
import { ColonyItemAssignerSubject, defaultSubjDataColItemAssignerBloc } from '../types/ColonyItemAssignerSubject';
import { isAnt, isPurchasedMaterialBox } from '@ComponentsRoot/Inventory/Utils/InventoryUtils';
import { AxiosError } from 'axios';

type itemsToAddType = { type: 'ant' | 'mbox'; idsToAdd: string[] }[];

export default class ColonyItemAssignerBloc extends BaseBloc<ColonyItemAssignerSubject> {
  colonyRepository: ColonyRepository;
  providerProps: ColonyItemAssignerProviderPropsType;
  constructor(props: ColonyItemAssignerProviderPropsType) {
    super(defaultSubjDataColItemAssignerBloc);
    this.providerProps = props;
    this.colonyRepository = props.colonyRepository;
  }

  getColonies = async () => {
    try {
      this.setLoading();
      const colonies = await this.colonyRepository.getUserColonies();
      this.setNextSubjectValue({
        coloniesData: colonies,
        isLoading: false,
        ...(colonies.length === 1 && { selectedColony: colonies[0] }),
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  resolveAssignItemsToColony = async (itemsToAssign: InventoryItemPropsType['item'][]) => {
    try {
      this.setLoading();

      const itemsToAdd = itemsToAssign.reduce((acc: itemsToAddType, item) => {
        const type = isAnt(item) ? 'ant' : isPurchasedMaterialBox(item) ? 'mbox' : null;
        if (type) {
          const index = acc.findIndex((itm) => itm.type === type);
          if (index !== -1) {
            acc[index].idsToAdd.push(item._id as string);
          } else {
            acc.push({ type, idsToAdd: [item._id as string] });
          }
        }
        return acc;
      }, []);

      const prevState = this.getSubjectValue();
      const multiAssignObj: AddToColonyBodyType = {
        colonyId: prevState.selectedColony?._id as string,
        itemsToAdd,
      };

      const res = await this.colonyRepository.addItemsToColony(multiAssignObj);
      if (res) {
        this.setNextSubjectValue({ isLoading: false });
        await this.providerProps.afterAssignFn(prevState.selectedColony?._id as string);
      }
    } catch (error) {
      console.log(error);
      this.setNextSubjectValue({
        assignModalErrorData: { errors: (error! as AxiosError<any>).response!.data.errors! },
        isLoading: false,
      });
    }
  };

  closeErrorsModal = () => {
    this.setNextSubjectValue({ assignModalErrorData: undefined, isLoading: false });
    this.providerProps.cancelHandler();
  };

  setSelectedColony = (colony: Colony) => {
    const prevSelectedColony = this.getSubjectValue().selectedColony;
    const same = colony._id === prevSelectedColony?._id;
    this.setNextSubjectValue({ selectedColony: same ? null : colony });
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultSubjDataColItemAssignerBloc.toastr, selectedColony: null });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
    // this.setNextSubjectValue({ ...defaultSubjDataColItemAssignerBloc });
  };

  autoAssignWhenWhenOpen = async()=>{

  }
}
