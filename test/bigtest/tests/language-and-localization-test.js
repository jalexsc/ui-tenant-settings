import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import LanguageAndLocalization from '../interactors/language-and-localization';
import translations from '../../../translations/ui-tenant-settings/en';

describe('Language and localization', () => {
  setupApplication({ scenarios: ['language-and-localization'] });
  const lal = new LanguageAndLocalization();

  beforeEach(function () {
    this.visit('/settings/tenant-settings/locale');
  });

  it('should be present', () => {
    expect(lal.title).to.equal(translations['settings.language.label']);
  });

  describe('Test primary currency', () => {
    beforeEach(async function () {
      await lal.selectCurrency.selectAndBlur('Canadian Dollar (CAD)');
      await lal.save();
    });

    it('should be present', () => {
      expect(lal.selectCurrency.val).to.equal('CAD');
    }).timeout(2000);
  });

  describe('Test primary locale', () => {
    beforeEach(async function () {
      await lal.selectLocale.selectAndBlur('Russian / русский');
      await lal.save();
    });

    it('should be present', () => {
      expect(lal.selectLocale.val).to.equal('ru');
    }).timeout(2000);
  });

  describe('Test primary timezone', () => {
    beforeEach(async function () {
      await lal.selectTimeZone.selectAndBlur('UTC');
      await lal.save();
    });

    it('should be present', () => {
      expect(lal.selectTimeZone.val).to.equal('UTC');
    }).timeout(2000);
  });
});
