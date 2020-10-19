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
      await locations.institutionSelect.selectAndBlur('Institution 1 (INST1)');
      await locations.campusSelect.selectAndBlur('Campus 1 (CAMP1)');
      await locations.librarySelect.selectAndBlur('Library 1 (LIB1)');
    });

    it('should have properly formatted libraries', () => {
      expect(locations.librarySelectOptions(0).text).to.equal('Select library');
      expect(locations.librarySelectOptions(1).text).to.equal('Library 1 (LIB1)');
      expect(locations.librarySelectOptions(2).text).to.equal('Library 2');
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
          await locationDetails.expandPaneHeaderDropdown();
          await locationDetails.editLocationMenuButton.click();
        });

        it('upon click on edit button', () => {
          expect(locationForm.isPresent).to.be.true;
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

      describe('delete action', () => {
        beforeEach(async () => {
          await locationDetails.expandPaneHeaderDropdown();
          await locationDetails.deleteLocationMenuButton.click();
        });

        it('opens delete confirmation modal upon click on delete button', () => {
          expect(locationDetails.confirmDeleteModal.isPresent).to.be.true;
        });

        describe('shows callout', () => {
          beforeEach(async () => {
            await locationDetails.confirmDeleteModal.confirmButton.click();
          });

          it('upon successful location delete', () => {
            expect(locationDetails.callout.successCalloutIsPresent).to.be.true;
          });
        });

        describe('closes confirmation modal', () => {
          beforeEach(async () => {
            await locationDetails.confirmDeleteModal.cancelButton.click();
          });

          it('upon click on cancel button', () => {
            expect(locationDetails.confirmDeleteModal.isPresent).to.be.false;
          });
        });
      });

      describe('opens clone location form', () => {
        beforeEach(async () => {
          await locationDetails.expandPaneHeaderDropdown();
          await locationDetails.cloneLocationMenuButton.click();
        });

        it('upon click on clone location action menu button', () => {
          expect(locationForm.isPresent).to.be.true;
        });
      });

      describe('opens edit location form', () => {
        beforeEach(async () => {
          await locationDetails.expandPaneHeaderDropdown();
          await locationDetails.editLocationMenuButton.click();
        });

        it('upon click on edit location action menu button', () => {
          expect(locationForm.isPresent).to.be.true;
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
