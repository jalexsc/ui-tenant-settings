import {
  interactor,
  scoped,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor class LocationDetails {
  closeButton = scoped('[icon=times]', ButtonInteractor);
  editButton = scoped('[icon=edit]', ButtonInteractor);
}

export default LocationDetails;
