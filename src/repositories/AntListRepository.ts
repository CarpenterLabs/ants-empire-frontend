import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import NodeApiDS from '@DataSource/NodeApiDS';

export default class AntListRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  getListAnts = async (): Promise<Ant[]> => {
    try {
      const res:Ant[] = (await this.nodeApiDS.callApi('ant/bywallet', 'get')).data;
      return res;
    } catch (error) {
      throw error;
    }
  };
}
