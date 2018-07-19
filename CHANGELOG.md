# Change history for ui-organization

## 2.3.0 (IN PROGRESS)

* Refactor usage of dataKey. Fixes UIORG-36.
* Setup CRUD for Shelving Locations v1. Fixes UIORG-2.
* Expanded SSO configuration page with new fields. Added interface dependency for `mod-login-saml`. Fixes UIORG-25.
* Upgrade dependencies to stripes-components 1.9.0.
* Delete `metadata` sub-record from configuration before resubmitting it to mod-configuration, which rejects the record if it's included. Avoids a 422 Unprocessable Entity error. Fixes UIORG-29.
* Upgrade stripes-connect dependency to v3.0.0-pre.1. Fixes UIORG-38 (at least, with the present git master).
* Add save buttons to organization settings. Fixes UIORG-41.
* Use more-current stripes-components. Refs STRIPES-495.
* Add single save button to preferred plugins page. Fixes UIORG-42.
* Refactor settings to use ConfigManager. Fixes UIORG-44.
* Add Okapi URL to SSO configuration page. Fixes UIORG-40.
* Add validation for Okapi and IdP URLs. Fixes UIORG-43.
* Ignore yarn-error.log file. STRIPES-517.
* Location-Institution, campus, library, location CRUD. Fixes UIORG-54, UIORG-61, UIORG-65, UIORG-69.
* Add Service Point CRUD. Fixes UIORG-50.
* Add Okapi interfaces to package.json. Fixes UIORG-73.
* Fix up panel display for Shelving Locations settings. Fixes FOLIO-1208.
* You know what? Just remove that Shelving Locations panel. Use Location setup: locations instead. Refs FOLIO-1208.
* Remove fee fine owner from service points settings page. Fixes UIORG-74.
* Additional location fields. Refs UIORG-69.
* Add location permission set. Fixes UIORG-76.
* Better parens handling for institutions. Refs UIORG-69.
* Include location-count on libraries page. Refs UIORG-66.
* Refresh lookup tables on mount. Refs UIORG-69.
* Refactoring away structures. Refs STCOM-277.
* Refresh location counts on mount. Refs UIORG-60, UIORG-63, UIORG-66.
* Add user-permissions to location permission set for their metadata. Refs UIORG-76.
* Perform field-level validation of unique names, codes on save too.
* Hide Campus and Library CRUD panels until Institution and Campus filters are valid. Refs UIORG-82, UIORG-83.
* Location CRUD cleanup. Refs UIORG-69.
* Location managment tests!
* Refactor asyncValidation so failures persist through blurs. Refs UIORG-69.
* Assign locations to service points. Fixes UIORG-90.
* stripes-core MUST be a peer-dep to avoid dupes in the bundle. Dupes are bad.

## [2.2.0](https://github.com/folio-org/ui-organization/tree/v2.2.0) (2017-09-01)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.1.0...v2.2.0)

* Use translations for headings of some settings pages. Fixes UIORG-24.
* Switch manifest data to resources. Fixes UIORG-21.
* Add numerous settings-related permissions. Fixes UIORG-26.
* Add SSO configuration page with IdP URL setting. Fixes UIORG-16.
* Upgrade dependencies to stripes-components 1.7.0, stripes-connect 2.7.0 and stripes-core 2.7.0.

## [2.1.0](https://github.com/folio-org/ui-organization/tree/v2.1.0) (2017-07-11)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v2.0.0...v2.1.0)

* `<PluginType>` editor now offers special "(none)" value. Fixes UIORG-17.
* Ability to edit preferences for multiple plugins. Fixes UIORG-18.
* Bump `configuration` interface dependency to v2.0. Fixes UIORG-19.
* Bump Stripes dependencies: stripes-components from v0.15.0 to v1.2.0, stripes-core from v1.14.0 to v2.1.0 and stripes-connect from v2.3.0 to v2.4.0.

## [2.0.0](https://github.com/folio-org/ui-organization/tree/v2.0.0) (2017-07-03)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v1.1.0...v2.0.0)

* Add `okapiInterfaces` and `permissionSets` to `package.json`. Fixes UIORG-13.
* Upgrade to `configuration` interface v1.0. Fixes UIORG-15.
* Use %{foo} instead of ${foo} for CQL string interpolation. Part of STRPCONN-5.

## [1.1.0](https://github.com/folio-org/ui-organization/tree/v1.1.0) (2017-06-19)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v1.0.0...v1.1.0)

* Key-bindings editor validates JSON on the fly. Fixes UIORG-8.
* Locale-changes take effect instantly, not requiring a logout/login. Fixes UIORG-9. (Requires stripes-core v1.14.0, so dependency was updated accordingly.)
* Stripes-connect resource names in the bindings editor made unique within the module.

## [1.0.0](https://github.com/folio-org/ui-organization/tree/v1.0.0) (2017-06-16)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.5.0...v1.0.0)

* Add new settings section, hotkeys editor. Presently just a text-area, will become more sophisticated later. Fixes UIORG-7.
* The step up to v1.0 does not indicate a major change, but graduating into full semantic versioning.

## [0.5.0](https://github.com/folio-org/ui-organization/tree/v0.5.0) (2017-06-11)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.4.0...v0.5.0)

* Add two locales: de-DE (German - Germany) and hu-HU (Hungarian)
* Remove the "About" area, which has been superseded by Stripes Core's own About page.

## [0.4.0](https://github.com/folio-org/ui-organization/tree/v0.4.0) (2017-05-18)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.3.0...v0.4.0)

* Add new plugin-type settings. Fixes STRIPES-380.
* We no longer pass all props into the `<Pluggable>` component, only the ones it needs.
* The list of back-end modules in the About settings is now sorted by name.
* All settings components now use the `label` prop, passed in from the `<Settings>` in stripes-components v0.9.0.

## [0.3.0](https://github.com/folio-org/ui-organization/tree/v0.3.0) (2017-05-18)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.2.0...v0.3.0)

* Add a markdown-editor plugin surface to the About page. Proof of concept for STRIPES-379.

## [0.2.0](https://github.com/folio-org/ui-organization/tree/v0.2.0) (2017-05-16)
[Full Changelog](https://github.com/folio-org/ui-organization/compare/v0.1.0...v0.2.0)

* Add an "About" page within the Organization settings. At present this shows the list of modules running on the back-end, together with the module details as returned from Okapi. Fixes STRIPES-378.

## [0.1.0](https://github.com/folio-org/ui-organization/tree/v0.1.0) (2017-05-05)

* The first formal release.
