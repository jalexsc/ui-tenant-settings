/* eslint-disable no-console */
/* global it describe Nightmare before after */
module.exports.test = function locationTest(uiTestCtx) {
  describe('Module test: organization:locations', function meh() {
    const { config, helpers: { login, logout } } = uiTestCtx;

    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));
    let institutionId = null;
    let campusId = null;
    let libraryId = null;
    const wait = 222;

    const xwait = (name, selector) => {
      return !!(Array.from(
        document.querySelectorAll(selector)
      ).find(e => e.textContent === name));
    };

    const trashBinCounter = (name, selector) => {
      const index = Array.from(
        document.querySelectorAll(`#editList-${selector} div[role="row"] div[role="gridcell"]:first-of-type`)
      ).findIndex(e => {
        return e.textContent === name;
      });
      return (index >= 0) ? index + 1 : -1;
    };


    describe('Login > Add new institution, campus, library, location > Try to delete institution > Delete location > Try to delete institution again > Logout\n', () => {
      const institutionName = `Bowdoin College ${Math.floor(Math.random() * 10000)}`;
      const institutionCode = 'BC';
      const campusName = `Brunswick ${Math.floor(Math.random() * 10000)}`;
      const campusCode = 'BR';
      const libraryName = `Hawthorne-Longfellow ${Math.floor(Math.random() * 10000)}`;
      const libraryCode = 'HL';
      const locationName = `Bowdoin College Test Location ${Math.floor(Math.random() * 10000)}`;
      const locationCode = `BC / BR / HL / TL ${Math.floor(Math.random() * 10000)}`;
      let uuid = null;

      before((done) => {
        login(nightmare, config, done); // logs in with the default admin credentials
      });

      after((done) => {
        logout(nightmare, config, done);
      });

      it(`should create an institution "${institutionName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-institutions"]')
          .click('a[href="/settings/organization/location-institutions"]')
          .wait('#editList-institutions')
          .wait('#clickable-add-institutions')
          .click('#clickable-add-institutions')
          .wait('input[name="items[0].name"]')
          .insert('input[name="items[0].name"]', institutionName)
          .insert('input[name="items[0].code"]', institutionCode)
          .wait('#clickable-save-institutions-0')
          .click('#clickable-save-institutions-0')
          .wait(xwait, institutionName, '#editList-institutions div[role="gridcell"]')
          .then(done)
          .catch(done);
      });

      it(`should create a campus "${campusName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-campuses"]')
          .click('a[href="/settings/organization/location-campuses"]')
          .wait('#institutionSelect')
          .wait(222)
          .xtract(`id("institutionSelect")/option[contains(.,"${institutionName}" )]/@value`)
          .then((result) => {
            institutionId = result;
            console.log(`        (found institution ID ${institutionId} for ${institutionName}`);
            nightmare
              .select('#institutionSelect', institutionId)
              .wait('#clickable-add-campuses')
              .click('#clickable-add-campuses')
              .wait('input[name="items[0].name"]')
              .insert('input[name="items[0].name"]', campusName)
              .insert('input[name="items[0].code"]', campusCode)
              .wait('#clickable-save-campuses-0')
              .click('#clickable-save-campuses-0')
              .wait(xwait, campusName, '#editList-campuses div[role="gridcell"]')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should create a library "${libraryName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-libraries"]')
          .click('a[href="/settings/organization/location-libraries"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .waitUntilNetworkIdle(1000) // Wait for the options to return
          .xtract(`id("campusSelect")/option[contains(.,"${campusName}" )]/@value`)
          .then((result) => {
            campusId = result;
            console.log(`        (found campus ID ${campusId} for ${campusName}`);
            nightmare
              .select('#campusSelect', campusId)
              .wait('#clickable-add-libraries')
              .click('#clickable-add-libraries')
              .wait('input[name="items[0].name"]')
              .insert('input[name="items[0].name"]', libraryName)
              .insert('input[name="items[0].code"]', libraryCode)
              .wait('#clickable-save-libraries-0')
              .click('#clickable-save-libraries-0')
              .wait(xwait, libraryName, '#editList-libraries div[role="gridcell"]')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should create a location "${locationName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-locations"]')
          .click('a[href="/settings/organization/location-locations"]')
          .wait('#institutionSelect')
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .select('#campusSelect', campusId)
          .wait(222)
          .xtract(`id("librarySelect")/option[contains(.,"${libraryName}" )]/@value`)
          .then((result) => {
            libraryId = result;
            nightmare
              .select('#librarySelect', libraryId)
              .wait('#clickable-add-location')
              .click('#clickable-add-location')
              .wait('#input-location-name')
              .insert('#input-location-name', locationName)
              .wait('#input-location-code')
              .insert('#input-location-code', locationCode)
              .wait('#input-location-discovery-display-name')
              .insert('#input-location-discovery-display-name', locationName)
              .type('select[name="servicePointIds[0].selectSP"]', 'Circ Desk 1')
              .wait(1000)
              .wait('#clickable-save-location')
              .click('#clickable-save-location')
              .waitUntilNetworkIdle(1000)
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it('should confirm creation of new location', (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-locations"]')
          .click('a[href="/settings/organization/location-locations"]')
          .wait('#institutionSelect')
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .select('#campusSelect', campusId)
          .wait('#librarySelect')
          .select('#librarySelect', libraryId)
          .click('div.hasEntries a:nth-of-type(1)')
          .url()
          .then((result) => {
            done();
            uuid = result;
            uuid = uuid.replace(/^.+\/([^?]+).*/, '$1');
            console.log(`        (found location ID ${uuid} for ${locationName}`);
          })
          .catch(error => {
            console.error('Could not find new location: ', error);
          });
      });

      /*
      it(`should fail to delete institution "${institutionName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-institutions"]')
          .click('a[href="/settings/organization/location-institutions"]')

          .wait('#editList-institutions')
          .wait(name => {
            return !!(Array.from(
              document.querySelectorAll('#editList-institutions div[role="gridcell"]')
            ).find(e => e.textContent === name));
          }, institutionName)

//          .wait('#editList-institutions:not([data-total-count="0"])')

          .evaluate(trashBinCounter, institutionName, 'institutions')
          .then((n) => {
            nightmare
              .wait(`#editList-institutions div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .click(`#editList-institutions div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .wait('#clickable-deleteinstitution-confirmation-confirm')
              .click('#clickable-deleteinstitution-confirmation-confirm')
              .wait('#OverlayContainer div[role="dialog"]')
              .click('#OverlayContainer div[role="dialog"] button')
              .wait(25000)
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should fail to delete campus "${campusName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-campuses"]')
          .click('a[href="/settings/organization/location-campuses"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#editList-campuses:not([data-total-count="0"])')
          .evaluate(trashBinCounter, campusName, 'campuses')
          .then((n) => {
            nightmare
              .wait(`#editList-campuses div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .click(`#editList-campuses div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .wait('#clickable-deletecampus-confirmation-confirm')
              .click('#clickable-deletecampus-confirmation-confirm')
              .wait('#OverlayContainer div[role="dialog"]')
              .click('#OverlayContainer div[role="dialog"] button')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should fail to delete library "${libraryName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-libraries"]')
          .click('a[href="/settings/organization/location-libraries"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .wait(`option[value="${campusId}"]`)
          .select('#campusSelect', campusId)
          .wait('#editList-libraries:not([data-total-count="0"])')
          .evaluate(trashBinCounter, libraryName, 'libraries')
          .then((n) => {
            nightmare
              .wait(`#editList-libraries div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .click(`#editList-libraries div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .wait('#clickable-deletelibrary-confirmation-confirm')
              .click('#clickable-deletelibrary-confirmation-confirm')
              .wait('#OverlayContainer div[role="dialog"]')
              .click('#OverlayContainer div[role="dialog"] button')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });
      */

      it(`should delete the location "${locationName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-locations"]')
          .click('a[href="/settings/organization/location-locations"]')
          .waitUntilNetworkIdle(500)
          .wait('#institutionSelect')
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .select('#campusSelect', campusId)
          .wait('#librarySelect')
          .select('#librarySelect', libraryId)
          .wait('div.hasEntries')
          .evaluate((name) => {
            const index = Array.from(
              document.querySelectorAll('div.hasEntries a div')
            ).findIndex(e => e.textContent === name);
            return (index >= 0 ? index + 1 : -1);
          }, locationName)
          .then(n => {
            if (n === -1) {
              throw Error(`Could not find the location ${locationName} to delete`);
            }
            nightmare
              .wait(`div.hasEntries a:nth-of-type(${n})`)
              .click(`div.hasEntries a:nth-of-type(${n})`)
              .wait('#clickable-edit-item')
              .click('#clickable-edit-item')
              .wait('#clickable-delete-location')
              .click('#clickable-delete-location')
              .wait('#clickable-deletelocation-confirmation-confirm')
              .click('#clickable-deletelocation-confirmation-confirm')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it('should confirm deletion', (done) => {
        nightmare
          .wait('div.hasEntries')
          .wait((euuid) => {
            return !!(document.querySelector(`a[href*="${euuid}"]`));
          }, uuid)
          .then(done)
          .catch(done);
      });

      it(`should delete the library "${libraryName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-libraries"]')
          .click('a[href="/settings/organization/location-libraries"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .wait(`option[value="${campusId}"]`)
          .select('#campusSelect', campusId)
          .wait(1000)
          .wait('#editList-libraries:not([data-total-count="0"])')
          .evaluate(trashBinCounter, libraryName, 'libraries')
          .then((n) => {
            nightmare
              .wait(`#editList-libraries div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .click(`#editList-libraries div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should delete the campus "${campusName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-campuses"]')
          .click('a[href="/settings/organization/location-campuses"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#editList-campuses:not([data-total-count="0"])')
          .evaluate(trashBinCounter, campusName, 'campuses')
          .then((n) => {
            nightmare
              .wait(`#editList-campuses div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .click(`#editList-campuses div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should delete the institution "${institutionName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-institutions"]')
          .click('a[href="/settings/organization/location-institutions"]')
          .wait('#editList-institutions:not([data-total-count="0"])')
          .wait(1000)
          .evaluate(trashBinCounter, institutionName, 'institutions')
          .then((n) => {
            nightmare
              .wait(`#editList-institutions div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .click(`#editList-institutions div[role="row"]:nth-of-type(${n}) button[icon="trashBin"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should confirm the institution "${institutionName}" has been deleted`, (done) => {
        nightmare
          .wait(wait)
          .evaluate(trashBinCounter, institutionName, 'institutions')
          .then((n) => {
            if (n === -1) {
              done();
            } else {
              throw Error(`Found institution ${institutionName} after it should have been deleted.`);
            }
          })
          .catch(done);
      });
    });
  });
};
