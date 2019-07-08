import { expect } from 'chai';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import Locations from '../interactors/locations';
import LocationDetails from '../interactors/location-details';
import locationForm from '../interactors/location-form';

describe('Locations', () => {
  setupApplication({ scenarios: ['locations'] });
  const locations = new Locations();
  const locationDetails = new LocationDetails('#location-details');

  const getCellContent = (row, cell) => locations.list.rows(row).cells(cell).content;

  beforeEach(async function () {
    this.visit('/settings/tenant-settings/location-locations');
    await locations.whenLoaded();
  });

  describe('page', () => {
    beforeEach(async function () {
      await locations.institutionSelect.selectAndBlur('Institution 1 (code)');
      await locations.campusSelect.selectAndBlur('Campus 1 (code)');
      await locations.librarySelect.selectAndBlur('Library 1 (code)');
    });

    it('renders proper amount of items', () => {
      expect(locations.list.rowCount).to.equal(3);
    });

    describe('can sort', () => {
      beforeEach(async () => {
        await locations.list.headers(1).click();
      });

      it('descending', () => {
        expect(getCellContent(1, 1)).to.equal('2 Location');
        expect(getCellContent(2, 1)).to.equal('1 Location');
      });

      describe('and', () => {
        beforeEach(async () => {
          await locations.list.headers(1).click();
        });

        it('ascending', () => {
          expect(getCellContent(0, 1)).to.equal('1 Location');
          expect(getCellContent(1, 1)).to.equal('2 Location');
        });
      });
    });

    describe('opens location details', () => {
      beforeEach(async () => {
        await locations.list.rows(0).click();
      });

      it('upon click on row', () => {
        expect(locationDetails.isPresent).to.be.true;
      });

      describe('opens edit form', () => {
        beforeEach(async () => {
          await locationDetails.editButton.click();
        });

        it('upon click on edit button', () => {
          expect(locationForm.isPresent).to.be.true;
        });

        describe('delete feature:', () => {
          beforeEach(async () => {
            await locationForm.deleteButton.click();
          });

          it('opens delete confirmation modal upon click on delete button', () => {
            expect(locationForm.confirmDeleteModal.isPresent).to.be.true;
          });

          describe('shows callout', () => {
            beforeEach(async () => {
              await locationForm.confirmDeleteModal.confirmButton.click();
            });

            it('upon successful location delete', () => {
              expect(locationForm.callout.successCalloutIsPresent).to.be.true;
            });
          });

          describe('closes confirmation modal', () => {
            beforeEach(async () => {
              await locationForm.confirmDeleteModal.cancelButton.click();
            });

            it('upon click on cancel button', () => {
              expect(locationForm.confirmDeleteModal.isPresent).to.be.false;
            });
          });
        });

        describe('closes edit form', () => {
          beforeEach(async () => {
            await locationForm.closeButton.click();
          });

          it('upon click on close button', () => {
            expect(locationForm.isPresent).to.be.false;
          });
        });
      });

      describe('closes location details', () => {
        beforeEach(async () => {
          await locationDetails.closeButton.click();
        });

        it('upon click on close button', () => {
          expect(locationDetails.isPresent).to.be.false;
        });
      });
    });
  });
});
