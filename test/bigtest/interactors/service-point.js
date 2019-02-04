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
  pickupLocationSelect = isPresent('[data-test-pickuplocation]');
  clickpickupLocationSelectDropdown = clickable('[data-test-pickuplocation]');
  hasSelect = isPresent('select');
  selectOption = selectable('select');
  val = value('select');
}

export default new ServicePoint('[data-test-servicepoint-form]');
