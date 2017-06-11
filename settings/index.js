// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import Locale from './Locale';
import Plugins from './Plugins';

const pages = [
  {
    route: 'locale',
    label: 'Language and localization',
    component: Locale,
  },
  {
    route: 'plugins',
    label: 'Preferred plugins',
    component: Plugins,
  },
];

export default props => <Settings {...props} pages={pages} />;
