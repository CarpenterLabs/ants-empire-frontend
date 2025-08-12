import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { PackToBuy, PurchasedPack } from '@ComponentsRoot/ControlPanel/components/CPanelStandard/types/Cache';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import AccountRepository from '@Repositories/AccountRepository';
import MarketRepository from '@Repositories/MarketRepository';
import WelcomePackRepository from '@Repositories/WelcomePackRepository';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Inventory } from '../types/Inventory';
import { InventoryItemPropsType } from '../types/InventoryItemPropsType';
import { defaultSubjDataInventoryBloc, InventorySubject } from '../types/InventorySubject';
import { isAnt } from '../Utils/InventoryUtils';

export default class InventoryBloc extends BaseBloc<InventorySubject> {
  selectableInventoryItems: Array<keyof Inventory> = ['ants', 'purchasedMaterialBoxes'];
  accountRepository: AccountRepository;
  welcomePackRepository: WelcomePackRepository;
  marketRepository: MarketRepository;
  providerProps: OutletContextType;
  constructor(props: OutletContextType) {
    super(defaultSubjDataInventoryBloc);
    this.providerProps = props;
    this.accountRepository = props.repositoryManager.getAccountRepository();
    this.welcomePackRepository = props.repositoryManager.getWelcomePackRepository();
    this.marketRepository = props.repositoryManager.getMarketRepository();
  }

  getInventory = async () => {
    try {
      this.setLoading();
      const inventory = await this.accountRepository.getInventory();
      this.setNextSubjectValue({
        inventoryData: inventory,
        isLoading: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  setSelectableInventoryItemsToTrueOrFalse = (bool: boolean) => {
    const prevState = this.getSubjectValue();
    const inv = _.cloneDeep(prevState.inventoryData) as Inventory;
    Object.keys(inv).forEach((key) => {
      if (this.selectableInventoryItems.includes(key as keyof Inventory)) {
        //Loop it and set selected --> false only on the allowed selectable inventory types
        inv[key as keyof Inventory].forEach((inventoryItem) => {
          inventoryItem.selected = bool;
        });
      }
    });

    return inv;
  };

  selectAllSelectableItems = () => {
    const invNew = this.setSelectableInventoryItemsToTrueOrFalse(true);
    this.setNextSubjectValue({
      inventoryData: invNew,
    });
  };

  handleOpenPurchasedMaterialBox = (item: PurchasedMaterialBox) => {
    const prevState = this.getSubjectValue();
    const purchasedMBoxes = _.cloneDeep(prevState.inventoryData?.purchasedMaterialBoxes);

    const selectedPurchasedMBoxes = purchasedMBoxes!.map((invItem: PurchasedMaterialBox & { selected: boolean }) => {
      if (invItem._id === item._id) {
        return { ...invItem, selected: true };
      }
      return invItem;
    });

    this.setNextSubjectValue({
      inventoryData: { ...prevState.inventoryData!, purchasedMaterialBoxes: selectedPurchasedMBoxes! },
      isOpenAssignToColonyModal: true,
      assignerOpenFromPurchasedMaterialBoxBtn: true,
    });
  };

  onMultiSelectBtnClick = () => {
    const prevState = this.getSubjectValue();
    const isMultiSelectEnabled = prevState.multiSelectEnabled;

    if (!isMultiSelectEnabled) {
      // const inv = _.cloneDeep(prevState.inventoryData) as Inventory;
      // Si previamente estava deshbailitado setearemos selected:false a todos los arrays que tengan keyof Inventory que puedan ser selectables
      // de momento, solo 'ants' son selectables
      const invNew = this.setSelectableInventoryItemsToTrueOrFalse(false);
      this.setNextSubjectValue({
        multiSelectEnabled: true,
        inventoryData: invNew,
      });
    } else {
      // Multiselect enabled, user wants to open the final popup to assign items
      // tot he colony
      this.setNextSubjectValue({
        isOpenAssignToColonyModal: true,
      });
    }
  };

  onCardClick = (item: InventoryItemPropsType['item'], inventoryDataKey: InventoryItemPropsType['inventoryDataKey']) => {
    const prevState = this.getSubjectValue();
    if (prevState.multiSelectEnabled) {
      // We don't want to select an item if is currently blocked, state only present on ANTS
      // with the field 'isBlockedUntil'
      if (isAnt(item) && item.isBlockedUntil) {
        return;
      }

      // We're on multiSelectMode
      const invClone = _.cloneDeep(prevState.inventoryData as Inventory);
      invClone[inventoryDataKey as keyof Inventory].forEach((itemIn) => {
        // Find and the selected inventory item and set his selected property TO TRUE/FALSE
        if (itemIn._id === item._id) {
          itemIn.selected = !item.selected;
        }
      });

      this.setNextSubjectValue({ inventoryData: invClone });
    } else {
      // No multiselect Mode
      if (isAnt(item)) {
        //IS ANT, INVOKE ANTDETAIL COMPONENT
        this.setNextSubjectValue({ antToOpenDetail: item as any });
      }
    }
  };

  handleClickAntDetailBtn = (ant: Ant) => {
    this.setNextSubjectValue({ antToOpenDetail: ant });
  };

  closeAntDetailModal = () => {
    this.setNextSubjectValue({ antToOpenDetail: undefined });
  };

  getSelectedInventoryItems = (): InventoryItemPropsType['item'][] => {
    const selected: InventoryItemPropsType['item'][] = [];
    const inventoryData = this.getSubjectValue().inventoryData as Inventory;
    Object.keys(inventoryData).forEach((key) => {
      const selectedIn = (inventoryData[key as keyof Inventory] as []).filter(
        (itm: InventoryItemPropsType['item']) => itm.selected
      );
      if (selectedIn) {
        selected.push(...selectedIn);
      }
    });

    return selected;
  };

  getSelectedInvItemsCount = () => {
    return this.getSelectedInventoryItems().length;
  };

  cancelMultiSelect = () => {
    const inv = this.setSelectableInventoryItemsToTrueOrFalse(false);
    this.setNextSubjectValue({ multiSelectEnabled: false, inventoryData: inv });
  };

  resolveWelcomePack = async (pack: Pick<PackToBuy, 'family' | 'packToBuyId'>) => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      await this.welcomePackRepository.resolvePack(pack);
      this.setNextSubjectValue({ packToOpen: undefined });
      await this.getInventory();
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  onClickSellAntBtn = (ant: Ant) => {
    this.setNextSubjectValue({ antToListMarket: ant });
  };

  closeListAntMarketModal = () => {
    this.setNextSubjectValue({ antToListMarket: undefined });
  };

  listAntOnMarketplace = async (ant: Ant, price: number) => {
    const newUuid = uuidv4();
    try {
      this.setLoading();

      this.providerProps.socketIOService.handleSocketConnection(
        this.providerProps.socketIOService,
        newUuid,
        async (data: any) => {
          this.setNextSubjectValue({
            antToListMarket: undefined,
          });
          this.closeAntDetailModal();
          this.setLoading(false);

          await this.getInventory();

          this.setNextSubjectValue({
            toastr: this.setToastrObj('success', 'market.nftListedSuccessfully'),
          });
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      await this.marketRepository.listNFT(ant.tokenId, price, newUuid);
    } catch (error) {
      this.providerProps.socketIOService.closeSocket(this.providerProps.socketIOService, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  handleOpenPack = (item: InventoryItemPropsType['item']) => {
    this.setNextSubjectValue({ packToOpen: item as PurchasedPack });
  };

  togglerRevealedWelcomePackModal = () => {
    this.setNextSubjectValue({ packToOpen: undefined });
  };

  cancelAssignItemsToColonyModal = () => {
    const prevState = this.getSubjectValue();
    const invNew = this.setSelectableInventoryItemsToTrueOrFalse(false);
    this.setNextSubjectValue({
      inventoryData: prevState.assignerOpenFromPurchasedMaterialBoxBtn ? invNew : prevState.inventoryData,
      isOpenAssignToColonyModal: false,
      assignerOpenFromPurchasedMaterialBoxBtn: false, // SET THIS TO FALSE ALWAYS
    });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
    // this.setNextSubjectValue({ ...defaultSubjDataInventoryBloc });
  };

  assignToColonyCompleted = async (colonyId: string) => {
    await this.getInventory();
    this.setNextSubjectValue({
      isOpenAssignToColonyModal: false,
      multiSelectEnabled: false,
      toastr: this.setToastrObj(
        'success',
        'inventory.assignToColonySuccess',
        this.configManager.getRoutesRelation().COLONY_DETAIL.relPath.replace(':id', colonyId)
      ),
    });
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultSubjDataInventoryBloc.toastr });
  };
}
