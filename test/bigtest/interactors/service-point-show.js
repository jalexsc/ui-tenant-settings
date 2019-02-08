import {
  interactor,
  collection,
  isPresent
} from '@bigtest/interactor';

@interactor class ServicePointShowPage {
  holdSlipList = collection('[data-test-staff-slip-list] li');
  holdShelfPeriodPresent = isPresent('[data-test-hold-shelf-expiry-period]');
}

export default new ServicePointShowPage('[data-test-service-point-details]');
