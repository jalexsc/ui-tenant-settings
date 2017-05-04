// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import Locale from './Locale';

const pages = [
  {
    route: 'locale',
    label: 'Language and localization',
    component: Locale,
  },
];

export default props => <Settings {...props} pages={pages} />;
