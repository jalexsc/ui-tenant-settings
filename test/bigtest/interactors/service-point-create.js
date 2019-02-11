import {
  interactor,
  isPresent,
  text,
  clickable,
  property,
  selectable,
} from '@bigtest/interactor';

@interactor class ServicePointCreatePage {
  title = text('[class*=paneTitleLabel---]');
  pickupLocationSelect = isPresent('[data-test-pickup-location]');
  choosePickupLocation = selectable('[data-test-pickup-location]');
  holdShelfExpirationPeriodPresent = isPresent('[data-test-holdshelfexpiry]');

  holdSlipCheckboxPresent = isPresent('#staff-slip-checkbox-0');
  clickHoldSlipCheckbox = clickable('#staff-slip-checkbox-0');
  isHoldSlipChecked = property('#staff-slip-checkbox-0', 'checked');
  isTransitSlipChecked = property('#staff-slip-checkbox-1', 'checked');
}

export default new ServicePointCreatePage('[data-test-servicepoint-form]');
