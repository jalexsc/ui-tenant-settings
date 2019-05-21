import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import Addresses from '../interactors/addresses';

describe('Addresses', () => {
  setupApplication();
  const addresses = new Addresses();

  beforeEach(function () {
    this.visit('/settings/tenant-settings/addresses');
  });

  it('should be present', () => {
    expect(addresses.isPresent).to.be.true;
  });

  it('should draw create button', () => {
    expect(addresses.createAddress.isPresent).to.be.true;
  });
});
