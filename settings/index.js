import React from 'react';
import { Settings } from '@folio/stripes/smart-components';
import { stripesShape } from '@folio/stripes/core';

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
    const formatMsg = this.props.stripes.intl.formatMessage;

    this.sections = [
      {
        label: formatMsg({ id: 'ui-organization.settings.general.label' }),
        pages: [
          {
            route: 'keys',
            label: formatMsg({ id: 'ui-organization.settings.bindings.label' }),
            component: Bindings,
            perm: 'ui-organization.settings.key-bindings',
          },
          {
            route: 'locale',
            label: formatMsg({ id: 'ui-organization.settings.language.label' }),
            component: Locale,
            perm: 'ui-organization.settings.locale',
          },
          {
            route: 'plugins',
            label: formatMsg({ id: 'ui-organization.settings.plugins.label' }),
            component: Plugins,
            perm: 'ui-organization.settings.plugins',
          },
          {
            route: 'ssosettings',
            label: formatMsg({ id: 'ui-organization.settings.ssoSettings.label' }),
            component: SSOSettings,
            perm: 'ui-organization.settings.sso',
          },
          {
            route: 'servicePoints',
            label: formatMsg({ id: 'ui-organization.settings.servicePoints.label' }),
            component: ServicePoints,
            perm: 'ui-organization.settings.servicepoints',
          },
        ],
      },
      {
        label: formatMsg({ id: 'ui-organization.settings.location.label' }),
        pages: [
          {
            route: 'location-institutions',
            label: formatMsg({ id: 'ui-organization.settings.location.institutions' }),
            component: LocationInstitutions,
            perm: 'ui-organization.settings.location',
          },
          {
            route: 'location-campuses',
            label: formatMsg({ id: 'ui-organization.settings.location.campuses' }),
            component: LocationCampuses,
            perm: 'ui-organization.settings.location',
          },
          {
            route: 'location-libraries',
            label: formatMsg({ id: 'ui-organization.settings.location.libraries' }),
            component: LocationLibraries,
            perm: 'ui-organization.settings.location',
          },
          {
            route: 'location-locations',
            label: formatMsg({ id: 'ui-organization.settings.location.locations' }),
            component: LocationLocations,
            perm: 'ui-organization.settings.location',
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
        paneTitle={this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.index.paneTitle' })}
      />
    );
  }
}

export default Organization;
