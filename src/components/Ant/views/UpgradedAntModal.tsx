import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import CustomModal from '@ComponentsRoot/core/CustomModal';
import { IntlShape } from 'react-intl';
import MiniAntCardStyle from '@ComponentsRoot/WelcomePack/styles/welcomePackView.module.scss';
import AntMiniCard from '@ComponentsRoot/AntList/views/AntMiniCard';

const UpgradedAntModal = (props: { ant: Ant; intl: IntlShape; handleCloseModalFn: () => void }) => {
  const mountModalBody = () => {
    return (
      <div>
        <div className='congrats'>
          <span>{props.intl.formatMessage({ id: 'expedition.upgradedAntModalTitle' })}</span>
        </div>
        <div className='list-ants'>
          <AntMiniCard ant={props.ant} />
        </div>
      </div>
    );
  };

  const mountModalHeader = () => {
    return (
      <div>
        <div className='assignerHeader'>
          <div>{props.intl.formatMessage({ id: 'ant.antUpgraded' })}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      <CustomModal
        size={'lg'}
        body={mountModalBody()}
        open
        class={MiniAntCardStyle.listAntMiniCards}
        title={mountModalHeader()}
        togglerModal={props.handleCloseModalFn}
        modalHeaderClassName='standarModalHeader'
      />
    </>
  );
};

export default UpgradedAntModal;
