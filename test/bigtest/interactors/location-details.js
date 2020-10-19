import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

@interactor class LocationDetails {
  closeButton = scoped('[icon=times]', ButtonInteractor);
  cloneLocationMenuButton = new ButtonInteractor('[data-test-clone-location-menu-button]');
  editLocationMenuButton = new ButtonInteractor('[data-test-edit-location-menu-button]');
  deleteLocationMenuButton = new ButtonInteractor('[data-test-delete-location-menu-button]');
  paneHeaderDropdown = scoped('[data-test-pane-header-actions-button]');

  confirmDeleteModal = new ConfirmationModalInteractor('#deletelocation-confirmation');
  callout = new CalloutInteractor();

  expandPaneHeaderDropdown() {
    return this
      .paneHeaderDropdown
      .click();
  }
}

export default LocationDetails;
