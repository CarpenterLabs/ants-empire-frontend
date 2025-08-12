import { AntSubject, defaultSubjDataAntBloc } from '../types/AntSubject';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import AntRepository from '@Repositories/AntRepository';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import SocketIOService from '@Services/SocketIOService';
import { v4 as uuidv4 } from 'uuid';
// import { Ant } from '@ComponentsRoot/Ant/types/Ant';

export default class AntBloc extends BaseBloc<AntSubject> {
  antRepository: AntRepository;
  providerProps: OutletContextType;
  constructor(props: OutletContextType) {
    super(defaultSubjDataAntBloc);
    this.providerProps = props;
    this.antRepository = props.repositoryManager.getAntRepository();
  }

  createAnts = async (socket: SocketIOService, valToMint = 1) => {
    // gen new uuid and subscribe to WS for future response
    const newUuid = uuidv4();
    try {
      this.setLoading();

      // Notify backend to start process and subscribe to the UUID
      // Listen for the specific UUID response
      socket.handleSocketConnection(
        socket,
        newUuid,
        async (data: any) => {
          this.setNextSubjectValue({ isLoading: false, toastr: this.setToastrObj('success', 'mintPage.success') });
        },
        (error) => {
          this.setErrorOnBloc(error);
        }
      );

      const res: any = await this.antRepository.generatAnts(1, newUuid);
      if (res) {
        console.log('tx hash: ' + res);
      }
    } catch (error) {
      socket.closeSocket(socket, newUuid);
      this.setErrorOnBloc(error);
    }
  };

  getPrice = async () => {
    const price = await this.antRepository.getPriceMint();
    this.setNextSubjectValue({ price: price });
  };
  // NOT USING IT AT THE MOMENT
  // showToastr = (toastrType: 'success' | 'error', msg: string) => {
  //   const prevState = this.getSubjectValue();
  //   this.setNextSubjectValue({ toastr: { ...prevState.toastr, [toastrType]: { show: true, textId: msg } } });
  // };

  resetSubjectActions = () => {
    this.setNextSubjectValue({ toastr: defaultSubjDataAntBloc.toastr });
  };

  resetBloc = () => {
    this.setNextSubjectValue({ hasError: null, isLoading: false });
  };
}
