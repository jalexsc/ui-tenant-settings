import { expect } from 'chai';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import LocationForm from '../interactors/location-form';

import translations from '../../../translations/ui-tenant-settings/en';

describe('LocationForm', () => {
  setupApplication();

  describe('Name field', () => {
    beforeEach(async function () {
      this.server.create('location');
      this.visit('/settings/tenant-settings/location-locations?layer=add');
      await LocationForm.whenLoaded();
    });

    it('should display name field', () => {
      expect(LocationForm.name.input.isVisible).to.be.true;
    });

    it('should not show an error message', () => {
      expect(LocationForm.name.validationMessage.isPresent).to.be.false;
    });

    describe('closes form', () => {
      beforeEach(async () => {
        await LocationForm.closeButton.click();
      });

      it('upon click on cancel button', () => {
        expect(LocationForm.isPresent).to.be.false;
      });
    });

    // It was skipped because of BigTest blur issue.
    describe.skip('Name field validation', () => {
      beforeEach(async () => {
        await LocationForm.name.input.fill('test');
        await LocationForm.name.input.blur();
      });

      it('should show an error message', () => {
        expect(LocationForm.name.validationMessage.isPresent).to.be.true;
      });

      it('should display proper message', () => {
        expect(LocationForm.name.validationMessage.text).to.equal(translations['settings.location.locations.validation.name.unique']);
      });
    });
  });
});
