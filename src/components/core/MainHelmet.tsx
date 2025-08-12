import { Helmet } from 'react-helmet-async';
import { IntlShape, useIntl } from 'react-intl';
import ConfigManager from './ConfigManager';

const MainHelmet = (props: { currentRoute: string; cfgManager: ConfigManager; intl: IntlShape }) => {
  const getTitleAndDescByRoute = () => {
    const routesRel = props.cfgManager.getHelmetConfigByRoutes(props.intl);
    let infoByRoute;
    if (props.currentRoute.includes('/colony/')) {
      infoByRoute = routesRel.find((route) => route.path === '/game/colony/:id');
    } else {
      infoByRoute = routesRel.find((route) => route.path === props.currentRoute);
    }

    if (infoByRoute) {
      const { title, description } = infoByRoute!.hemletCfg;
      if (infoByRoute) {
        return { title, description };
      }
    }

    return { title: 'Main mio', description: 'not found' };
  };
  const intl = useIntl();
  return (
    <Helmet titleTemplate={intl.formatMessage({ id: 'meta.default.titleTemplate' })}>
      <title>{getTitleAndDescByRoute().title}</title>
      <meta name='description' content={getTitleAndDescByRoute().description} />
    </Helmet>
  );
};

export default MainHelmet;
