import { Colony } from "@ComponentsRoot/Colonies/types/Colony";
import { AccountEntity } from "@ComponentsRoot/MetamaskAntsConnector/entity/AccountData";

export type MainGameLayoutSubject = {
  isLoading: boolean;
  isMainMenuOpen: boolean;
  userSignedToken: string | null,
  accountData: AccountEntity | null,
  userColony?: Colony;
  hasError: null | any;
};
