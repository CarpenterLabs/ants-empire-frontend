import ConfigManager from '@ComponentsRoot/core/ConfigManager';
import axios from 'axios';

export default class AxiosClient {
  private headers: object;
  private cfgManager: ConfigManager;
  private readonly urlBase: string;
  currentPlayerAddress: string | null = null;

  constructor(cfgManager: ConfigManager) {
    this.headers = { reactsecrettoken: import.meta.env.VITE_NOT_SECRET_REACTO_TOKEN as string };
    this.cfgManager = cfgManager;
    this.urlBase = this.cfgManager.getApiEndpointByEnvironment();
  }

  setupHeaders = (headers: any) => {
    this.headers = { ...this.headers, ...headers };
  };

  setupCurrentPlayerAddress = (playerAddress: string) => {
    this.currentPlayerAddress = playerAddress;
  };

  getCurrentPlayerAddress = () => {
    return this.currentPlayerAddress as string;
  };

  deleteAuthHeaderAndPlayerAddress = ()=>{
    delete this.headers['Authorization'];
    this.currentPlayerAddress = null;
  }

  // private readonly urlBase: string = this.cfgManager.getApiEndpointByEnvironment();

  /**
   * @param {string}  url url a la cual consultar
   * esta funcion detecta si es una nueva url base (comienza con http:// o https://).
   * en caso de ser asi, retorna la url. en caso contrario, se asume que es un fragmento
   * de path por lo que se concatena con la constante urlBase
   **/
  readUrl = (url = '') => (url.startsWith('http://') || url.startsWith('https://') ? url : `${this.urlBase}/${url}`);

  get = async (url = '', headers = this.headers) =>
    await axios.get(this.readUrl(url), {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    });

  post = async (url = '', body = {}, headers = this.headers) =>
    await axios.post(this.readUrl(url), body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    });

  put = async (url = '', body = {}, headers = this.headers) =>
    await axios.put(this.readUrl(url), body, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    });

  del = async (url = '', headers = this.headers) =>
    await axios.delete(this.readUrl(url), {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    });
}
