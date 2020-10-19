/* eslint-disable no-console */
/* global it describe Nightmare before after */
module.exports.test = function locationTest(uiTestCtx) {
  describe('Module test: tenant-settings:locations', function meh() {
    // what the ...? I THOUGHT WE WERE GETTING RID OF TIMERS??!!!?!111
    // yeah, well, there's something funky related to removing the
    // location values that doesn't work without waiting. I think, maybe,
    // there's a problem with how subscriptions are managed in Callout
    // and that's leaving something lingering here, i.e. if we don't
    // wait for the Callout's timeout to expire then the navigation
    // here is all wonky. The symptom is that the navigation after
    // deletion of a ControlledVocab item stalls and you can see the
    // browser hanging out on the CV page it was supposed to navigate
    // away form. I don't know what's holding it there, but it's
    // holding on tightly.
    const deleteTimer = 3000;

    const { config, helpers } = uiTestCtx;

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

    const xSelectValueFor = (id, name) => {
      return Array.from(document.querySelector(id).querySelectorAll('option')).find(e => e.label.startsWith(name)).value;
    };

    const trashCounter = (name, selector) => {
      const index = Array.from(
        document.querySelectorAll(`#editList-${selector} div[role="row"] div[role="gridcell"]:first-of-type`)
      ).findIndex(e => {
        return e.textContent === name;
      });
      return (index >= 0) ? index + 1 : -1;
    };

    const isRowGone = (name, selector) => {
      const index = Array.from(
        document.querySelectorAll(`#editList-${selector} div[role="row"] div[role="gridcell"]:first-of-type`)
      ).findIndex(e => {
        return e.textContent === name;
      });
      return !(index >= 0);
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
        helpers.login(nightmare, config, done); // logs in with the default admin credentials
      });

      after((done) => {
        helpers.logout(nightmare, config, done);
      });

      it(`should create an institution "${institutionName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .wait(wait)
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-institutions"]')
          .click('a[href="/settings/tenant-settings/location-institutions"]')
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
          .wait('a[href="/settings/tenant-settings"]')
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-campuses"]')
          .click('a[href="/settings/tenant-settings/location-campuses"]')
          .wait('#institutionSelect')
          .wait(222)
          .evaluate(xSelectValueFor, '#institutionSelect', institutionName)
          .then((result) => {
            nightmare
              .select('#institutionSelect', result)
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
            institutionId = result;
            console.log(`        (found institution ID ${institutionId} for ${institutionName}`);
          })
          .catch(done);
      });

      it(`should create a library "${libraryName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-libraries"]')
          .click('a[href="/settings/tenant-settings/location-libraries"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .waitUntilNetworkIdle(1000) // Wait for the options to return
          .evaluate(xSelectValueFor, '#campusSelect', campusName)
          .then((result) => {
            nightmare
              .select('#campusSelect', result)
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
            campusId = result;
            console.log(`        (found campus ID ${campusId} for ${campusName}`);
          })
          .catch(done);
      });

      it(`should create a location "${locationName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-locations"]')
          .click('a[href="/settings/tenant-settings/location-locations"]')
          .wait('#institutionSelect')
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .select('#campusSelect', campusId)
          .wait(222)
          .evaluate(xSelectValueFor, '#librarySelect', libraryName)
          .then((result) => {
            nightmare
              .select('#librarySelect', result)
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
            libraryId = result;
            console.log(`        (found library ID ${libraryId} for ${libraryName}`);
          })
          .catch(done);
      });

      it('should confirm creation of new location', (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-locations"]')
          .click('a[href="/settings/tenant-settings/location-locations"]')
          .wait('#institutionSelect')
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .select('#campusSelect', campusId)
          .wait('#librarySelect')
          .select('#librarySelect', libraryId)
          .wait('#locations-list [role=row] [role=gridcell]')
          .click('#locations-list [role=row] [role=gridcell]')
          .url()
          .then((result) => {
            nightmare
              .wait('button[icon=times]')
              .click('button[icon=times]')
              .then(done)
              .catch(done);
            uuid = result;
            uuid = uuid.replace(/^.+\/([^?]+).*/, '$1');
            console.log(`        (found location ID ${uuid} for ${locationName}`);
          })
          .catch(error => {
            console.error('Could not find new location: ', error);
          });
      });

      it(`should fail to delete institution "${institutionName}"`, (done) => {
        nightmare
          .wait(deleteTimer)
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .wait(wait)
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-institutions"]')
          .click('a[href="/settings/tenant-settings/location-institutions"]')
          .wait('#editList-institutions:not([data-total-count="0"])')
          .wait(3000) // 3 seconds? 3 SECONDS?
          .evaluate(trashCounter, institutionName, 'institutions')
          .then((n) => {
            nightmare
              .wait(`#editList-institutions div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .click(`#editList-institutions div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .wait('#OverlayContainer div[role="dialog"]')
              .click('#OverlayContainer div[role="dialog"] button')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should fail to delete campus "${campusName}"`, (done) => {
        nightmare
          .wait(deleteTimer)
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .wait(wait)
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-campuses"]')
          .click('a[href="/settings/tenant-settings/location-campuses"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#editList-campuses:not([data-total-count="0"])')
          .evaluate(trashCounter, campusName, 'campuses')
          .then((n) => {
            nightmare
              .wait(`#editList-campuses div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .click(`#editList-campuses div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .wait('#OverlayContainer div[role="dialog"]')
              .click('#OverlayContainer div[role="dialog"] button')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should fail to delete library "${libraryName}"`, (done) => {
        nightmare
          .wait(deleteTimer)
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-libraries"]')
          .click('a[href="/settings/tenant-settings/location-libraries"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .wait(`option[value="${campusId}"]`)
          .select('#campusSelect', campusId)
          .wait('#editList-libraries:not([data-total-count="0"])')
          .evaluate(trashCounter, libraryName, 'libraries')
          .then((n) => {
            nightmare
              .wait(`#editList-libraries div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .click(`#editList-libraries div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .wait('#OverlayContainer div[role="dialog"]')
              .click('#OverlayContainer div[role="dialog"] button')
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it(`should delete the location "${locationName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-locations"]')
          .click('a[href="/settings/tenant-settings/location-locations"]')
          .wait('#institutionSelect')
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .select('#campusSelect', campusId)
          .wait('#librarySelect')
          .select('#librarySelect', libraryId)
          .wait('#locations-list [role=row] [role=gridcell]')
          .click('#locations-list [role=row] [role=gridcell]')
          .wait('#clickable-delete-location')
          .click('#clickable-delete-location')
          .wait('#clickable-deletelocation-confirmation-confirm')
          .click('#clickable-deletelocation-confirmation-confirm')
          .wait('#OverlayContainer button[icon="times"]')
          .click('#OverlayContainer button[icon="times"]')
          .wait(() => !document.querySelector('#OverlayContainer div[class^="calloutBase"]'))
          .then(done)
          .catch(done);
      });

      it('should confirm deletion', (done) => {
        nightmare
          .wait(deleteTimer)
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-locations"]')
          .click('a[href="/settings/tenant-settings/location-locations"]')
          .wait('#institutionSelect')
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .select('#campusSelect', campusId)
          .wait('#librarySelect')
          .select('#librarySelect', libraryId)
          .wait('[class*=mclEmptyMessage]')
          .then(done)
          .catch(done);
      });

      it(`should delete the library "${libraryName}"`, (done) => {
        nightmare
          .wait(deleteTimer)
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-libraries"]')
          .click('a[href="/settings/tenant-settings/location-libraries"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#campusSelect')
          .wait(`option[value="${campusId}"]`)
          .select('#campusSelect', campusId)
          .wait('#editList-libraries:not([data-total-count="0"])')
          .evaluate(trashCounter, libraryName, 'libraries')
          .then((n) => {
            nightmare
              .wait(`#editList-libraries div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .click(`#editList-libraries div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .wait('#OverlayContainer button[icon="times"]')
              .click('#OverlayContainer button[icon="times"]')
              .wait(() => !document.querySelector('#OverlayContainer div[class^="calloutBase"]'))
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it('should confirm the library has been deleted', (done) => {
        nightmare
          .wait(wait)
          .wait(isRowGone, libraryName, 'libraries')
          .then(done)
          .catch(done);
      });

      it(`should delete the campus "${campusName}"`, (done) => {
        nightmare
          .wait(deleteTimer)
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .wait(wait)
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-campuses"]')
          .click('a[href="/settings/tenant-settings/location-campuses"]')
          .wait('#institutionSelect')
          .wait(`option[value="${institutionId}"]`)
          .select('#institutionSelect', institutionId)
          .wait('#editList-campuses:not([data-total-count="0"])')
          .evaluate(trashCounter, campusName, 'campuses')
          .then((n) => {
            nightmare
              .wait(`#editList-campuses div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .click(`#editList-campuses div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .wait('#OverlayContainer button[icon="times"]')
              .click('#OverlayContainer button[icon="times"]')
              .wait(() => !document.querySelector('#OverlayContainer div[class^="calloutBase"]'))
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it('should confirm the campus has been deleted', (done) => {
        nightmare
          .wait(wait)
          .wait(isRowGone, campusName, 'campuses')
          .then(done)
          .catch(done);
      });

      it(`should delete the institution "${institutionName}"`, (done) => {
        nightmare
          .wait(deleteTimer)
          .click(config.select.settings)
          .wait('a[href="/settings/tenant-settings"]')
          .wait(wait)
          .click('a[href="/settings/tenant-settings"]')
          .wait('a[href="/settings/tenant-settings/location-institutions"]')
          .click('a[href="/settings/tenant-settings/location-institutions"]')
          .wait('#editList-institutions:not([data-total-count="0"])')
          .wait(1000)
          .evaluate(trashCounter, institutionName, 'institutions')
          .then((n) => {
            nightmare
              .wait(`#editList-institutions div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .click(`#editList-institutions div[role="row"]:nth-of-type(${n}) button[icon="trash"]`)
              .wait('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .click('#clickable-delete-controlled-vocab-entry-confirmation-confirm')
              .wait('#OverlayContainer button[icon="times"]')
              .click('#OverlayContainer button[icon="times"]')
              .wait(() => !document.querySelector('#OverlayContainer div[class^="calloutBase"]'))
              .then(done)
              .catch(done);
          })
          .catch(done);
      });

      it('should confirm the institution has been deleted', (done) => {
        nightmare
          .wait(wait)
          .wait(isRowGone, institutionName, 'institutions')
          .then(done)
          .catch(done);
      });
    });
  });
};
