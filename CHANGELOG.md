# Change history for ui-organization

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

