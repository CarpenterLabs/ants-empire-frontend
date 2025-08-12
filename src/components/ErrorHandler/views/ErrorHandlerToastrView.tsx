// import ModalProvider from '@ComponentsRoot/Modal/provider/ModalProvider';
// import { FormattedMessage } from 'react-intl';
// import { Button } from 'reactstrap';
import ErrorHandlerBloc from '../bloc/ErrorHandlerBloc';
import '../styles/ErrorHandler.scss';
// import { ErrView500 } from './ErrView500';
import { ToastrManager, toastrTypes } from '@ComponentsRoot/Toastr/ToastrManager';
import { ErrView500 } from './ErrView500';
import { useIntl } from 'react-intl';
import { useOutletContext } from 'react-router-dom';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';
import { useEffect } from 'react';

export type ErrorHandlerToastrViewPropsType = { data: any; bloc: ErrorHandlerBloc };

export default function ErrorHandlerToastrView(props: ErrorHandlerToastrViewPropsType) {
  const context = useOutletContext<OutletContextType>();

  useEffect(() => {
    // Si es una subruta quien ha generado el componente de error, tendremos context, ya que estaremos
    // dentro del OutletContext, SINO se ignifica que lo estamos recibiendo el GameLayoutProvider
    if (context) {
      props.bloc.checkIfTokenExpiredError(props, context.clearUserSignedToken);
    } else if (props.bloc.props.clearUserSignedToken) {
      props.bloc.checkIfTokenExpiredError(props, props.bloc.props.clearUserSignedToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const intl = useIntl();
  const getErrors = (): JSX.Element => {
    if (props.data && props.data.abi && props.data.contractAddress && props.data.shortMessage) {
      return (
        <>
          <span>{props.data.shortMessage}</span>
          <span>{props.data.details}</span>
        </>
      );
    }

    return (
      <>
        {props.data.response.data.errors.map((err: any, key) => {
          if (err.code) {
            return <span key={key}>{intl.formatMessage({ id: err.code })}</span>;
          } else {
            return <span key={key}>{err.message}</span>;
          }
        })}
      </>
    );
  };

  const getJSXBasedOnErrorType = () => {
    if (props.bloc.isAnAxiosErrorWithoutResponse(props)) {
      //unknown backend error, no connection maybe, so full screen error page
      return <ErrView500 />;
    } else if (props.data.canRender) {
      return <ToastrManager onClose={props.bloc.retryFn} msg={getErrors()} type={'error' as Partial<toastrTypes>} />;
    } else {
      return <></>;
    }
  };

  return <>{getJSXBasedOnErrorType()}</>;
}
