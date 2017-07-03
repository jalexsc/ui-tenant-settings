import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import Locale from './Locale';
import Plugins from './Plugins';
import Bindings from './Bindings';

const pages = [
  {
    route: 'keys',
    label: 'Key bindings',
    component: Bindings,
  },
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

export default props => <Settings {...props} pages={pages} paneTitle="Organization" />;
