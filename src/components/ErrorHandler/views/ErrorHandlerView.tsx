// import ModalProvider from '@ComponentsRoot/Modal/provider/ModalProvider';
import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';
import { Button } from 'reactstrap';
import ErrorHandlerBloc from '../bloc/ErrorHandlerBloc';
import '../styles/ErrorHandler.scss';
import { ErrView500 } from './ErrView500';

class ErrorHandlerView extends PureComponent<{ intl: IntlShape; data: any; bloc: ErrorHandlerBloc }, any> {
  isAnAxiosErrorWithoutResponse = (): boolean => {
    return this.props.data.response === undefined && this.props.data.isAxiosError === true;
  };
 
  getErrors = (): JSX.Element => {
    if (this.isAnAxiosErrorWithoutResponse()) {
      //unknown backend error, no connection maybe
      return <ErrView500 />;
    }
    return this.props.data.response.data.errors.map((err: any) => <p>{err.message}</p>);
  };

  render() {
    return (
      <>
        <div className={`animated fadeIn refresh-block}`}>
          <Button
            block
            onClick={this.props.bloc.retryFn}
            className={`${this.isAnAxiosErrorWithoutResponse() ? 'position-absolute' : ''} refreshBtnOnError`}
            variant='ghost'
            color='primary'
          >
            <FormattedMessage id='general.actualizar' defaultMessage='Refresh Component' />
          </Button>
          {this.getErrors()}
        </div>
      </>
    );
  }
}

export default injectIntl(ErrorHandlerView);
