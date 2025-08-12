import AuthGate from '@ComponentsRoot/core/AuthGate';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { IntlWrapper } from './IntlProvider';
import { AntsEmpireRouter } from './routes';
import { RainBowKitWrapper } from './RainBowKitWrapper';

import '@Assets/css/materialdesignicons.min.css';
import '@Assets/scss/themes.scss';

function App() {
  return (
    <RainBowKitWrapper>
      <HelmetProvider>
        <IntlWrapper>
          <AuthGate>
            <BrowserRouter>
              <React.Suspense fallback={<></>}>
                <AntsEmpireRouter />
              </React.Suspense>
            </BrowserRouter>
          </AuthGate>
        </IntlWrapper>
      </HelmetProvider>
    </RainBowKitWrapper>
  );
}

export default App;
