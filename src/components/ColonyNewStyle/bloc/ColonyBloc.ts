import { ColonySubject, defaultDataSubjectColony } from '../types/ColonySubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import ColonyRepository from '@Repositories/ColonyRepository';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { PurchasedMaterialBox } from '@ComponentsRoot/MaterialBox/types/PurchasedMaterialBox';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { BaseRoomType } from '../types/RoomType';
import { AddToColonyBodyType } from '@ComponentsRoot/ColonyItemAssigner/types/AddToColonyBodyType';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { farmingToolsEmojisRelation } from '@ComponentsRoot/BlackSmith/types/BlackSmith';
import { spotEmojisSrcRelation, SpotType } from '../types/SpotType';
import { antsRestored } from '@ComponentsRoot/Hospital/types/AntRestored';
import { PurchasedPowerTicket } from '@ComponentsRoot/Expedition/types/PowerTicket';
import SocketIOService from '@Services/SocketIOService';
import { v4 as uuidv4 } from 'uuid';

export default class ColonyBloc extends BaseBloc<ColonySubject> {
  colonyRepository: ColonyRepository;
  providerProps: OutletContextType;
  constructor(props: OutletContextType) {
    super(defaultDataSubjectColony);
    this.providerProps = props;
    this.colonyRepository = props.repositoryManager.getColonyRepository();
  }

  closeSellerDialog = async () => {
    this.setNextSubjectValue({ sellerDialog: false });
  };

  refreshColonyData = async () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ colonyData: await this.colonyRepository.getColonyDetail(prevState.colonyData?._id) });
  };

  getColonyData = async (id: string | undefined) => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      this.setNextSubjectValue({
        colonyData: await this.colonyRepository.getColonyDetail(id),
        isLoading: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  handleOpenPurchasedMaterialBox = async (mBoxToOpen: PurchasedMaterialBox, colonyId: string) => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      const openMBoxRes = await this.colonyRepository.openPurchasedMaterialBox(mBoxToOpen._id!);
      if (openMBoxRes) {
        this.setNextSubjectValue({
          toastr: this.setToastrObj('success', 'colony.materialBoxOpenedSuccessfully'),
          colonyData: await this.colonyRepository.getColonyDetail(colonyId),
          isLoading: false,
        });
      }
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  toggleCallSellerDialog = () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ sellerDialog: !prevState.sellerDialog });
  };

  toggleSwapSellerDialog = () => {
    const prevState = this.getSubjectValue();
    if (prevState.colonyData?.seller?.available?.active) {
      this.setNextSubjectValue({ swapModal: !prevState.swapModal });
    }
  };

  toggleBlackSmithDialog = () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ blackSmithModalVisible: !prevState.blackSmithModalVisible });
  };

  toggleHospitalDialog = () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ HospitalModalVisible: !prevState.HospitalModalVisible });
  };

  toggleExpeditionsDialog = () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ expeditionsModalVisible: !prevState.expeditionsModalVisible });
  };

  toggleTavernModal = () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ tavernModalVisible: !prevState.tavernModalVisible });
  };

  toggleWareHouseModal = () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ isWareHouseModalOpen: !prevState.isWareHouseModalOpen });
  };

  toggleDetailDestinationDialog = () => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ DetailDestinationModalVisible: !prevState.DetailDestinationModalVisible });
  };

  toggleDormitoryRoom = (dormitoryRoomId?: number) => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ clickedRoomId: dormitoryRoomId, roomDetailModalOpen: !prevState.roomDetailModalOpen });
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectColony.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
    // this.setNextSubjectValue({ ...defaultDataSubjectColony });
  };

  getOpenDetailModalByRoomId = (id: number) => {
    // Dormitory rooms (Barrack, Control Room, Living Quarter)
    if (id === 1 || id === 2 || id === 3) {
      this.toggleDormitoryRoom(id);
    } else if (id === 4) {
      this.toggleBlackSmithDialog();
    } else if (id === 8) {
      this.toggleTavernModal();
    } else if (id === 10) {
      this.toggleExpeditionsDialog();
    } else if (id === 5) {
      this.toggleWareHouseModal();
    } else if (id === 9) {
      this.toggleSwapSellerDialog();
    } else if (id === 6) {
      this.toggleHospitalDialog();
    }
    return undefined;
  };

  toggleUpgradeRoomModal = (selectedRoomToUpgrade: number = 0) => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ upgradeRoomModal: !prevState.upgradeRoomModal, selectedRoomToUpgrade });
  };

  toggleUnlockRoomModal = (selectedRoomToUnlock: number = 0) => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ unlockRoomModal: !prevState.unlockRoomModal, selectedRoomToUnlock });
  };

  toggleAddAntsToRoomModal = () => {
    const prevState = this.getSubjectValue();
    const nextAddAntsToRoomModalVisible = !prevState.addAntsToRoomModalVisible;

    this.setNextSubjectValue({
      addAntsToRoomModalVisible: nextAddAntsToRoomModalVisible,
      selectedRoomToAddAnts: nextAddAntsToRoomModalVisible ? undefined : prevState.selectedRoomToAddAnts,
      antsOnInventory: nextAddAntsToRoomModalVisible ? undefined : prevState.antsOnInventory,
    });
  };

  toggleUnlockSpotModal = (selectedSpotToUnlock: number = 0) => {
    const prevState = this.getSubjectValue();
    this.setNextSubjectValue({ unlockSpotModal: !prevState.unlockSpotModal, selectedSpotToUnlock });
  };

  onUpgradeRoomPayed = async (logs, colonyId) => {
    // console.log('Upgrade Room payed logs:', logs);
    this.setNextSubjectValue({
      toastr: this.setToastrObj('success', 'colony.room.upgrade.success'),
      colonyData: await this.colonyRepository.getColonyDetail(colonyId),
      isLoading: false,
      upgradeRoomModal: false,
      selectedRoomToUpgrade: 0,
    });
  };

  fireUpgradeRoomWithNectar = async (
    nectarCost: string,
    roomId: number,
    colonyId: string,
    lvlToUpgrade: number,
    socket: SocketIOService
  ) => {
    this.setLoading();
    const newUuid = uuidv4();
    try {
      socket.handleSocketConnection(
        socket,
        newUuid,
        async (data: any) => {
          await this.onUpgradeRoomPayed(data, colonyId);
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );
      await this.colonyRepository.payUpgradeRoomOnSC(nectarCost, roomId, colonyId, lvlToUpgrade, newUuid);
    } catch (error) {
      console.error('Error during upgrade room purchase:', error);
      socket.closeSocket(socket, newUuid);
      this.setLoading(false);
    }
  };

  upgradeRoom = async (roomId: number, outletContext: OutletContextType) => {
    try {
      const colonyId = this.getSubjectValue().colonyData?._id!;
      this.setLoading();
      const response = await this.colonyRepository.upgradeRoom(roomId, colonyId);
      const { nectarCost, roomId: roomIdRes, colonyId: colonyIdRes, roomLvlToUpgrade } = response;
      if (roomId === roomIdRes && colonyId === colonyIdRes && nectarCost) {
        // SC Usecase
        await this.fireUpgradeRoomWithNectar(nectarCost, roomId, colonyId, roomLvlToUpgrade, outletContext.socketIOService);
      } else {
        this.setNextSubjectValue({
          toastr: this.setToastrObj('success', 'colony.room.upgrade.success'),
          colonyData: await this.colonyRepository.getColonyDetail(colonyId),
          isLoading: false,
          upgradeRoomModal: false,
          selectedRoomToUpgrade: 0,
        });
      }
      await this.providerProps.refreshAccountDataFn();
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  unlockRoom = async (roomId: number, colonyId: string) => {
    try {
      this.setLoading();
      await this.colonyRepository.unlockRoom(roomId, colonyId);
      this.setNextSubjectValue({
        toastr: this.setToastrObj('success', 'colony.room.unlock.success'),
        colonyData: await this.colonyRepository.getColonyDetail(colonyId),
        isLoading: false,
        unlockRoomModal: false,
        selectedRoomToUnlock: 0,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  handleOpenAddAntToRoomModal = async (room: BaseRoomType) => {
    try {
      await this.getAllAntsOnInventory();
      this.setNextSubjectValue({
        selectedRoomToAddAnts: room,
        addAntsToRoomModalVisible: true,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  handlerManageSpot = async (spotSelected: SpotType, spotNumber: number, farmingToolsInColony: Colony['farmingTools']) => {
    const { unlocked, availableToCollect, materialExceedCapacity, requiredTool } = spotSelected;
    let error = '';
    if (!unlocked) {
      return this.toggleUnlockSpotModal(spotNumber);
    } else if (availableToCollect === true) {
      await this.collectSpot(spotNumber, this.getSubjectValue().colonyData?._id!);
    } else if (farmingToolsInColony[requiredTool] < 1) {
      error = 'SPOT.NOT_TOOL';
      error = this.providerProps.intl.formatMessage(
        {
          id: 'SPOT.tool_needed',
        },
        { toolEmoji: farmingToolsEmojisRelation[requiredTool], spotEmoji: spotEmojisSrcRelation[spotSelected.spotId] }
      );
    } else if (materialExceedCapacity) {
      error = 'SPOT.NOT_ENOUGHT_CAPACITY';
    } else {
      error = 'SPOT.COLLECT_NOT_CYCLE';
    }
    if (error !== '') {
      this.setNextSubjectValue({
        toastr: this.setToastrObj('error', error),
      });
    }
  };

  private collectSpot = async (spotNumber: number, colonyId: string) => {
    try {
      const colonyNewData = await this.colonyRepository.collectSpot(spotNumber, colonyId);
      this.setNextSubjectValue({ colonyData: colonyNewData });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  addAntsToColonyRoom = async (antsIdsToAdd: string[]) => {
    try {
      const itemsToAddMapped: AddToColonyBodyType = {
        colonyId: this.getSubjectValue().colonyData?._id!,
        itemsToAdd: [{ type: 'ant', idsToAdd: antsIdsToAdd }],
      };

      const addAntsResponse = await this.colonyRepository.addItemsToColony(itemsToAddMapped);
      if (addAntsResponse) {
        this.toggleAddAntsToRoomModal();
        this.setNextSubjectValue({
          toastr: this.setToastrObj('success', 'colony.room.addAntsToRoom.success'),
        });

        // refresh colony data
        await this.getColonyData(this.getSubjectValue().colonyData?._id);
      }
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  // Get all ants on inventory of the current player
  getAllAntsOnInventory = async () => {
    try {
      this.setLoading();
      const antsOnInventory: Ant[] = await this.colonyRepository.getAllAntsOnInventory(this.getSubjectValue().colonyData?._id!);
      this.setNextSubjectValue({
        antsOnInventory: antsOnInventory,
        isLoading: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  add24hToTimeStamp = async () => {
    try {
      this.setLoading();
      await this.colonyRepository.add24hToCustomTimeStamp(this.getSubjectValue().colonyData?._id!);
      await this.getColonyData(this.getSubjectValue().colonyData?._id);
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  unlockSpot = async (spotNumber: number) => {
    try {
      const colonyId = this.getSubjectValue().colonyData?._id;
      this.setNextSubjectValue({ isLoading: true });
      await this.colonyRepository.unlockSpot(spotNumber, colonyId!);
      this.setNextSubjectValue({
        toastr: this.setToastrObj('success', 'colony.spot.unlock.success'),
        colonyData: await this.colonyRepository.getColonyDetail(colonyId),
        isLoading: false,
        unlockSpotModal: false,
        selectedSpotToUnlock: 0,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  restoreUsedTimes = async (mongoStructure: antsRestored) => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      const responseWithColony = await this.colonyRepository.restoreAnts(mongoStructure);
      this.setNextSubjectValue({
        toastr: this.setToastrObj('success', 'colony.room.hospital.restore'),
        colonyData: responseWithColony,
        isLoading: false,
        HospitalModalVisible: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  buyRestorePack = async (mongoStructure: { colonyId: string; restorePackId: number }) => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      const responseWithColony = await this.colonyRepository.restorePack(mongoStructure);
      this.setNextSubjectValue({
        toastr: this.setToastrObj('success', 'colony.room.hospital.restore'),
        colonyData: responseWithColony,
        isLoading: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  restartExpeditions = async () => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      await this.providerProps.refreshAccountDataFn();
      this.setNextSubjectValue({
        colonyData: await this.colonyRepository.getColonyDetail(this.getSubjectValue().colonyData?._id),
        isLoading: false,
        expeditionsModalVisible: false,
        DetailDestinationModalVisible: false,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  handleClickAntMiniCard = (ant: Ant) => {
    this.setNextSubjectValue({ antToOpenDetail: ant });
  };

  handleClickMiniPwrTicketCard = (purchasedTicket: PurchasedPowerTicket) => {
    this.setNextSubjectValue({ purchasedTicketToAssign: purchasedTicket });
    this.togglePwrTicketAssignerToAntModal();
  };

  togglePwrTicketAssignerToAntModal = () => {
    const { isOpenPwrTicketAssignerModal } = this.getSubjectValue();
    const updatedState = { isOpenPwrTicketAssignerModal: !isOpenPwrTicketAssignerModal };

    if (isOpenPwrTicketAssignerModal) {
      updatedState['purchasedTicketToAssign'] = undefined;
    }

    this.setNextSubjectValue(updatedState);
  };

  closeAntDetailModal = () => {
    this.setNextSubjectValue({ antToOpenDetail: undefined });
  };

  sendAntToInventory = async (antId: string) => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      const colonyId = this.getSubjectValue().colonyData?._id;
      await this.colonyRepository.moveAntToInventory(colonyId!, antId);
      this.setNextSubjectValue({
        colonyData: await this.colonyRepository.getColonyDetail(colonyId),
        isLoading: false,
        toastr: this.setToastrObj('success', 'inventory.successSendAntToInventory'),
        antToOpenDetail: undefined,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  useQuestPowerTicketOnColony = async (
    purchasedPowerTicket: PurchasedPowerTicket,
    antToUpgrade: Ant,
    socket: SocketIOService
  ) => {
    const newUuid = uuidv4();
    try {
      this.setNextSubjectValue({ isLoading: true });
      const subjVal = this.getSubjectValue();
      const canUseTicket = await this.colonyRepository.usePowerTicket(
        subjVal.purchasedTicketToAssign!._id!,
        subjVal.colonyData!._id,
        antToUpgrade.tokenId!,
        true
      );

      if (canUseTicket) {
        // gen new uuid and subscribe to WS for future response
        socket.handleSocketConnection(
          socket,
          newUuid,
          async (data: any) => {
            this.togglePwrTicketAssignerToAntModal();

            await this.refreshColonyData();

            this.setNextSubjectValue({
              toastr: this.setToastrObj('success', 'powerTicket.usedSuccessfully'),
              isLoading: false,
              pwrTicketUpgradeResult: data.ant,
            });
          },
          (error) => {
            this.setErrorOnBloc(error);
          }
        );

        await this.colonyRepository.fireUsePowerTicketSC(
          purchasedPowerTicket._id!,
          this.getSubjectValue().colonyData!._id,
          antToUpgrade.tokenId!,
          true,
          newUuid
        );
      } else {
        // open toastr with error cannot start expedition node checked before fire metamask
        this.setNextSubjectValue({
          toastr: this.setToastrObj('error', 'powerTicket.useError'),
          isLoading: false,
        });
      }
    } catch (error) {
      socket.closeSocket(socket, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  closeUpgradedAntModal = () => {
    this.setNextSubjectValue({ pwrTicketUpgradeResult: undefined });
  };

  toggleLightMode = (lightMode: 'morning' | 'midday' | 'night' | 'auto') => {
    this.setNextSubjectValue({ lightMode });
  };
}
