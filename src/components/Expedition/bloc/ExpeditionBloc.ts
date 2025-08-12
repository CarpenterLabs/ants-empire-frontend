import { ExpeditionSubject, defaultDataSubjectExpedition } from '../types/ExpeditionSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { ExpeditionProviderPropsType } from '../providers/ExpeditionProvider';
import ColonyRepository from '@Repositories/ColonyRepository';
import { Destination, Expeditions, initDataSelectedAnts } from '../types/Expeditions';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { ExpeditionHistory } from '../types/ExpeditionsHistory';
import { ExpeditionReward } from '../types/ExpeditionReward';
import { PurchasedPowerTicket } from '../types/PowerTicket';
import { v4 as uuidv4 } from 'uuid';
import SocketIOService from '@Services/SocketIOService';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { Address } from 'viem';

export default class ExpeditionBloc extends BaseBloc<ExpeditionSubject> {
  providerProps: ExpeditionProviderPropsType;
  colonyRepository: ColonyRepository;

  constructor(props: ExpeditionProviderPropsType) {
    super(defaultDataSubjectExpedition);
    this.providerProps = props;
    this.colonyRepository = props.colonyRepository;
  }

  addToSelectedExpeditionAnts = (newAnt: Ant, destination: Destination) => {
    const prevSelectedExpeditionAnts = this.getSubjectValue().selectedExpeditionAnts;
    const newSelectedExpeditionAnts = [...prevSelectedExpeditionAnts];
    const indexAnt = newSelectedExpeditionAnts.findIndex((ant) => ant._id === newAnt._id);
    if (indexAnt !== -1) {
      newSelectedExpeditionAnts.splice(indexAnt, 1);
    } else {
      newSelectedExpeditionAnts.push(newAnt);
    }
    const dataSelectedAnts = this.calculateDataSelectedAnts(newSelectedExpeditionAnts, destination);
    this.setNextSubjectValue({ selectedExpeditionAnts: newSelectedExpeditionAnts, dataSelectedAnts: dataSelectedAnts });
  };

  calculateDataSelectedAnts = (selectedAnts: Ant[], destination: Destination) => {
    const bonuses = this.mapBonusObjectBasedOnPlayerAnts(destination, selectedAnts);

    const dataSelectedAnts: ExpeditionSubject['dataSelectedAnts'] = {
      worker: { quantity: 0, power: 0, bonus: bonuses.materialBonus, requirements: false },
      soldier: { quantity: 0, power: 0, bonus: bonuses.successRateBonus, requirements: false },
      flying: { quantity: 0, power: 0, bonus: bonuses.nectarBonus, requirements: false },
      requirements: false,
      totalSelectedPower: 0,
    };
    selectedAnts.forEach((ant) => {
      dataSelectedAnts[ant.type].quantity++;
      dataSelectedAnts[ant.type].power += ant.power;
      dataSelectedAnts.totalSelectedPower += ant.power;
      //dataSelectedAnts[ant.type].bonus = dataSelectedAnts[ant.type].quantity >= destination.bonus[ant.type as keyof Destination['bonus']].n;
      dataSelectedAnts[ant.type].requirements = dataSelectedAnts[ant.type].power >= destination.requirements[`${ant.type}Power`];
    });

    // Grouped Ants useCase

    if (destination.requirements.totalAntsPower && selectedAnts.length >= destination.requirements.minAnts) {
      const powerTotalByAnts = (selectedAnts as Ant[]).reduce((sum, item) => sum + item.power, 0);
      if (powerTotalByAnts >= destination.requirements.totalAntsPower) {
        Object.keys(dataSelectedAnts).forEach((element) => {
          if (dataSelectedAnts[element].hasOwnProperty('requirements')) {
            dataSelectedAnts[element].requirements = true;
          }
        });
      }
    }

    dataSelectedAnts.requirements =
      destination.enoughWareHouseCapacity &&
      (dataSelectedAnts?.worker.bonus
        ? destination.enoughWareHouseCapacityWithBonusApplied
        : destination.enoughMaterialToStart) &&
      dataSelectedAnts.worker.requirements &&
      dataSelectedAnts.soldier.requirements &&
      dataSelectedAnts.flying.requirements &&
      dataSelectedAnts.flying.power + dataSelectedAnts.soldier.power + dataSelectedAnts.worker.power >=
        this.getTotalAntsPower(destination.requirements) &&
      destination.playerOwnTheMap;
    return dataSelectedAnts;
  };

  getTotalAntsPower = (expeRequirements: Destination['requirements']) => {
    if (expeRequirements.flyingPower && expeRequirements.soldierPower && expeRequirements.workerPower) {
      // GROUPED BY TYPE (DESTINATIONS 5-10)
      return expeRequirements.flyingPower + expeRequirements.soldierPower + expeRequirements.workerPower;
    }
    return Number(expeRequirements.totalAntsPower);
  };

  getExpeditionData = async () => {
    try {
      this.setNextSubjectValue({ isLoading: true });
      const allExpeditions: Expeditions = await this.colonyRepository.getAllDestinations(this.providerProps.colonyData._id);

      //Set expedition rewards on subject
      await this.getExpeRewardsData();

      this.setPurchasedPwrTicketsValueOnSubj(this.providerProps.colonyData.purchasedPwrTickets);

      this.setNextSubjectValue({ expeditionsData: allExpeditions, isLoading: false });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  closeModal = () => {
    this.providerProps.closeModal();
  };

  resetSelection = () => {
    this.setNextSubjectValue({
      selectedExpeditionAnts: [],
      dataSelectedAnts: initDataSelectedAnts,
    });
  };

  toggleDetailDestinationModal = (destination?: Destination) => {
    this.setNextSubjectValue({
      destinationDetailSelected: destination,
      selectedExpeditionAnts: [],
      dataSelectedAnts: initDataSelectedAnts,
    });
    this.providerProps.toggleDetailDestinationModal();
  };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectExpedition.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ ...defaultDataSubjectExpedition });
  };

  startExpedition = async (
    colonyId: string,
    destination: Destination,
    idAntsSelected: number[],
    socket: SocketIOService,
    walletId: string
  ) => {
    const newUuid = uuidv4();
    try {
      this.setNextSubjectValue({ isLoading: true });
      const canStartExpedition: boolean = await this.colonyRepository.startExpedition(
        colonyId,
        destination.destinationId,
        idAntsSelected
      );

      if (typeof canStartExpedition === 'boolean' && canStartExpedition) {
        this.setLoading();
        // gen new uuid and subscribe to WS for future response
        socket.handleSocketConnection(
          socket,
          newUuid,
          async (data: any) => {
            this.setNextSubjectValue({
              isLoading: false,
              dataSelectedAnts: initDataSelectedAnts,
              resultExpedition: data.resultExpedition,
            });
          },
          (error) => {
            this.setErrorOnBloc(error);
          }
        );

        const nectarCost = destination.requirements.cost.find((cost) => cost.materialId === 0);

        await this.colonyRepository.fireStartExpeditionSC(
          walletId as Address,
          colonyId,
          destination.destinationId,
          idAntsSelected,
          newUuid,
          nectarCost ? nectarCost.quantity : 0
        );
      } else {
        // open toastr with error cannot start expedition node checked before fire metamask
        this.setNextSubjectValue({
          toastr: this.setToastrObj('error', 'expedition.cannotStart'),
          isLoading: false,
        });
      }
    } catch (error) {
      socket.closeSocket(socket, newUuid);
      this.setLoading(false);
      this.setErrorOnBloc(error);
    }
  };

  cleanResultExpedition = () => {
    this.setNextSubjectValue({
      resultExpedition: undefined,
    });
  };

  // Expeditions History Functions
  getExpeditionsHistory = async () => {
    try {
      this.setLoading();
      const allExpeditionHistory: ExpeditionHistory[] = await this.colonyRepository.getExpeditionHistory(
        this.providerProps.colonyData._id
      );
      this.setNextSubjectValue({ allExpeditionHistory: allExpeditionHistory, isLoading: false });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  toggleExpeHistoryModal = async (needToFetchData: boolean) => {
    try {
      // IF TRUE recieved by param, the player is OPENING the modal, so time to fetch
      // Expedition History DATA from MongoDB
      if (needToFetchData) {
        await this.getExpeditionsHistory();
      }
      this.setNextSubjectValue({ isExpeHistoryModalOpen: !this.getSubjectValue().isExpeHistoryModalOpen });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  toggleExpeditionRewards = async (status?: boolean, destinationId?: number) => {
    try {
      await this.getExpeditionsHistory();
      this.setNextSubjectValue({
        isExpeRewardModalOpen: status ? status : !this.getSubjectValue().isExpeRewardModalOpen,
        rewardModalDestId: !destinationId ? undefined : destinationId,
      });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  /* getRewardPacksData = async () => {
    try {
      this.setLoading();
      const expeRewardData: ExpeditionReward[] = await this.colonyRepository.getRewardPacksData(
        this.providerProps.colonyData._id
      );
      this.setNextSubjectValue({ expeRewardData: expeRewardData, isLoading: false, isExpeRewardModalOpen: true });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };*/

  getExpeRewardsData = async () => {
    try {
      const expeRewardData: ExpeditionReward[] = await this.colonyRepository.getExpeditionRewardsData(
        this.providerProps.colonyData._id
      );
      //const purchasedTickets: PurchasedPowerTicket[] = this.providerProps.colonyData.purchasedPwrTickets;
      this.setNextSubjectValue({ expeRewardData: expeRewardData });
    } catch (error) {
      this.setErrorOnBloc(error);
    }
  };

  setPurchasedPwrTicketsValueOnSubj = (purchasedPwrTickets: ExpeditionSubject['purchasedPwrTickets']) => {
    this.setNextSubjectValue({ purchasedPwrTickets: purchasedPwrTickets });
  };

  buyPack = async (
    packInfo: { num_mints: number; family: string; packToBuyId: string; colonyId: string; price: number },
    outletValue: OutletContextType
  ) => {
    const newUuid = uuidv4();
    try {
      this.setNextSubjectValue({ isLoading: true });
      const canBuyRewardPack = await this.colonyRepository.buyPack(packInfo.family, packInfo.packToBuyId, packInfo.colonyId);

      if (canBuyRewardPack) {
        outletValue.socketIOService.handleSocketConnection(
          outletValue.socketIOService,
          newUuid,
          async (data: any) => {
            this.setNextSubjectValue({
              toastr: this.setToastrObj('success', 'pack.succesfull'),
              isLoading: false,
              packRevealed: data.ants,
            });
            await this.providerProps.refreshAccountDataFn();
          },
          (error) => {
            this.setErrorOnBloc(error);
          }
        );

        await outletValue.repositoryManager
          .getWelcomePackRepository()
          .firePurchasePackToBuyBchain(packInfo, outletValue.accountData?.owner!, this.providerProps.colonyData._id, newUuid);
      } else {
        // open toastr with error cannot start expedition node checked before fire metamask
        this.setNextSubjectValue({
          toastr: this.setToastrObj('error', 'pack.ko'),
          isLoading: false,
        });
      }
    } catch (error) {
      outletValue.socketIOService.closeSocket(outletValue.socketIOService, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  buyPowerTicket = async (expeRewardId: string, ticketPrice: number, socket: SocketIOService) => {
    const newUuid = uuidv4();
    try {
      this.setNextSubjectValue({ isLoading: true });
      const canBuy = await this.colonyRepository.buyPowerTicket(expeRewardId, this.providerProps.colonyData._id);

      if (canBuy) {
        // gen new uuid and subscribe to WS for future response
        socket.handleSocketConnection(
          socket,
          newUuid,
          async (data: any) => {
            await this.providerProps.refreshColonyData();
            this.setNextSubjectValue({
              toastr: this.setToastrObj('success', 'powerTicket.succesfull'),
            });
            await this.providerProps.refreshAccountDataFn();
            await this.getExpeRewardsData();

            this.setLoading(false);
          },
          (error) => {
            this.setErrorOnBloc(error);
          }
        );

        await this.colonyRepository.fireBuyPowerTicketSC(expeRewardId, this.providerProps.colonyData._id, newUuid, ticketPrice);
      } else {
        // open toastr with error cannot start expedition node checked before fire metamask
        this.setNextSubjectValue({
          toastr: this.setToastrObj('error', 'powerTicket.buyError'),
          isLoading: false,
        });
      }
    } catch (error) {
      socket.closeSocket(socket, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  /**
   * Determines which bonuses are active based on the types and powers of ants selected for an expedition.
   *
   * @param {Expedition} expedition - The expedition object containing bonus information.
   * @param {Ant[]} desiredAnts - An array of Ant objects representing the ants selected for the expedition.
   * @returns {Object} An object containing the status of different bonuses (nectarBonus, successRateBonus, materialBonus).
   * */
  mapBonusObjectBasedOnPlayerAnts = (expedition: Destination, desiredAnts: Ant[]) => {
    // Criterial for bonuses based on Ants:
    // If certain type of ants power SUMS more than expedition.bonus[type].totalPower --> BONUS ACTIVE
    const bonuses = {
      nectarBonus: false,
      successRateBonus: false,
      materialBonus: false,
    };

    const antTypes = ['flying', 'soldier', 'worker'];
    const bonusesMap = {
      flying: 'nectarBonus',
      soldier: 'successRateBonus',
      worker: 'materialBonus',
    };

    antTypes.forEach((type) => {
      const totalPowerAntsOnExpeByType = desiredAnts
        .filter((ant) => ant.type === type)
        .reduce((accumulator, ant) => accumulator + ant.power, 0);
      if (totalPowerAntsOnExpeByType >= expedition.bonus[type as keyof Destination['bonus']].totalPower) {
        bonuses[bonusesMap[type]] = true;
      }
    });

    return bonuses;
  };

  togglePowerTicketAssigner = (powerTicket?: PurchasedPowerTicket) => {
    this.setNextSubjectValue({
      isPowerTicketAssignerModalOpen: !this.getSubjectValue().isPowerTicketAssignerModalOpen,
      powerTicketToAssign: powerTicket ? powerTicket : undefined,
    });
  };

  closeUpgradedAntModal = async () => {
    this.setNextSubjectValue({
      pwrTicketUpgradeResult: undefined,
    });

    this.setLoading();
    await this.getExpeRewardsData();
    this.setLoading(false);
  };

  getAntsOnColony = () => {
    return this.providerProps.colonyData.ants;
  };

  usePowerTicket = async (purchasedPowerTicket: PurchasedPowerTicket, ant: Ant, socket: SocketIOService) => {
    const newUuid = uuidv4();
    try {
      this.setNextSubjectValue({ isLoading: true });
      const canUseTicket = await this.colonyRepository.usePowerTicket(
        purchasedPowerTicket._id!,
        this.providerProps.colonyData._id,
        ant.tokenId!,
        false
      );

      if (canUseTicket) {
        // gen new uuid and subscribe to WS for future response
        socket.handleSocketConnection(
          socket,
          newUuid,
          async (data: any) => {
            this.togglePowerTicketAssigner();

            await this.providerProps.refreshColonyData();

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
          this.providerProps.colonyData._id,
          ant.tokenId!,
          false, //not from quest, so false
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
}
