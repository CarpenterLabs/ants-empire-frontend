import AccountRepository from '@Repositories/AccountRepository';
import AxiosClient from '@Services/AxiosClient';
import { AxiosError, AxiosResponse } from 'axios';
declare type apiMethodsTypes = 'get' | 'post' | 'del' | 'put';
export default class NodeApiDS {
  axiosClient: AxiosClient;
  accountRepo: AccountRepository | null = null;

  constructor(axiosClient: AxiosClient) {
    this.axiosClient = axiosClient;
  }

  setAccountRepo = (accountRepo: AccountRepository) => {
    this.accountRepo = accountRepo;
  };

  callApi = async (
    endpoint: string,
    method: keyof AxiosClient & apiMethodsTypes,
    body?: any
  ): Promise<AxiosResponse<any, any>> => {
    try {
      return await this.axiosClient[method](endpoint, body);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        //call async to refresh the token and then set it to the NodeAPIDS headers before call again
        console.warn('401 Unauthorized. Refreshing token...');
        if (error.response.data.errors.some((err) => err.message.includes('Token expired'))) {
          //call accountrepo from here
          await this.accountRepo!.refreshToken(this.axiosClient.getCurrentPlayerAddress());
        }

        try {
          // Retry the same API call
          return await this.axiosClient[method](endpoint, body);
        } catch (retryError) {
          throw retryError; // Throw error if the retry also fails
        }
      }
      throw error;
    }
  };

  getAxiosClient = () => {
    return this.axiosClient;
  };
}
