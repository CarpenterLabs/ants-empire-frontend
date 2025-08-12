import MainGameLayoutBloc from "@ComponentsRoot/Game/bloc/MainGameLayoutBloc";

export type ErrorHandlerEntity = {
  retryFn: () => void;
  isOpenActionModal: any;
  clearUserSignedToken?: MainGameLayoutBloc["clearUserSignedToken"];
};
