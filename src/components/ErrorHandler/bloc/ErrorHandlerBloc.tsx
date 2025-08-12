import * as rxjs from 'rxjs';
import { ErrorHandlerEntity } from '../entity/ErrorHandlerEntity';
import { ErrorHandlerToastrViewPropsType } from '../views/ErrorHandlerToastrView';
import MainGameLayoutBloc from '@ComponentsRoot/Game/bloc/MainGameLayoutBloc';
import BaseBloc from '@ComponentsRoot/core/BaseBloc';
import { AxiosResponse } from 'axios';

class ErrorHandlerBloc extends BaseBloc<ErrorHandlerEntity & { canRender: boolean }> {
  // data: ErrorHandlerEntity & { canRender: boolean };
  // errorHandlerSubject: rxjs.BehaviorSubject<ErrorHandlerEntity & { canRender: boolean }>;
  props: ErrorHandlerEntity;

  constructor(props: ErrorHandlerEntity) {
    super(Object.assign({ retryFn: props.retryFn }, { canRender: false, ...props }));

    this.props = props;
    // this.data = Object.assign({ retryFn: props.retryFn }, props);
    // this.errorHandlerSubject = new rxjs.BehaviorSubject(Object.assign(this.data, { canRender: false }));
  }

  getErrorHandlerSubject = (): rxjs.Observable<any> => {
    return this.subject.asObservable();
  };

  retryFn = () => {
    this.data.retryFn();
  };

  isAnAxiosErrorWithoutResponse = (props: ErrorHandlerToastrViewPropsType): boolean => {
    return (
      props.data.response === undefined &&
      (props.data.isAxiosError === true || (props.data.name === 'AxiosError' && props.data.message === 'Network Error'))
    );
  };

  checkIfTokenExpiredError = (
    props: ErrorHandlerToastrViewPropsType,
    clearSignedTknFn: MainGameLayoutBloc['clearUserSignedToken']
  ) => {
    const isTokenExpiredError = isExpiredTokenFromAxiosResponse(props.data.response);
    if (isTokenExpiredError) {
      clearSignedTknFn();
    } else {
      this.setNextSubjectValue({ canRender: true });
    }
  };
}

export const isExpiredTokenFromAxiosResponse = (axiosResponse: AxiosResponse) => {
  if (!axiosResponse) return false;

  // if the token is expired, call MainGameBloc to set subject variable
  // "signedToken" to null, because token/Contract is expired
  const isTokenExpiredError =
    axiosResponse.status === 401 &&
    axiosResponse.data.errors?.filter((err) => err.message.includes('Session expired')).length > 0;

  return isTokenExpiredError;
};

export default ErrorHandlerBloc;
