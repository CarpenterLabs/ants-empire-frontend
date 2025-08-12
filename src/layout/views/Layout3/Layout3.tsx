import { Button } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import '@Assets/scss/themes.scss';
import MainHelmet from '@ComponentsRoot/core/MainHelmet';
import { IntlShape } from 'react-intl';
import ConfigManager from '@ComponentsRoot/core/ConfigManager';

const Layout3 = (props: { intl: IntlShape; configManager: ConfigManager }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <MainHelmet intl={props.intl} cfgManager={props.configManager} currentRoute={location.pathname} />
      <div className='text-center pt-3'>
        <Button onClick={() => navigate('/game/')}>Go to Game</Button>
      </div>
    </>
  );
};
export default Layout3;
