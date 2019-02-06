import {
  interactor,
  isPresent,
  text,
  clickable,
  property,
} from '@bigtest/interactor';

@interactor class ServicePointUpdatePage {
  title = text('[class*=paneTitleLabel---]');

  transitSlipCheckboxPresent = isPresent('#staff-slip-checkbox-1');
  clickTransitSlipCheckbox = clickable('#staff-slip-checkbox-1');
  isTransitSlipChecked = property('#staff-slip-checkbox-1', 'checked');
  save = clickable('#clickable-save-service-point');
}

export default new ServicePointUpdatePage('[data-test-servicepoint-form]');
