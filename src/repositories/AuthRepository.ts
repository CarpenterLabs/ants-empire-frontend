import NodeApiDS from '@DataSource/NodeApiDS';

export default class AuthRepository {
  nodeApiDS: NodeApiDS;
  constructor(nodeApiDS: NodeApiDS) {
    this.nodeApiDS = nodeApiDS;
  }

  saveTokenOnLocalStorageAndSetupHeaders = (token: string, account: string) => {
    try {
      localStorage.setItem(`wb3tkn__${account}`, token);
      //then, set token to axiosClient headers
      this.nodeApiDS.getAxiosClient().setupHeaders({ Authorization: `Bearer ${token}` });
      this.nodeApiDS.getAxiosClient().setupCurrentPlayerAddress(account);
    } catch (error) {
      throw error;
    }
  };

  deleteAuthHeaderAndPlayerAddress = () => {
    try {
      this.nodeApiDS.getAxiosClient().deleteAuthHeaderAndPlayerAddress();
    } catch (error) {
      throw error;
    }
  };
}
