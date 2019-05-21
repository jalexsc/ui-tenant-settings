import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesShape } from '@folio/stripes/core';

import Addresses from './Addresses';
import Locale from './Locale';
import Plugins from './Plugins';
import Bindings from './Bindings';
import SSOSettings from './SSOSettings';
import LocationCampuses from './LocationCampuses';
import LocationInstitutions from './LocationInstitutions';
import LocationLibraries from './LocationLibraries';
import LocationLocations from './LocationLocations';
import ServicePoints from './ServicePoints';

class Organization extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
  }

  constructor(props) {
    super(props);

    this.sections = [
      {
        label: <FormattedMessage id="ui-tenant-settings.settings.general.label" />,
        pages: [
          {
            route: 'addresses',
            label: <FormattedMessage id="ui-tenant-settings.settings.addresses.label" />,
            component: Addresses,
            perm: 'ui-tenant-settings.settings.addresses',
          },
          {
            route: 'keys',
            label: <FormattedMessage id="ui-tenant-settings.settings.bindings.label" />,
            component: Bindings,
            perm: 'ui-tenant-settings.settings.key-bindings',
          },
          {
            route: 'locale',
            label: <FormattedMessage id="ui-tenant-settings.settings.language.label" />,
            component: Locale,
            perm: 'ui-tenant-settings.settings.locale',
          },
          {
            route: 'plugins',
            label: <FormattedMessage id="ui-tenant-settings.settings.plugins.label" />,
            component: Plugins,
            perm: 'ui-tenant-settings.settings.plugins',
          },
          {
            route: 'ssosettings',
            label: <FormattedMessage id="ui-tenant-settings.settings.ssoSettings.label" />,
            component: SSOSettings,
            perm: 'ui-tenant-settings.settings.sso',
          },
          {
            route: 'servicePoints',
            label: <FormattedMessage id="ui-tenant-settings.settings.servicePoints.label" />,
            component: ServicePoints,
            perm: 'ui-tenant-settings.settings.servicepoints',
          },
        ],
      },
      {
        label: <FormattedMessage id="ui-tenant-settings.settings.location.label" />,
        pages: [
          {
            route: 'location-institutions',
            label: <FormattedMessage id="ui-tenant-settings.settings.location.institutions" />,
            component: LocationInstitutions,
            perm: 'ui-tenant-settings.settings.location',
          },
          {
            route: 'location-campuses',
            label: <FormattedMessage id="ui-tenant-settings.settings.location.campuses" />,
            component: LocationCampuses,
            perm: 'ui-tenant-settings.settings.location',
          },
          {
            route: 'location-libraries',
            label: <FormattedMessage id="ui-tenant-settings.settings.location.libraries" />,
            component: LocationLibraries,
            perm: 'ui-tenant-settings.settings.location',
          },
          {
            route: 'location-locations',
            label: <FormattedMessage id="ui-tenant-settings.settings.location.locations" />,
            component: LocationLocations,
            perm: 'ui-tenant-settings.settings.location',
          },
        ],
      }
    ];
  }
  /*
  <NavList>
    <NavListSection activeLink={activeLink} label="Settings">
      {navLinks}
    </NavListSection>
  </NavList>
  <br /><br />
  <NavListSection label="System information" activeLink={activeLink}>
    <NavListItem to="/settings/about"><FormattedMessage id="stripes-core.front.about" /></NavListItem>
  </NavListSection>

  */

  render() {
    return (
      <Settings
        {...this.props}
        sections={this.sections}
        paneTitle={<FormattedMessage id="ui-tenant-settings.settings.index.paneTitle" />}
      />
    );
  }
}

export default Organization;
