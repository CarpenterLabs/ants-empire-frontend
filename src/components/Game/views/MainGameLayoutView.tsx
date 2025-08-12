import MainGameNavbar from '@ComponentsRoot/MainGameNavbar/MainGameNavbar';
import { MetaMaskAntsWrapper } from '@ComponentsRoot/MetamaskAntsConnector/view/AntsWalletConnectorView';
import ConfigManager from '@ComponentsRoot/core/ConfigManager';
import { AntsLoader, renderLoaderIfNeeded } from '@Layout/components/AntsLoader';
import { Suspense, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import MainGameLayoutBloc from '../bloc/MainGameLayoutBloc';
import '../styles/MainGameLayout.scss';
import { MainGameLayoutSubject } from '../types/MainGameLayoutSubjectType';
import Fireflies from './Fireflies';
import SandParticles from './SandParticles';

export default function MainGameLayoutView(props: { bloc: MainGameLayoutBloc; nodeApiDS: any; data: MainGameLayoutSubject }) {
  // Main hooks declarations
  const location = useLocation();
  const navigate = useNavigate();
  const cfgManager = new ConfigManager();
  const [layoutVariant, setLayoutVariant] = useState<string | null>(null);
  console.log(layoutVariant);

  return (
    <div className='app'>    
      <Fireflies quantity={15} visible={layoutVariant === 'inColonyDetail'} />    
      <SandParticles visible={layoutVariant !== 'inColonyDetail'} />
      <main className='main'>
        <MainGameNavbar
          accountDataHandlers={{
            accountData: props.data.accountData,
            refreshAccountData: props.bloc.setAccountData,
            clearUserSignedToken: props.bloc.clearUserSignedToken,
          }}
          mainProviderProps={props.bloc.providerProps}
          signedToken={props.data.userSignedToken}
          setTokenFn={props.bloc.setUserSignedToken}
          layoutVariant={layoutVariant}
          userColony={props.data.userColony}
        />

        <Row className={`mainAppRow ${layoutVariant === 'inColonyDetail' ? 'insideColonyDetail' : ''}`}>
          <Col xs='12'>
            <MetaMaskAntsWrapper
              accountData={props.data.accountData}
              cfgManager={props.bloc.configManager}
              signedToken={props.data.userSignedToken}
            >
              <>
                <Row className={`mainGameContainer ${layoutVariant === 'inColonyDetail' ? 'insideColonyDetail' : ''}`}>
                  <Col xs='12'>
                    <Suspense fallback={<AntsLoader />}>
                      <Outlet
                        context={{
                          ...props.bloc.providerProps,
                          accountData: props.data.accountData,
                          refreshAccountDataFn: props.bloc.setAccountData,
                          clearUserSignedToken: props.bloc.clearUserSignedToken,
                          configManager: cfgManager,
                          location: location,
                          navigate: navigate,
                          socketIOService: props.bloc.providerProps.socketIOService,
                          setLayoutVariant,
                        }}
                      />
                    </Suspense>
                  </Col>
                </Row>
              </>
            </MetaMaskAntsWrapper>
            {renderLoaderIfNeeded(props.data.isLoading)}
          </Col>
        </Row>

      </main>
    </div>
  );
}
