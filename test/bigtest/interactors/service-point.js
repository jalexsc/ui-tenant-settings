import {
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

@interactor class ServicePoint {
  isLoaded = isPresent('[class*=paneTitleLabel---]');

  whenLoaded() {
    return this.when(() => this.isLoaded);
  }

  title = text('[class*=paneTitleLabel---]');
}

export default new ServicePoint('[data-test-servicepoint-form]');
