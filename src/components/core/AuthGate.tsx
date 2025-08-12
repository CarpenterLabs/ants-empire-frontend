import React from 'react';

export type AuthGateContextType = {
  cryptoAntsApiDS?: any; //HAVE TO BE --> cryptoAntsApiDS;
};

const AuthGateContext = React.createContext<AuthGateContextType>({} as AuthGateContextType);

const AuthGate = (props: any) => {
  return <>{props.children}</>;
};

export { AuthGateContext };

export default AuthGate;
