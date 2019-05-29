import {
  interactor,
} from '@bigtest/interactor';

@interactor class CreateAddress {
  static defaultScope = '#clickable-add-addresses';
}

@interactor class Addresses {
  static defaultScope = '#addresses';

  createAddress = new CreateAddress();
}

export default Addresses;
