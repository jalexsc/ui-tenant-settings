import {
  interactor,
  isPresent,
  collection,
} from '@bigtest/interactor';

import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

@interactor class Locations {
  isLoaded = isPresent('[name=institutionSelect]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  list = new MultiColumnListInteractor('#locations-list');
  institutionSelect = new SelectInteractor('[data-test-institution-select]');
  campusSelect = new SelectInteractor('[data-test-campus-select]');
  librarySelect = new SelectInteractor('[data-test-library-select]');
  librarySelectOptions = collection('[data-test-library-select] select option')
}

export default Locations;
