import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import ServicePointCreatePage from '../interactors/service-point-create';

describe('ServicePointCreate', () => {
  setupApplication();
  let servicePoint;

  beforeEach(function () {
    servicePoint = this.server.create('servicePoint');
  });

  beforeEach(function () {
    this.visit(`/settings/organization/servicePoints/${servicePoint.id}?layer=edit`);
  });

  beforeEach(async function () {
    return this.visit('/settings/organization/servicePoints?layer=add', () => {
      expect(ServicePointCreatePage.$root).to.exist;
    });
  });

  describe('visiting the service point create page', () => {
    it('displays the title in the pane header', () => {
      expect(ServicePointCreatePage.title).to.equal('new');
    });

    it('pickuplocation dropdown is not present', () => {
      expect(ServicePointCreatePage.pickupLocationSelect).to.be.false;
    });
  });

  describe('setting print slip print defaults on service point', () => {
    beforeEach(async function () {
      await ServicePointCreatePage.clickHoldSlipCheckbox();
    });

    it('sets print default for hold slip', () => {
      expect(ServicePointCreatePage.holdSlipCheckboxPresent).to.be.true;
      expect(ServicePointCreatePage.isHoldSlipChecked).to.be.true;
    });
  });
});
