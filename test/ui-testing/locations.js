/* eslint-disable no-console */
/* global it describe Nightmare before after */
module.exports.test = function locationTest(uiTestCtx) {
  describe('Module test: organization:locations', function meh() {
    const { config, helpers: { login, openApp, logout }, meta: { testVersion } } = uiTestCtx;

    const nightmare = new Nightmare(config.nightmare);

    this.timeout(Number(config.test_timeout));
    let institutionId = null;
    let campusId = null;
    let libraryId = null;
    const wait = 222;

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

      // @@const deletePath = `div[title="${gid}"] ~ div:last-of-type button[id*="delete"]`;

      it('should open app and find version tag', (done) => {
        nightmare
          .use(openApp(nightmare, config, done, 'users', testVersion))
          .then(result => result);
      });
      it(`should create an institution "${institutionName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-institutions"]')
          .click('a[href="/settings/organization/location-institutions"]')
          .wait(wait)
          .waitUntilNetworkIdle(500)

          .wait('#clickable-add-institutions')
          .click('#clickable-add-institutions')
          .wait('input[name="items[0].name"]')
          .insert('input[name="items[0].name"]', institutionName)
          .insert('input[name="items[0].code"]', institutionCode)
          .wait('#clickable-save-institutions-0')
          .click('#clickable-save-institutions-0')
          .wait(`#editList-institutions [title="${institutionName}"]`)
          .then(() => { done(); })
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
              .wait(`#editList-campuses [title="${campusName}"]`)
              .then(() => { done(); })
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
              .wait(`#editList-libraries [title="${libraryName}"]`)
              .then(() => { done(); })
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
              // TODO: add service points
              // .wait(1000)
              // .wait('#clickable-save-location')
              // .click('#clickable-save-location')
              // .waitUntilNetworkIdle(1000)
              .then(() => { done(); })
              .catch(done);
          })
          .catch(done)
      });

      it('should confirm creation of new location', (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-locations"]')
          .click('a[href="/settings/organization/location-locations"]')
          .wait((name) => {
            const location = document.evaluate(`//a[.="${name}"]`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (location.singleNodeValue) {
              return true;
            }

            return false;
          }, locationName)
          .xclick(`//a[.="${locationName}"]`)
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

      it(`should fail to delete institution "${institutionName}"`, (done) => {
        const deletePath = `div[title="${institutionName}"] ~ div:last-of-type button[id*="delete"]`;
        const ackButtonPath = 'div[aria-label="Cannot delete institution"] button';

        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-institutions"]')
          .click('a[href="/settings/organization/location-institutions"]')
          .wait(wait)
          .wait((dp) => {
            const dnode = document.querySelector(dp);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, deletePath)
          .click(deletePath)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .click('#clickable-deleteinstitution-confirmation-confirm')
          .wait((ackButton) => {
            const dnode = document.querySelector(ackButton);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, ackButtonPath)
          .wait(wait)
          .click(ackButtonPath)
          .then(() => { done(); })
          .catch(done);
      });

      it(`should fail to delete campus "${campusName}"`, (done) => {
        const deletePath = `div[title="${campusName}"] ~ div:last-of-type button[id*="delete"]`;
        const ackButtonPath = 'div[aria-label="Cannot delete campus"] button';

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
          .wait(wait)
          .wait((dp) => {
            const dnode = document.querySelector(dp);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, deletePath)
          .click(deletePath)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .click('#clickable-deletecampus-confirmation-confirm')
          .wait((ackButton) => {
            const dnode = document.querySelector(ackButton);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, ackButtonPath)
          .wait(wait)
          .click(ackButtonPath)
          .then(() => { done(); })
          .catch(done);
      });

      it(`should fail to delete library "${libraryName}"`, (done) => {
        const deletePath = `div[title="${libraryName}"] ~ div:last-of-type button[id*="delete"]`;
        const ackButtonPath = 'div[aria-label="Cannot delete library"] button';

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
          .wait(wait)
          .wait((dp) => {
            const dnode = document.querySelector(dp);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, deletePath)
          .click(deletePath)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .click('#clickable-deletelibrary-confirmation-confirm')
          .wait((ackButton) => {
            const dnode = document.querySelector(ackButton);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, ackButtonPath)
          .wait(wait)
          .click(ackButtonPath)
          .then(() => { done(); })
          .catch(done);
      });

      it(`should delete the location "${locationName}"`, (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-locations"]')
          .click('a[href="/settings/organization/location-locations"]')
          .waitUntilNetworkIdle(500)
          .wait(`a[href="/settings/organization/location-locations/${uuid}"]`)
          .click(`a[href="/settings/organization/location-locations/${uuid}"]`)
          .wait(wait)
          .wait('#clickable-edit-item')
          .click('#clickable-edit-item')
          .wait('#clickable-delete-location')
          .click('#clickable-delete-location')
          .wait('#clickable-deletelocation-confirmation-confirm')
          .click('#clickable-deletelocation-confirmation-confirm')
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .wait(wait)
          .then(() => { done(); })
          .catch(done);
      });
      it('should confirm deletion', (done) => {
        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-locations"]')
          .click('a[href="/settings/organization/location-locations"]')
          .wait(wait)
          .wait((euuid) => {
            const element = document.querySelector(`a[href*="${euuid}"]`);
            if (element) {
              return false;
            }

            return true;
          }, uuid)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .then(() => { done(); })
          .catch(done);
      });

      it(`should delete the library "${libraryName}"`, (done) => {
        const deletePath = `div[title="${libraryName}"] ~ div:last-of-type button[id*="delete"]`;

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
          .wait(wait)
          .wait((dp) => {
            const dnode = document.querySelector(dp);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, deletePath)
          .click(deletePath)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .click('#clickable-deletelibrary-confirmation-confirm')
          .wait(wait)
          .then(() => { done(); })
          .catch(done);
      });
      it(`should confirm the library "${libraryName}" has been deleted`, (done) => {
        nightmare
          .wait(wait)
          .wait((id) => {
            const element = document.querySelector(`a[href*="${id}"]`);
            if (element) {
              return false;
            }

            return true;
          }, libraryId)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .then(() => { done(); })
          .catch(done);
      });
      it(`should delete the campus "${campusName}"`, (done) => {
        const deletePath = `div[title="${campusName}"] ~ div:last-of-type button[id*="delete"]`;

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
          .wait(wait)
          .wait((dp) => {
            const dnode = document.querySelector(dp);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, deletePath)
          .click(deletePath)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .click('#clickable-deletecampus-confirmation-confirm')
          .wait(wait)
          .then(() => { done(); })
          .catch(done);
      });
      it(`should confirm the campus "${campusName}" has been deleted`, (done) => {
        nightmare
          .wait(wait)
          .wait((id) => {
            const element = document.querySelector(`a[href*="${id}"]`);
            if (element) {
              return false;
            }

            return true;
          }, campusId)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .then(() => { done(); })
          .catch(done);
      });

      it(`should delete the institution "${institutionName}"`, (done) => {
        const deletePath = `div[title="${institutionName}"] ~ div:last-of-type button[id*="delete"]`;

        nightmare
          .click(config.select.settings)
          .wait('a[href="/settings/organization"]')
          .wait(wait)
          .click('a[href="/settings/organization"]')
          .wait('a[href="/settings/organization/location-institutions"]')
          .click('a[href="/settings/organization/location-institutions"]')
          .wait(wait)
          .wait((dp) => {
            const dnode = document.querySelector(dp);
            if (dnode !== null) {
              return true;
            }
            return false;
          }, deletePath)
          .click(deletePath)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .click('#clickable-deleteinstitution-confirmation-confirm')
          .wait(wait)
          .then(() => { done(); })
          .catch(done);
      });
      it(`should confirm the institution "${institutionName}" has been deleted`, (done) => {
        nightmare
          .wait(wait)
          .wait((id) => {
            const element = document.querySelector(`a[href*="${id}"]`);
            if (element) {
              return false;
            }

            return true;
          }, institutionId)
          .wait(parseInt(process.env.FOLIO_UI_DEBUG, 10) ? parseInt(config.debug_sleep, 10) : 555) // debugging
          .then(() => { done(); })
          .catch(done);
      });
    });
  });
};
