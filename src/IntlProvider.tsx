import React from 'react';
import { IntlProvider } from 'react-intl';
import messages_en from './i18n/en.json';

const msgs: any = {
  en: messages_en,
};

export const IntlWrapper = (props: any) => {
  return (
    <IntlProvider
      messages={msgs['en']}
      locale={'en'}
      defaultLocale='en'
      onError={(error) => {
        if (error?.code === 'MISSING_TRANSLATION' && error.descriptor) {
          console.info(`${error.code} --> ${error.descriptor.id}`);
        }
      }}
    >
      {props.children}
    </IntlProvider>
  );
};
