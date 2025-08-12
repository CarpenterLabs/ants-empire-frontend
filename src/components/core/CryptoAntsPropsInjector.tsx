// import ConfigManager from "@MainUtils/ConfigManager";
import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { AfterLoginRedirector } from './AfterLoginRedirector';
import { OutletContextType } from './types/OutletContextType';
// import MainHelmet from './MainHelmet';

export const MainGameWrapperWithUseOutletContext = (props: any) => {
  const outletContext: OutletContextType = useOutletContext<OutletContextType>();

  const renderAfterLoginRedirector = () => {
    return (
      <AfterLoginRedirector
        cfgManager={outletContext.configManager}
        navigate={outletContext.navigate}
        location={outletContext.location}
        children={getChildMapped()}
        repositoryManager={outletContext.repositoryManager}
      />
    );
  };

  const getChildMapped = () => {
    return (
      <>        
        {React.Children.map(props.children, (child) => {
          return React.cloneElement(child, { outletContext: outletContext }, null);
        })}
      </>
    );
  };

  return renderAfterLoginRedirector();
};
