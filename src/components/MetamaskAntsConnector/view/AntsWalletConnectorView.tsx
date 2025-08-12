// import { useEthersSigner } from '@ComponentsRoot/core/WalletClientToSigner';
import ConfigManager from '@ComponentsRoot/core/ConfigManager';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { watchAccount } from '@wagmi/core';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Button, Col, Row } from 'reactstrap';
import { useAccount } from 'wagmi';
import MetamaskAntsConnectorBloc from '../bloc/MetamaskAntsConnectorBloc';
import { AccountEntity } from '../entity/AccountData';
import '../styles/MetamaskAntsConnector.scss';
import { MetamaskAntsConnectorSubject } from '../types/MetamaskAntsConnectorSubject';
// import { bscTestnet } from 'viem/chains';
import { localChainHome, wagmiProviderConfigLast } from '@ComponentsRoot/core/blockchain/wagmiConfig';
import { Address } from 'viem';
import { useLocation } from 'react-router-dom';

export type SignerCryptoAnts = (msg: string) => PromiseLike<string>;

export default function AntsWalletConnectorView(props: {
  subjectData: MetamaskAntsConnectorSubject;
  bloc: MetamaskAntsConnectorBloc;
  accountData: AccountEntity | null;
}) {
  const { isConnected, address, chain } = useAccount();
  // const { signMessageAsync } = useSignMessage();
  const intl = useIntl();

  // FUTURE FOR BUSD BALANCE
  // const { data, isError, isLoading } = useBalance({
  //   address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  // });

  // MAIN useEffect
  useEffect(() => {
    if (isConnected && address && chain) {
      if (chain && chain.id === localChainHome.id && !props.subjectData.needToSignContract) {
        // estamos en testnet polygon, por lo que procedemos setear su firma
        props.bloc.performSignTokenFlowNew(address);

        watchAccount(wagmiProviderConfigLast, {
          onChange(account, prevAccount) {
            // IF account changes, we need to clear the signed Contract to force user to sign again
            // That way the page can be refreshed

            if (account.address !== prevAccount.address) {
              console.log('account/address NEW changed', account.address);
              console.log('prev changed', prevAccount.address);
              props.bloc.clearContractToSignNewOne();
              props.bloc.providerProps.accountDataHandlers.clearUserSignedToken();
              // console.log('Account changed!', account);
            }
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, chain]);

  useEffect(() => {
    (async () => {
      if (props.accountData !== null) {
        await props.bloc.getNectarBalance(props.accountData.owner as Address);
        await props.bloc.getUSDTBalance(props.accountData.owner as Address);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.accountData]);

  const getAccountDataInfo = () => {
    if (props.accountData !== null) {
      return (
        <>
          <div className='accountInf'>
            <span className='busd-box fadeIn'>
              <img alt='usdt Logo' style={{ width: '20px' }} src={`/images/tether-usdt-logo.png`} />{' '}
              {props.subjectData.usdtBalanceOnChain}
            </span>
            <span className='nectar-box fadeIn'>
              <img alt='Nectar Logo' className='nectarImg' src={`/images/finals/icons/nectar.png`} />{' '}
              {props.subjectData.nectarBalanceOnChain}
            </span>
          </div>
        </>
      );
    }
    return <></>;
  };

  const renderWithConditions = () => {
    if (isConnected && chain && chain.id === localChainHome.id) {
      if (props.subjectData.needToSignContract) {
        return (
          <Button
            className='signContractBtn'
            disabled={props.subjectData.isLoading}
            onClick={async () => await props.bloc.signMessageTypedUseCase(address as string)}
          >
            {intl.formatMessage({ id: 'general.signContract' })}
          </Button>
        );
      }
    }

    return (
      <div className='chainAndAccountZone'>
        <ConnectButton
          accountStatus={{
            smallScreen: 'address',
            largeScreen: 'address',
          }}
          chainStatus={{
            smallScreen: 'none',
            largeScreen: 'icon',
          }}
          // chainStatus='icon'
          showBalance={false}
        />
        {getAccountDataInfo()}
      </div>
    );
  };

  return renderWithConditions();
}

//  BEGIN WRAPPER REGION

type MetaMaskAntsWrapperPropsType = {
  cfgManager: ConfigManager;
  signedToken: string | null;
} & any;

export const MetaMaskAntsWrapper = (props: MetaMaskAntsWrapperPropsType) => {
  const { isConnected, address } = useAccount();
  const { chain } = useAccount();
  const location = useLocation();

   const isUserLogged = (): boolean => {
    return (
      props.accountData !== null &&
      props.signedToken !== null &&
      isConnected &&
      !!address &&
      props.cfgManager.isRightChainIdSelected(chain ? chain.id : null)
    );
  };

  /** Market route bypass */
  const isMarketRoute = location.pathname.includes('/market');

  // if (
  //   props.accountData === null ||
  //   props.signedToken === null ||
  //   !isConnected ||
  //   !address ||
  //   !props.cfgManager.isRightChainIdSelected(chain ? chain.id : null)
  // ) {
  //   return (
  //     <Row>
  //       <Col>
  //         <span className='noLogedZone'>Connect your wallet</span>
  //       </Col>
  //     </Row>
  //   );
  // } else {
  //   return props.children;
  // }

   if (!isUserLogged() && !isMarketRoute) {
    return (
      <Row>
        <Col>
          <span className="noLogedZone">Connect your wallet</span>
        </Col>
      </Row>
    );
  }

  return props.children;
};
