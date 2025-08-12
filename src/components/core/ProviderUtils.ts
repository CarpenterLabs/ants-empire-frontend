import { MainProvidersPropTypes } from './types/MainProvidersPropTypes';
import { OutletContextType } from './types/OutletContextType';

export const checkIfHaveToUpdateProviderPropsOnBloc = (prevProps: MainProvidersPropTypes, providerCtx: any) => {
  if (prevProps.outletContext?.accountData !== providerCtx.props.outletContext?.accountData) {
    providerCtx.bloc.providerProps = providerCtx.props.outletContext as OutletContextType;
  }
};

export const componentDidUpdateProviderUtils = (prevProps: MainProvidersPropTypes, prevState: any, providerCtx: any) => {
  checkIfHaveToUpdateProviderPropsOnBloc(prevProps, providerCtx);
};
