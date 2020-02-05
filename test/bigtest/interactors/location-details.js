import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor class LocationDetails {
  closeButton = scoped('[icon=times]', ButtonInteractor);
  editLocationButton = scoped('[icon=edit]', ButtonInteractor);
  cloneLocationMenuButton = new ButtonInteractor('[data-test-clone-location-menu-button]');
  editLocationMenuButton = new ButtonInteractor('[data-test-edit-location-menu-button]');
  paneHeaderDropdown = scoped('[data-test-pane-header-actions-button]');

  expandPaneHeaderDropdown() {
    return this
      .paneHeaderDropdown
      .click();
  }
}

export default LocationDetails;
