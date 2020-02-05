import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

@interactor class NameField {
  static defaultScope = ('[data-test-location-name]');

  input = new TextFieldInteractor('#input-location-name');
  validationMessage = scoped('[class^="feedbackError-"]');
}

@interactor class LocationForm {
  static defaultScope = '#form-locations';

  isLoaded = isPresent('[data-test-location-name]');
  closeButton = scoped('[icon=times]', ButtonInteractor);
  deleteButton = scoped('#clickable-delete-location', ButtonInteractor);
  confirmDeleteModal = new ConfirmationModalInteractor('#deletelocation-confirmation');
  paneHeaderDropdown = scoped('[data-test-pane-header-actions-button]');
  paneHeaderCancelButton = new ButtonInteractor('[data-test-cancel-menu-button]');
  callout = new CalloutInteractor();

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  expandPaneHeaderDropdown() {
    return this
      .paneHeaderDropdown
      .click();
  }

  name = new NameField();
}

export default new LocationForm();
