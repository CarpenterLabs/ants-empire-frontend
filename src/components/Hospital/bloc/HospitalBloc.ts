import { HospitalSubject, InitialHospitalData, defaultDataSubjectHospital } from '../types/HospitalSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { HospitalProviderPropsType } from '../providers/HospitalProvider';
import ColonyRepository from '@Repositories/ColonyRepository';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';
import { antsRestored } from '../types/AntRestored';
import { differenceObj } from '@ComponentsRoot/core/CryptoAntsUtils';
import { Hospital, RestorePackToBuy } from '@ComponentsRoot/Colony/types/RoomType';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import SocketIOService from '@Services/SocketIOService';
import { v4 as uuidv4 } from 'uuid';

export default class HospitalBloc extends BaseBloc<HospitalSubject> {
  providerProps: HospitalProviderPropsType;
  colonyRepository: ColonyRepository;

  constructor(props: HospitalProviderPropsType) {
    super(defaultDataSubjectHospital);
    this.providerProps = props;
    this.colonyRepository = props.colonyRepository;
  }

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultDataSubjectHospital.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ ...defaultDataSubjectHospital });
  };

  resetHospital = (initialHospitalData: any) => {
    this.setNextSubjectValue({ ...initialHospitalData });
  };

  closeModal = (initialHospitalData: any) => {
    this.providerProps.closeModal();
    this.resetHospital(initialHospitalData);
  };

  changeUsedTimesValue = (currentAnt: Ant, newUsedTimeValue: number, originalAnt: Ant, currentPool: number, colony: Colony) => {
    const prevState = this.getSubjectValue();
    const prevAnts = [...prevState.antsAvailableOnHospital];
    const antIndex = prevAnts.findIndex((antSelected) => antSelected._id === currentAnt._id);

    if (antIndex !== -1) {
      let calculatedUsedtimes = prevAnts[antIndex].usedtimes;
      let calculatedCurrentPool = currentPool;
      if (newUsedTimeValue <= currentAnt.max_usedtimes && newUsedTimeValue >= originalAnt.usedtimes) {
        // valor que tendra que operarse sobre la pool
        const valueForApplyOnPool = newUsedTimeValue - currentAnt.usedtimes;
        if (valueForApplyOnPool <= currentPool) {
          // usedTime por debajo del maximo
          calculatedUsedtimes = newUsedTimeValue;
          calculatedCurrentPool = currentPool - valueForApplyOnPool;
        }
      }

      const updatedAnt = { ...prevAnts[antIndex], usedtimes: calculatedUsedtimes };
      prevAnts[antIndex] = updatedAnt;
      const calculateDifference = this.checkDifference(prevAnts, colony);
      this.setNextSubjectValue({
        antsAvailableOnHospital: prevAnts,
        currentPool: calculatedCurrentPool,
        buttonCureIsDisabled: calculateDifference,
      });
    }
  };

  checkDifference = (antsAvailableOnHospital: Ant[], colonyData: Colony) => {
    for (const ant of antsAvailableOnHospital) {
      const antColonySelected = colonyData.ants.find((antColony) => antColony._id === ant._id);
      const diff = differenceObj(ant, antColonySelected);
      if (Object.keys(diff).length > 0) {
        return false;
      }
    }
    return true;
  };

  setHospitalAntsAndPool = (colony: Colony, hospital: Hospital) => {
    const rarityOrder = ['common', 'rare', 'epic', 'legendary'];
    const antsAvailables = colony.ants.sort((a, b) => rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity));
    const initialHospitalData: InitialHospitalData = {
      antsAvailableOnHospital: antsAvailables,
      currentPool: hospital.healPool,
      buttonCureIsDisabled: true,
    };
    this.setNextSubjectValue({ initialHospitalData, ...initialHospitalData });
  };

  prepareStructureToMongo = (antsToRestore: Ant[], colony: Colony) => {
    const structureToMongo: any = {
      colonyId: colony._id,
      antsRestored: [],
    };
    antsToRestore.forEach((antRestore) => {
      const antColony = colony.ants.find((antColony) => antColony._id === antRestore._id);
      if (antRestore.usedtimes !== antColony!.usedtimes) {
        structureToMongo.antsRestored.push({
          _id: antRestore._id,
          restore_usedtimes: antRestore.usedtimes - antColony!.usedtimes,
        });
      }
    });
    return structureToMongo;
  };

  restoreUsedTimes = async (antsToRestore: Ant[], colony: Colony) => {
    const prepareStructureToMongo: antsRestored = this.prepareStructureToMongo(antsToRestore, colony);
    await this.providerProps.restoreUsedTimes(prepareStructureToMongo);
    this.setNextSubjectValue({ antsAvailableOnHospital: [], currentPool: 0 });
  };

  buyRestorePack = async (packHPSelected: RestorePackToBuy, colonyId: string, outletContext: OutletContextType) => {
    this.setLoading();
    const colonyData = await this.providerProps.colonyRepository.getColonyDetail(colonyId);
    const HPPrice = packHPSelected.priceWithDiscountApplied ? packHPSelected.priceWithDiscountApplied : packHPSelected.price;
    await this.fireBuyRestorePack(
      colonyData._id,
      packHPSelected.pack_id,
      String(HPPrice),
      outletContext.socketIOService
    );
    return;
  };

  fireBuyRestorePack = async (
    colonyId: string,
    restorePackId: number,
    HPPrice: string,
    socket: SocketIOService
  ) => {
    const socketHPPackUuid = uuidv4();
    try {
      // Notify backend to start process and subscribe to the UUID
      // Listen for the specific UUID response
      socket.handleSocketConnection(
        socket,
        socketHPPackUuid,
        async (data: any) => {
          await this.onHPPackAdded();
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );
      
      await this.colonyRepository.buyHPPackOnSC(colonyId, HPPrice, restorePackId, socketHPPackUuid);
    } catch (error) {
      console.error('Error during HP Pack purchase:', error);
      socket.closeSocket(socket, socketHPPackUuid);
      this.setLoading(false);
    }
  };

  onHPPackAdded = async () => {
    await this.providerProps.refreshColonyData();
    this.setNextSubjectValue({
      toastr: this.setToastrObj('success', 'pack.succesfull'),
      isLoading: false,
    });
    //}
  };
}
