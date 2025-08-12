import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { BlackSmithSubject, defaultDataSubjectBlackSmith } from '../types/BlackSmithSubject';
import ColonyRepository from '@Repositories/ColonyRepository';
import { BlackSmithProviderPropsType } from '../providers/BlackSmithProvider';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { FarmingTool } from '../types/BlackSmith';
import { v4 as uuidv4 } from 'uuid';
import { BlackSmithViewPropsType } from '../views/BlackSmithView';
import SocketIOService from '@Services/SocketIOService';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';

export default class BlackSmithBloc extends BaseBloc<BlackSmithSubject> {
  providerProps: BlackSmithProviderPropsType;
  colonyRepository: ColonyRepository;

  constructor(props: BlackSmithProviderPropsType) {
    super(defaultDataSubjectBlackSmith);
    this.providerProps = props;
    this.colonyRepository = props.colonyRepository;
  }

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectBlackSmith.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
  };

  closeModal = () => {
    // Call fn on ColonyBloc - closeBlackSmith - Modal Function
    this.providerProps.closeModal();
  };

  onAxeAdded = async (logs) => {
    console.log('Axe added logs:', logs);
    await this.providerProps.refreshColonyData();
    this.setNextSubjectValue({
      toastr: this.setToastrObj('success', 'colony.blacksmith.tradeSuccessful'),
      isLoading: false,
    });
  };

  fireBuyAxe = async (colonyId: string, costAxe: string, socket: SocketIOService) => {
    this.setLoading();
    // gen new uuid and subscribe to WS for future response
    const newUuid = uuidv4();
    try {
      // Notify backend to start process and subscribe to the UUID
      socket.handleSocketConnection(
        socket,
        newUuid,
        async (data: any) => {
          await this.onAxeAdded(data);
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      await this.colonyRepository.buyAxeOnSC(colonyId, costAxe, newUuid);
    } catch (error) {
      console.error('Error during axe purchase:', error);
      socket.closeSocket(socket, newUuid);
      this.setLoading(false);
    }
  };

  buyTool = async (toolIdToTrade: number, outletContext: OutletContextType, colony: Colony) => {
    try {
      this.setLoading();
      // Axe on SC Usecase
      if (toolIdToTrade === 1) {
        const axe = colony.blackSmith.farmingTools.find((tool) => tool.toolId === 1)!;
        await this.fireBuyAxe(colony._id, String(axe.cost[0].priceWithDiscountApplied), outletContext.socketIOService);
        return;
      }
      //** */
      const tradeResponse = await this.colonyRepository.executeTradeWithBlackSmith(
        this.providerProps.colonyData._id,
        toolIdToTrade
      );

      if (tradeResponse) {
        // Si era la toolId 1 que vale nectar, refresheamos account data
        // if (toolIdToTrade === 1) {
        //   await outletContext.refreshAccountDataFn();
        // }

        // Call parent to re-read the colony
        await this.providerProps.refreshColonyData();

        this.setNextSubjectValue({
          toastr: this.setToastrObj('success', 'colony.blacksmith.tradeSuccessful'),
          isLoading: false,
        });
      }

      // Finally, close the modal (Disabled by the moment, maybe the user wants to buy more tools)
      //   this.closeModal();
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  /**
   * Checks if the player has enough material for a given tool.
   * @param {FarmingTool} tool - The tool to check for material requirements.
   * @param {BlackSmithViewPropsType} props - The props containing the colony data and materials.
   * @param {OutletContextType} outletContext - The outlet context containing the account data.
   * @returns {boolean} - Returns true if the player has enough material for the tool, false otherwise.
   */
  playerHaveEnoughMaterialForGivenTool = (
    tool: FarmingTool,
    props: BlackSmithViewPropsType,
    outletContext: OutletContextType
  ) => {
    let enoughCounter = 0;
    tool.cost.forEach((cost, key) => {
      let materialSelected;
      const materialToWork = props.colonyData?.materials.find((material) => material.materialId === cost.materialId);
      if (materialToWork) {
        materialSelected = materialToWork.value;
      } else {
        materialSelected = outletContext.accountData?.nectar!;
      }

      if (materialSelected !== undefined && materialSelected >= cost.priceWithDiscountApplied!) {
        enoughCounter++;
      }
    });

    return enoughCounter === tool.cost.length;
  };
}
