import NodeApiDS from "@DataSource/NodeApiDS";
import { IntlShape } from "react-intl";
import RepositoryManager from "../RepositoryManager";
import { OutletContextType } from "./OutletContextType";
import SocketIOService from "@Services/SocketIOService";

export declare type MainProvidersPropTypes = {
  outletContext?: OutletContextType;
};

export declare type MainGameLayoutProviderPropsType = {
  intl: IntlShape;
  nodeApiDS: NodeApiDS;
  repositoryManager: RepositoryManager;
  socketIOService: SocketIOService;
};
