import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import LocationLibrariesPage from '../interactors/location-libraries';

describe.only('LocationLibraries', () => {
  setupApplication();

  beforeEach(function () {
    const institution = this.server.create('institution');
    this.visit('/settings/tenant-settings/location-libraries');
  });

  it('shows institution select', () => {
    expect(LocationLibrariesPage.institutionSelectIsPresent).to.equal(true);
  });
});
