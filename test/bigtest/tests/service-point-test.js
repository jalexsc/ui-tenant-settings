import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import servicePoint from '../interactors/service-point';

describe('ServicePoint', () => {
  setupApplication();

  beforeEach(async function () {
    return this.visit('/settings/organization/servicePoints?layer=add', () => {
      expect(servicePoint.$root).to.exist;
    });
  });

  describe('visiting the service point create page', () => {
    it('displays the title in the pane header', () => {
      expect(servicePoint.title).to.equal('new');
    });

    it('pickuplocation dropdown is present', () => {
      expect(servicePoint.pickupLocationSelect).to.be.true;
    });
  });
});
