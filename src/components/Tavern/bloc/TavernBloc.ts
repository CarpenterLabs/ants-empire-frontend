import { TavernSubject, defaultDataSubjectTavern } from '../types/TavernSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { TavernProviderPropsType } from '../providers/TavernProvider';
import { FarmingNPC } from '../types/farmingNPC/FarmingNPC';
import FarmingQuestRepository from '@Repositories/FarmingQuestRepository';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { ExecuteQuestProcessResult } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuestHistory';
import { PurchasedPack } from '@ComponentsRoot/ControlPanel/components/CPanelStandard/types/Cache';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import SocketIOService from '@Services/SocketIOService';
import { v4 as uuidv4 } from 'uuid';
import { FarmingQuest, QuestTypeReward, QuestTypeSeparator } from '@ComponentsRoot/core/types/FarmingQuest/FarmingQuest';
import WelcomePackRepository from '@Repositories/WelcomePackRepository';
export default class TavernBloc extends BaseBloc<TavernSubject> {
  providerProps: TavernProviderPropsType;
  farmingQuestRepository: FarmingQuestRepository;
  welcomePackRepository: WelcomePackRepository;

  constructor(props: TavernProviderPropsType) {
    super(defaultDataSubjectTavern);
    this.providerProps = props;
    this.farmingQuestRepository = props.farmingQuestRepository;
    this.welcomePackRepository = props.wPackRepo;
  }

  closeModal = () => {
    this.providerProps.closeModal();
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectTavern.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false, toastr: defaultDataSubjectTavern.toastr });
  };

  calculateSumMaterialsOnColony = (colonyMaterials: Colony['materials']) => {
    return colonyMaterials.reduce((total, material) => {
      return total + Number(material.value);
    }, 0);
  };

  // Get all the FarmingNPC from mongo
  getTavernData = async () => {
    try {
      this.setLoading();
      const farmingNPCS: FarmingNPC[] = await this.farmingQuestRepository.getTavernData(this.providerProps.colonyData._id);
      this.setNextSubjectValue({ npcsData: farmingNPCS, isLoading: false });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  onQuestCompleted = async (data) => {
    this.setNextSubjectValue({
      toastr: this.setToastrObj('success', 'farmingQuest.succesfull'),
      npcsData: data.body.npcs,
      isLoading: false,
      ...(data.body?.questResult.hasOwnProperty('buyedpack') && {
        isOpenMintPackRewardModal: true,
        mintPackResult: data.body.questResult as PurchasedPack,
      }),
    });

    await this.providerProps.refreshAccountDataFn();
    await this.providerProps.refreshColonyData();
  };

  fireCompleteQuestOnSC = async (
    colonyId: string,
    questId: string,
    questType: string,
    npcId: number,
    socket: SocketIOService,
    cost: string,
    isFreeQuest: boolean
  ) => {
    this.setLoading();
    const newUuid = uuidv4();
    try {
      socket.handleSocketConnection(
        socket,
        newUuid,
        async (data: any) => {
          await this.onQuestCompleted(data);
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      if (isFreeQuest) {
        let mintsInPack;
        if ((questType as FarmingQuest['typeQuest']).includes('MATERIAL~~MINT_COMMON')) {
          mintsInPack = await this.getNumOfMintsInsideFarmingQuestPack(questType);
        }
        await this.farmingQuestRepository.completeFreeQuestOnSC(
          colonyId,
          questId,
          questType as FarmingQuest['typeQuest'],
          npcId,
          newUuid,
          Boolean(mintsInPack),
          mintsInPack ?? 0
        );
      } else {
        await this.farmingQuestRepository.completeQuestForNectarOnSC(colonyId, questId, questType, cost, npcId, newUuid);
      }
    } catch (error) {
      console.error('Error during complete quest:', error);
      socket.closeSocket(socket, newUuid);
      this.setLoading(false);
    }
  };

  getNumOfMintsInsideFarmingQuestPack = async (questType: string) => {
    try {
      return await this.welcomePackRepository.getPackNumMintsInside(questType.split(QuestTypeSeparator)[1] as QuestTypeReward);
    } catch (error) {
      throw error;
    }
  };

  executeQuest = async (uniqueQuestId: string, npcId: number, outletContext: OutletContextType) => {
    try {
      this.setLoading();
      const execQuestProcessResult: ExecuteQuestProcessResult = await this.farmingQuestRepository.executeQuest(
        this.providerProps.colonyData._id,
        uniqueQuestId,
        npcId
      );

      if (execQuestProcessResult.bchainUsecase) {
        const { colonyId, _id, typeQuest, cost } = execQuestProcessResult.questResult as any;

        if ((typeQuest as FarmingQuest['typeQuest']).includes('MATERIAL~~MINT_COMMON')) {
          await this.fireCompleteQuestOnSC(colonyId, _id, typeQuest, npcId, outletContext.socketIOService, '0', true);
        } else {
          await this.fireCompleteQuestOnSC(
            colonyId,
            _id,
            typeQuest,
            npcId,
            outletContext.socketIOService,
            String(cost[0].quantity),
            false
          );
        }
      } else {
        this.setNextSubjectValue({
          toastr: this.setToastrObj('success', 'farmingQuest.succesfull'),
          npcsData: execQuestProcessResult.npcs,
          isLoading: false,
          ...(execQuestProcessResult?.questResult.hasOwnProperty('buyedpack') && {
            isOpenMintPackRewardModal: true,
            mintPackResult: execQuestProcessResult.questResult as PurchasedPack,
          }),
        });

        await this.providerProps.refreshAccountDataFn();
        await this.providerProps.refreshColonyData();
      }
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  skipQuest = async (uniqueQuestId: string, npcId: number) => {
    try {
      this.setLoading();
      const farmingNPCS: FarmingNPC[] = await this.farmingQuestRepository.skipQuest(
        this.providerProps.colonyData._id,
        uniqueQuestId,
        npcId
      );
      this.setNextSubjectValue({
        npcsData: farmingNPCS,
        isLoading: false,
        toastr: this.setToastrObj('success', 'farmingQuest.skipSuccesfull'),
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  toggleMintPackRewardModal = () => {
    const prevState = this.getSubjectValue();
    const isOpenNow = prevState.isOpenMintPackRewardModal;
    this.setNextSubjectValue({
      isOpenMintPackRewardModal: !prevState.isOpenMintPackRewardModal,
      ...(isOpenNow && { mintPackResult: undefined }),
    });
  };
}
