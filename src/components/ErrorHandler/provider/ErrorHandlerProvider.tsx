import CryptoAntsBlocBuilder from '@ComponentsRoot/core/CryptoAntsBlocBuilder';
import FallbackLoader from '@Layout/components/FallbackLoader';
import React, { PureComponent } from 'react';
import ErrorHandlerBloc from '../bloc/ErrorHandlerBloc';
import { ErrorHandlerEntity } from '../entity/ErrorHandlerEntity';
import ErrorHandlerToastrView from '../views/ErrorHandlerToastrView';

export default class ErrorHandlerProvider extends PureComponent<ErrorHandlerEntity, any> {
  private readonly bloc: ErrorHandlerBloc;

  constructor(props: any) {
    super(props);
    this.bloc = new ErrorHandlerBloc(this.props);
  }

  handleSnapshotChange = (snapshot: any): JSX.Element => {
    if (snapshot.data && snapshot.data.hasError === undefined) {
      return <ErrorHandlerToastrView data={snapshot.data} bloc={this.bloc} />;
    } else if (snapshot.data && snapshot.data.hasError !== null && snapshot.connectionState !== -1) {
      return <ErrorHandlerProvider retryFn={() => {}} {...snapshot.data.hasError} />;
    } else {
      return <FallbackLoader />;
    }
  };

  render() {
    return <CryptoAntsBlocBuilder subject={this.bloc.getErrorHandlerSubject()} builder={this.handleSnapshotChange} />;
  }
}

export const renderMainErrorHandler = (snapshot, resetBlocFn: () => void) => {
  return <ErrorHandlerProvider retryFn={resetBlocFn} {...snapshot.data.hasError} />;
};
