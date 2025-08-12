import { FormattedMessage } from 'react-intl';
import { Button } from 'reactstrap';

const AccountView = (props: any) => {
  return (
    <>
      <p>
        <FormattedMessage id='account.title' />
      </p>
      <Button onClick={() => props.bloc.providerProps.navigate('/game/ant')}>
        <FormattedMessage id='account.goToMint' />
      </Button>
    </>
  );
};

export default AccountView;
