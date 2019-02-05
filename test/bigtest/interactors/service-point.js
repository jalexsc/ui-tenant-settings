import {
  interactor,
  isPresent,
  text,
  clickable,
  selectable,
  value,
} from '@bigtest/interactor';

@interactor class ServicePoint {
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
  pickupLocationSelect = isPresent('[data-test-pickup-location]');
  clickpickupLocationSelectDropdown = clickable('[data-test-pickup-location]');
  hasSelect = isPresent('select');
  selectOption = selectable('select');
  val = value('select');
}

export default new ServicePoint('[data-test-servicepoint-form]');
