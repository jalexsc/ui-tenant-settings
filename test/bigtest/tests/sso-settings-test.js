import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import SSOSettings from '../interactors/sso-settings';
import translations from '../../../translations/ui-tenant-settings/en';

describe('SSOSettings', () => {
  const sso = new SSOSettings();

  describe('with permissions', () => {
    setupApplication({ scenarios: ['sso-settings'] });

    beforeEach(async function () {
      this.visit('/settings/tenant-settings/ssosettings');
      await sso.whenLoaded();
    });

    it('should be present', () => {
      expect(sso.title).to.equal(translations['settings.ssoSettings.label']);
    });

    describe('Saving SSO settings', () => {
      beforeEach(async function () {
        await sso.idpUrl.fillAndBlur('https://idp.ssocircle.com/meta-idp.xml');
        await sso.binding.selectAndBlur('POST binding');
        await sso.attribute.fillAndBlur('attr');
        await sso.userProperty.selectAndBlur('Barcode');

        await sso.save();
      });

      it('should save sso form', () => {
        expect(sso.binding.val).to.equal('POST');
      });
    });

    describe('Failing idp url validation', () => {
      beforeEach(async function () {
        await sso.idpUrl.fillAndBlur('invalid url');
        await sso.binding.selectAndBlur('POST binding');
        await sso.attribute.fillAndBlur('attr');
        await sso.userProperty.selectAndBlur('Barcode');

        await sso.save();
      });

      it('should show validation error', () => {
        expect(sso.feedbackError).to.equal(translations['settings.saml.validate.idpUrl']);
      });
    });

    describe('Disable download metadata button', () => {
      beforeEach(async function () {
        await sso.idpUrl.fillAndBlur('');
      });

      it('should disable download metadata button', () => {
        expect(sso.isDownloadMetadataDisabled).to.equal(true);
      });
    });
  });

  describe('without permissions', () => {
    setupApplication({
      scenarios: ['sso-settings'],
      hasAllPerms: false,
      permissions: {
        'settings.enabled': true,
        'settings.tenant-settings.enabled': true,
        'ui-tenant-settings.settings.sso': true,
      },
    });

    beforeEach(async function () {
      this.visit('/settings/tenant-settings/ssosettings');
      await sso.whenLoaded();
    });

    it('should not show download metadata button', () => {
      expect(sso.isDownloadMetadataPresent).to.equal(false);
    });
  });
});
