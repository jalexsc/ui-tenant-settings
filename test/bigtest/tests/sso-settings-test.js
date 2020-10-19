import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import SSOSettings from '../interactors/sso-settings';
import translations from '../../../translations/ui-tenant-settings/en';

describe('SSOSettings', () => {
  setupApplication({ scenarios: ['sso-settings'] });
  const sso = new SSOSettings();

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
});
