import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';

import Locale from './Locale';
import Plugins from './Plugins';
import Bindings from './Bindings';
import SSOSettings from './SSOSettings';
import ShelvingLocationsSettings from './ShelvingLocationsSettings';

const pages = [
  {
    route: 'keys',
    label: 'Key bindings',
    component: Bindings,
    perm: 'ui-organization.settings.key-bindings',
  },
  {
    route: 'locale',
    label: 'Language and localization',
    component: Locale,
    perm: 'ui-organization.settings.locale',
  },
  {
    route: 'plugins',
    label: 'Preferred plugins',
    component: Plugins,
    perm: 'ui-organization.settings.plugins',
  },
  {
    route: 'ssosettings',
    label: 'SSO settings',
    component: SSOSettings,
    perm: 'ui-organization.settings.sso',
  },
  {
    route: 'shelvinglocations',
    label: 'Shelving Locations',
    component: ShelvingLocationsSettings
  },
];

export default props => <Settings {...props} pages={pages} paneTitle="Organization" />;
