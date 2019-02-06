import {
  interactor,
  isPresent,
  text,
  clickable,
  property,
} from '@bigtest/interactor';

@interactor class ServicePointCreatePage {
  title = text('[class*=paneTitleLabel---]');
  pickupLocationSelect = isPresent('[data-test-pickup-location]');
  clickpickupLocationSelectDropdown = clickable('[data-test-pickup-location]');

  holdSlipCheckboxPresent = isPresent('#staff-slip-checkbox-0');
  clickHoldSlipCheckbox = clickable('#staff-slip-checkbox-0');
  isHoldSlipChecked = property('#staff-slip-checkbox-0', 'checked');
}

export default new ServicePointCreatePage('[data-test-servicepoint-form]');
