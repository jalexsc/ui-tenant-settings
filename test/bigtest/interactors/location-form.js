import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';

@interactor class NameField {
  static defaultScope = ('[data-test-location-name]');

  input = new TextFieldInteractor('#input-location-name');
  validationMessage = scoped('[class^="feedbackError-"]');
}

@interactor class LocationForm {
  name = new NameField();
}

export default new LocationForm();
