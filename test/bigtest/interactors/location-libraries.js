import {
  interactor,
  isPresent,
} from '@bigtest/interactor';

@interactor class LocationLibrariesPage {
  institutionSelectIsPresent = isPresent('#institutionSelect');
}

export default new LocationLibrariesPage('#libraries');
