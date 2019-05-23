import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import LocationLibrariesPage from '../interactors/location-libraries';

describe('LocationLibraries', () => {
  setupApplication();
  let institution;

  describe('Institution is not present', () => {
    beforeEach(function () {
      this.visit('/settings/tenant-settings/location-libraries');
    });

    it('does not show institution select', () => {
      expect(LocationLibrariesPage.institutionSelectIsPresent).to.equal(false);
    });
  });

  describe('Institution is present', () => {
    beforeEach(function () {
      institution = this.server.create('institution');
      this.visit('/settings/tenant-settings/location-libraries');
    });

    it('shows institution select', () => {
      expect(LocationLibrariesPage.institutionSelectIsPresent).to.equal(true);
    });

    describe('choosing institution', () => {
      beforeEach(async function () {
        await LocationLibrariesPage.chooseInstitution(`${institution.name} (${institution.code})`);
      });

      it('should show library select box', () => {
        expect(LocationLibrariesPage.campusSelectIsPresent).to.equal(true);
      });
    });
  });
});
