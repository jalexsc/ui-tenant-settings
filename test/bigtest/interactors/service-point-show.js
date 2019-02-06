import {
  interactor,
  collection,
} from '@bigtest/interactor';

@interactor class ServicePointShowPage {
  holdSlipList = collection('[data-test-staff-slip-list] li');
}

export default new ServicePointShowPage('[data-test-service-point-details]');
