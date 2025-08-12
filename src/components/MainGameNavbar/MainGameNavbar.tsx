import MetamaskAntsConnectorProvider, {
  AntsWalletConnectorProviderProps,
} from '@ComponentsRoot/MetamaskAntsConnector/provider/AntsWalletConnectorProvider';
// import { IMetaMaskContext } from "metamask-react/lib/metamask-context";
import { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Collapse,
  // DropdownItem,
  // DropdownMenu,
  // DropdownToggle,
  // UncontrolledDropdown,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from 'reactstrap';
import Style from './styles/mainGameNavbar.module.scss';
// import { useNavigate } from 'react-router';
import { Link, useLocation } from 'react-router-dom';
import { Colony } from '@ComponentsRoot/Colonies/types/Colony';

interface NavItemType {
  to: string;
  label: string;
  className?: string; // ✅ optional
  isPublic?: boolean;
}

const MainGameNavbar = (props: AntsWalletConnectorProviderProps & { userColony?: Colony; layoutVariant: string | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const intl = useIntl();
  const location = useLocation();
  // const navigate = useNavigate();

  const baseNavItems: NavItemType[] = [
    { to: '/game/ant', label: intl.formatMessage({ id: 'navbar.antMint' }) },
    { to: '/game/welcome-pack', label: intl.formatMessage({ id: 'navbar.welcomePacks' }) },
    { to: '/game/shop', label: intl.formatMessage({ id: 'navbar.shop' }) },
    { to: '/game/inventory', label: intl.formatMessage({ id: 'navbar.inventario' }) },
    { to: '/game/faucet', label: intl.formatMessage({ id: 'navbar.faucet' }) },
    { to: '/game/market', label: intl.formatMessage({ id: 'navbar.market' }), isPublic: true },
  ];

  if (props.userColony) {
    baseNavItems.push({
      to: `/game/colonyStyle/${props.userColony._id}`,
      label: intl.formatMessage({ id: 'navbar.colony' }),
    });
  }

  if (props.accountDataHandlers.accountData?.dev) {
    baseNavItems.push({
      to: '/game/control-panel',
      label: intl.formatMessage({ id: 'navbar.controlPanel' }),
      className: 'dev-option',
    });
  }

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  // const handleNavigationClick = (e, destinationUrl: string) => {
  //   e.preventDefault();
  //   navigate(destinationUrl);
  // };

  const getMappedNavItems = () => {
    if (props.accountDataHandlers.accountData) {
      return baseNavItems;
    }
    return baseNavItems.filter((item) => item.isPublic);
  };

  return (
    <Navbar
      color='light'
      light
      expand='xl'
      className={`${Style.mainGameNavbar} ${props.layoutVariant === 'inColonyDetail' ? `${Style.inColony}` : ''} fadeIn`}
    >
      <NavbarBrand className='nBar' href='/'>
        Ants Empire 🐜
      </NavbarBrand>
      <NavbarToggler className='nToggler' onClick={toggle} />
      <Collapse className='nCollapser' isOpen={isOpen} navbar>
        <Nav className='ml-auto' navbar>
          {/* <NavItem>
            <NavLink tag={Link} to='/game'>
              {intl.formatMessage({ id: 'navbar.game' })}
            </NavLink>
          </NavItem> */}
          {/* <NavItem>
            <NavLink tag={Link} to='/game/account'>
              {intl.formatMessage({ id: 'navbar.account' })}
            </NavLink>
          </NavItem> */}
          {/* Es useless, no te res i ocupa al menu */}
          {/* <NavItem>
            <NavLink tag={Link} to='/game/ant'>
              {intl.formatMessage({ id: 'navbar.antMint' })}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to='/game/welcome-pack'>
              {intl.formatMessage({ id: 'navbar.welcomePacks' })}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to='/game/shop'>
              {intl.formatMessage({ id: 'navbar.shop' })}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to='/game/inventory'>
              {intl.formatMessage({ id: 'navbar.inventario' })}
            </NavLink>
          </NavItem> */}
          {/* <NavItem>
            <NavLink href='/noUrl' onClick={(e) => handleNavigationClick(e, '/game/colonies')}>
              {intl.formatMessage({ id: 'navbar.colonies' })}
            </NavLink>
          </NavItem> */}
          {/* <NavItem>
            <NavLink tag={Link} to='/game/faucet'>
              {intl.formatMessage({ id: 'navbar.faucet' })}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to='/game/market'>
              {intl.formatMessage({ id: 'navbar.market' })}
            </NavLink>
          </NavItem>
          {props.userColony && (
            <NavItem>
              <NavLink tag={Link} to={'/game/colonyStyle/' + props.userColony?._id}>
                {intl.formatMessage({ id: 'navbar.colony' })}
              </NavLink>
            </NavItem>
          )}
          {props.accountDataHandlers.accountData && props.accountDataHandlers.accountData.dev ? (
            <NavItem className='dev-option'>
              <NavLink tag={Link} to='/game/control-panel'>
                {intl.formatMessage({ id: 'navbar.controlPanel' })}
              </NavLink>
            </NavItem>
          ) : (
            ''
          )} */}

          {getMappedNavItems().map(({ to, label, className }) => {
            const isActive = location.pathname.startsWith(to); // ✅ partial matching

            return (
              <NavItem key={to} className={className} active={isActive}>
                <NavLink tag={Link} to={to}>
                  {label}
                </NavLink>
              </NavItem>
            );
          })}
        </Nav>
      </Collapse>
      <MetamaskAntsConnectorProvider
        accountDataHandlers={props.accountDataHandlers}
        mainProviderProps={props.mainProviderProps}
        signedToken={props.signedToken}
        setTokenFn={props.setTokenFn}
      />
    </Navbar>
  );
};

export default MainGameNavbar;
