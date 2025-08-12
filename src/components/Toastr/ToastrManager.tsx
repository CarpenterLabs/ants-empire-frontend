import { useEffect } from 'react';
import { IntlShape } from 'react-intl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StandarToastrObjProperties, ToastrSubjectType } from './types/ToastrSubjectType';
import './styles/Toastr.scss';
// COMPONENT ZONE

export type toastrTypes = 'notify' | 'error' | 'success' | 'info' | 'warn';
export const ToastrManager = (props: {
  msg: string | JSX.Element | JSX.Element[];
  type: toastrTypes;
  autoClose?: number;
  onClose?: any;
}) => {
  const toastrClassName = 'mainToastr';
  const notify = () => {
    // default type
    return toast(props.msg, {
      className: toastrClassName,
      position: 'top-right',
      onClose: props.onClose ? props.onClose : null,
    });
  };

  const error = () => {
    // add type: 'error' to options
    return toast.error(props.msg, {
      className: toastrClassName,
      position: 'top-right',
      onClose: props.onClose ? props.onClose : null,
    });
  };

  const success = () => {
    // add type: 'success' to options
    return toast.success(props.msg, {
      className: toastrClassName,
      position: 'top-right',
      onClose: props.onClose ? props.onClose : null,
    });
  };

  const info = () => {
    // add type: 'info' to options
    return toast.info(props.msg, {
      className: toastrClassName,
      position: 'top-right',
      onClose: props.onClose ? props.onClose : null,
    });
  };

  const warn = () => {
    // add type: 'warning' to options
    return toast.warn('Warning...');
  };

  //   const clear = () => {
  //     // Remove all toasts !
  //     return toast.dismiss();
  //   };

  const generateToast = () => {
    if (props.type) {
      switch (props.type) {
        case 'notify':
          return notify();
        case 'error':
          return error();
        case 'success':
          return success();
        case 'info':
          return info();
        case 'warn':
          return warn();
        default:
          return <></>;
      }
    }
  };

  useEffect(() => {
    generateToast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // checks for changes in the values in this array

  return (
    <>
      <div>
        <ToastContainer
          position='top-right'
          autoClose={props.autoClose ? props.autoClose : 2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </>
  );
};

// END COMPONENT ZONE

// BEGIN TOASTR UTILS

// const renderHrefIfNeeded = (toastrSubjectVal: ToastrSubjectType, endedAction: keyof ToastrSubjectType) => {
//   if (toastrSubjectVal[endedAction].hrefTo) return <a href='/game/shop'>Go to Shop</a>;
// };

export const renderToastrIfNeeded = (
  toastrSubjectVal: ToastrSubjectType,
  onCloseFn: () => void,
  intl: IntlShape,
  extraJSXContent?: (endedAction: StandarToastrObjProperties) => JSX.Element
) => {
  const endedAction: keyof ToastrSubjectType | string | undefined = Object.keys(toastrSubjectVal).find(
    (key) => toastrSubjectVal[key as keyof ToastrSubjectType].show === true
  );
  if (endedAction) {
    return (
      <ToastrManager
        onClose={onCloseFn}
        msg={
          <>
            {/* {renderHrefIfNeeded(toastrSubjectVal, endedAction as keyof ToastrSubjectType)} */}
            {intl.formatMessage({ id: toastrSubjectVal[endedAction as keyof ToastrSubjectType].textId })}
            {extraJSXContent && extraJSXContent(toastrSubjectVal[endedAction as keyof ToastrSubjectType])}
          </>
        }
        type={endedAction as Partial<toastrTypes>}
      />
    );
  } else {
    return <></>;
  }
};

export const toastrObjDefValue = {
  success: {
    show: false,
    textId: '',
  },
  error: {
    show: false,
    textId: '',
  },
  warn: {
    show: false,
    textId: '',
  },
  info: {
    show: false,
    textId: '',
  },
  notify: {
    show: false,
    textId: '',
  },
};
