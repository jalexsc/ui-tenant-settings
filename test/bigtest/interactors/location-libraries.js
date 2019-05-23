import {
  interactor,
  isPresent,
  selectable,
} from '@bigtest/interactor';

@interactor class LocationLibrariesPage {
  institutionSelectIsPresent = isPresent('#institutionSelect');
  chooseInstitution = selectable('#institutionSelect');

  campusSelectIsPresent = isPresent('#campusSelect');
}

export default new LocationLibrariesPage('#libraries');
