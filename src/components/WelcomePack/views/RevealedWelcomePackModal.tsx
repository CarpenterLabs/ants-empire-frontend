import AntMiniCard from '@ComponentsRoot/AntList/views/AntMiniCard';
import { PurchasedPack } from '@ControlPanelComponents/CPanelStandard/types/Cache';
import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';
import MiniAntCardStyle from '@ComponentsRoot/WelcomePack/styles/welcomePackView.module.scss';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import SocketIOService from '@Services/SocketIOService';
import { OutletContextType } from '@ComponentsRoot/core/types/OutletContextType';

type RevealedPackModalProps = {
  pack: PurchasedPack;
  resolveWelcomePackFn: (
    pack: Pick<PurchasedPack, 'family' | 'packToBuyId'>,
    redirectToInventory: () => void,
    socket: SocketIOService
  ) => Promise<void>;
  togglerRevealedWelcomePackModalFn: () => void;
  togglerOtherPacksFn: () => void;
};

const RevealedPackModal = (props: RevealedPackModalProps) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();
  const navigate = useNavigate();

  const getModalBody = () => {
    return (
      <div className={MiniAntCardStyle.listAntMiniCards}>
        <div className='list-ants'>
          {props.pack.ants.map((ant: Ant, key: number) => (
            <AntMiniCard ant={ant} key={key} />
          ))}
        </div>
        <p className={MiniAntCardStyle.subtitle}>
          <FormattedMessage id='pack.disclaimer' />
        </p>
      </div>
    );
  };

  const renderRevealedModalButtons = () => {
    const pack = {
      family: props.pack.family,
      packToBuyId: props.pack.packToBuyId,
    };
    return (
      <>
        <Button
          color='primary'
          onClick={async () =>
            await props.resolveWelcomePackFn(pack, () => navigate('/game/inventory'), outletContext.socketIOService)
          }
        >
          <FormattedMessage id='pack.resolve' />
        </Button>
        <Button color='warning' style={{ color: 'white' }} onClick={() => props.togglerOtherPacksFn()}>
          <FormattedMessage id='pack.otherpacks' />
        </Button>
      </>
    );
  };

  return (
    <CustomModal
      open={true}
      size='lg'
      title={props.pack.title}
      footer={renderRevealedModalButtons()}
      togglerModal={props.togglerRevealedWelcomePackModalFn}
      body={getModalBody()}
    />
  );
};
export default RevealedPackModal;
