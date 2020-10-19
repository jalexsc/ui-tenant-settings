import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import ServicePointCreatePage from '../interactors/service-point-create';
import translations from '../../../translations/ui-tenant-settings/en';

describe('ServicePointCreate', () => {
  setupApplication();
  let servicePoint;

  beforeEach(function () {
    servicePoint = this.server.create('servicePoint');
    this.visit(`/settings/tenant-settings/servicePoints/${servicePoint.id}?layer=edit`);
    return this.visit('/settings/tenant-settings/servicePoints?layer=add', () => {
      expect(ServicePointCreatePage.$root).to.exist;
    });
  });

  describe('visiting the service point create page', () => {
    it('displays the title in the pane header', () => {
      expect(ServicePointCreatePage.title).to.equal('New service point');
    });

    it('pickuplocation dropdown is not present', () => {
      expect(ServicePointCreatePage.pickupLocationSelect).to.be.false;
    });
  });

  describe('setting print slip print defaults on service point', () => {
    beforeEach(async function () {
      await ServicePointCreatePage.clickHoldSlipCheckbox();
    });

    it('unchecks print default for hold slip', () => {
      expect(ServicePointCreatePage.holdSlipCheckboxPresent).to.be.true;
      expect(ServicePointCreatePage.isHoldSlipChecked).to.be.false;
    });

    it('keeps print default for transit slip', () => {
      expect(ServicePointCreatePage.isTransitSlipChecked).to.be.true;
    });
  });

  describe('toggling pickup location', () => {
    describe('set pickup location to Yes', () => {
      beforeEach(async function () {
        await ServicePointCreatePage.choosePickupLocation(translations['settings.servicePoints.pickupLocation.yes']);
      });

      it('shows hold shelf expiration period', () => {
        expect(ServicePointCreatePage.holdShelfExpirationPeriod.isPresent).to.be.true;
      });

      it('hold shelf experation period is marked as required', () => {
        expect(ServicePointCreatePage.holdShelfExpirationPeriod.isAsteriskPresent).to.be.true;
      });
    });

    describe('set pickup location to No', () => {
      beforeEach(async function () {
        await ServicePointCreatePage.choosePickupLocation(translations['settings.servicePoints.pickupLocation.no']);
      });

      it('hides hold shelf expiration period', () => {
        expect(ServicePointCreatePage.holdShelfExpirationPeriod.isPresent).to.be.false;
      });
    });
  });
});
