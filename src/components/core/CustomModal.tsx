import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Style from './styles/CustomModal.module.scss';

type ModalPropsType = {
  open: boolean;
  size?: 'sm' | 'xs' | 'md' | 'lg' | 'xl';
  title: string | JSX.Element;
  footer?: JSX.Element | JSX.Element[];
  body: JSX.Element | JSX.Element[];
  modalBodyClassName?: string;
  class?: string;
  largeHeader?: boolean;
  withoutHeader?: boolean;
  togglerModal: () => void;
  modalHeaderClassName?: string;
  centered?: boolean;
  modalFooterClassName?: string;
};

const CustomModal = (props: ModalPropsType) => {
  return (
    <Modal
      modalClassName={`${Style.CustomModal}`}
      className={`fadeIn ${props.class ?? ``}`}
      isOpen
      centered={props.centered === undefined ? true : props.centered}
      size={props.size}
    >
      {!props.withoutHeader ? (
        <ModalHeader
          className={`${props.largeHeader ? 'largeHeader' : ``}${props.modalHeaderClassName ?? ''}`}
          toggle={undefined}
        >
          {props.title}{' '}
          <img src='/images/finals/blacksmith/close_btn.png' alt='Close' onClick={props.togglerModal} className='modalCloseImg' />
        </ModalHeader>
      ) : (
        ''
      )}
      <ModalBody {...(props.modalBodyClassName && { className: props.modalBodyClassName })}>{props.body}</ModalBody>
      {props.footer ? <ModalFooter className={props.modalFooterClassName ?? ``}>{props.footer}</ModalFooter> : ''}
    </Modal>
  );
};

export default CustomModal;
