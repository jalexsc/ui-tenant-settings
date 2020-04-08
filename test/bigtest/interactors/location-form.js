import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

@interactor class NameField {
  static defaultScope = ('[data-test-location-name]');

  input = new TextFieldInteractor('#input-location-name');
  validationMessage = scoped('[class^="feedbackError-"]');
}

@interactor class LocationForm {
  static defaultScope = '#form-locations';

  isLoaded = isPresent('[data-test-location-name]');
  closeButton = scoped('[icon=times]', ButtonInteractor);

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  name = new NameField();
}

export default new LocationForm();
