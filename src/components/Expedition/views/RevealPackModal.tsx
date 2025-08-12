import CustomModal from '@ComponentsRoot/core/CustomModal';
import { FormattedMessage, IntlShape } from 'react-intl';
import MiniAntCardStyle from '@ComponentsRoot/WelcomePack/styles/welcomePackView.module.scss';
import { Ant } from '@ComponentsRoot/Ant/types/Ant';
import AntMiniCard from '@ComponentsRoot/AntList/views/AntMiniCard';
import { Button } from 'reactstrap';
import { NavigateFunction, useNavigate } from 'react-router-dom';

const RevealPackModal = (props: {
  handleCloseModalFn: () => void;
  intl: IntlShape;
  packRevealed: Ant[];
  button?: JSX.Element;
  extraJSXOnBody?: JSX.Element;
}) => {
  const navigate: NavigateFunction = useNavigate();

  const getModalBody = () => {
    return (
      <div className={MiniAntCardStyle.listAntMiniCards}>
        {props.extraJSXOnBody ?? <></>}
        <div className='list-ants'>
          {props.packRevealed?.map((ant: Ant, key: number) => (
            <AntMiniCard ant={ant} key={key} />
          ))}
        </div>
        <div className='button-box'>
          {props.button ? (
            <>{props.button}</>
          ) : (
            <Button color='primary' onClick={() => navigate('/game/inventory')}>
              <FormattedMessage id='expedition.sendtoinventory' />
            </Button>
          )}
        </div>
      </div>
    );
  };

  return <CustomModal size={'xs'} body={getModalBody()} open title='' togglerModal={() => () => null} withoutHeader />;
};

export default RevealPackModal;
