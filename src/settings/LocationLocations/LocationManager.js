import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import {
  cloneDeep,
  find,
  isEmpty,
  omit,
  get,
  forEach,
} from 'lodash';
import queryString from 'query-string';

import {
  SearchAndSortQuery,
  buildUrl,
} from '@folio/stripes/smart-components';
import {
  Select,
  Button,
  Headline,
  Row,
  Col,
  Pane,
  Paneset,
  MultiColumnList,
  Layer,
  Callout,
} from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

import LocationDetail from './LocationDetail';
import LocationForm from './LocationForm';
import { SORT_TYPES } from '../../constants';

class LocationManager extends React.Component {
  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
    },
    uniquenessValidator: {
      type: 'okapi',
      records: 'locations',
      accumulate: 'true',
      path: 'locations',
      fetch: false,
    },
    institutions: {
      type: 'okapi',
      path: 'location-units/institutions',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'locinsts',
      accumulate: true,
    },
    campuses: {
      type: 'okapi',
      path: 'location-units/campuses',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'loccamps',
      accumulate: true,
    },
    libraries: {
      type: 'okapi',
      path: 'location-units/libraries',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      records: 'loclibs',
      accumulate: true,
    },
    servicePoints: {
      type: 'okapi',
      records: 'servicepoints',
      path: 'service-points',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '1000',
      },
      resourceShouldRefresh: true,
    },
    holdingsEntries: {
      type: 'okapi',
      path: 'holdings-storage/holdings',
      records: 'holdingsRecords',
      accumulate: true,
    },
    itemEntries: {
      type: 'okapi',
      path: 'inventory/items',
      records: 'items',
      accumulate: true,
    },
    courselistingEntries: {
      type: 'okapi',
      path: 'coursereserves/courselistings',
      records: 'courseListings',
      accumulate: true,
    },
    reserveEntries: {
      type: 'okapi',
      path: 'coursereserves/reserves',
      records: 'reserves',
      accumulate: true,
    },
  });

  static propTypes = {
    intl: PropTypes.object,
    label: PropTypes.node.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
      servicePoints: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
      institutions: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
      campuses: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
      libraries: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object) }),
    }).isRequired,
    mutator: PropTypes.shape({
      entries: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
      servicePoints: PropTypes.shape({
        POST: PropTypes.func,
        PUT: PropTypes.func,
        DELETE: PropTypes.func,
      }),
      institutions: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      campuses: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      libraries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      holdingsEntries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      itemEntries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      courselistingEntries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      reserveEntries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      uniquenessValidator: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      hasInterface: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      institutionId: '',
      campusId: '',
      libraryId: '',
      servicePointsById: {},
      servicePointsByName: {},
      selectedId: this.initialSelectedLocationId,
      ...this.initialSort,
    };

    this.callout = React.createRef();

    const { formatMessage } = props.intl;

    this.entryLabel = formatMessage({ id: 'ui-tenant-settings.settings.location.locations.location' });
    this.locationListVisibleColumns = ['isActive', 'name', 'code'];
    this.locationListColumnMapping = {
      isActive: formatMessage({ id: 'ui-tenant-settings.settings.location.locations.status' }),
      name: formatMessage({ id: 'ui-tenant-settings.settings.location.locations.detailsName' }),
      code: formatMessage({ id: 'ui-tenant-settings.settings.location.code' }),
    };
    this.locationListFormatter = {
      isActive: item => {
        const locationId = item.isActive ? 'active' : 'inactive';

        return formatMessage({ id: `ui-tenant-settings.settings.location.locations.${locationId}` });
      }
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { resources } = nextProps;
    const servicePointsByName = {};
    if (resources.servicePoints && resources.servicePoints.hasLoaded) {
      const servicePointsById = ((resources.servicePoints || {}).records || []).reduce((map, item) => {
        map[item.id] = item.name;
        servicePointsByName[item.name] = item.id;
        return map;
      }, {});
      return { servicePointsById, servicePointsByName };
    }
    return null;
  }

  /**
   * Refresh lookup tables when the component mounts. Fetches in the manifest
   * will only run once (in the constructor) but because this object may be
   * unmounted/remounted without being destroyed/recreated, the lookup tables
   * will be stale if they change between unmounting/remounting.
   */
  componentDidMount() {
    ['institutions', 'campuses', 'libraries'].forEach(i => {
      this.props.mutator[i].reset();
      this.props.mutator[i].GET();
    });
  }

  get initialSelectedLocationId() {
    const { location } = this.props;

    const idFromPathnameRe = '/([^/]+)$';
    const reMatches = new RegExp(idFromPathnameRe).exec(location.pathname);

    return reMatches ? reMatches[1] : null;
  }

  get initialSort() {
    const { location: { search } } = this.props;

    const {
      sort = 'name',
      sortDir = SORT_TYPES.ASCENDING,
    } = queryString.parse(search.slice(1));

    return {
      sort,
      sortDir,
    };
  }

  onSort = (e, { name: fieldName }) => {
    const {
      sort,
      sortDir,
    } = this.state;

    const isSameField = sort === fieldName;
    let newSortDir = SORT_TYPES.ASCENDING;

    if (isSameField) {
      newSortDir = newSortDir === sortDir ? SORT_TYPES.DESCENDING : newSortDir;
    }

    const sortState = {
      sort: fieldName,
      sortDir: newSortDir,
    };

    this.setState(sortState);
    this.transitionToParams(sortState);
  };

  onSelectRow = (e, meta) => {
    const { match: { path } } = this.props;

    this.transitionToParams({ _path: `${path}/${meta.id}` });
    this.setState({ selectedId: meta.id });
  };

  transitionToParams(values) {
    const {
      location,
      history,
    } = this.props;

    const url = buildUrl(location, values);

    history.push(url);
  }

  validate = values => {
    const errors = {};
    const requiredFields = ['name', 'code', 'discoveryDisplayName', 'institutionId', 'campusId', 'libraryId'];
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
      }
    });

    const detailsErrors = [];
    if (values.detailsArray) {
      values.detailsArray.forEach((entry, i) => {
        const detailErrors = {};
        if (!entry || !entry.name) {
          detailErrors.name = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
          detailsErrors[i] = detailErrors;
        }

        if (!entry || !entry.value) {
          detailErrors.value = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
          detailsErrors[i] = detailErrors;
        }

        if (!entry.name && !entry.value) {
          detailsErrors[i] = {};
        }
      });

      if (detailsErrors.length) {
        errors.detailsArray = detailsErrors;
      }
    }

    if (!values.servicePointIds || !values.servicePointIds.length) {
      errors.servicePointIds = { _error: 'At least one Service Point must be entered' };
    } else {
      const servicePointErrors = [];
      values.servicePointIds.forEach((entry, i) => {
        const servicePointError = {};
        if (!entry || !entry.selectSP) {
          servicePointError.selectSP = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
          servicePointErrors[i] = servicePointError;
        }
        if ((!entry.selectSP && !entry.primary) || (values.servicePointIds.length === 1 && Object.keys(entry).length > 2)) {
          servicePointErrors[i] = {};
        }
      });

      if (servicePointErrors.length > 0) {
        errors.servicePointIds = servicePointErrors;
      }
    }

    return errors;
  };

  asyncValidate = (values, dispatch, props, fieldName) => {
    const value = values[fieldName];

    // value hasn't changed since init; assume it's legit.
    if (props.initialValues && value === props.initialValues[fieldName]) {
      return Promise.resolve();
    }

    // query for locations with matching values and reject if any are found
    return new Promise((resolve, reject) => {
      const validator = this.props.mutator.uniquenessValidator;
      const query = `(${fieldName}=="${value.replace(/"/gi, '\\"')}")`;
      validator.reset();

      return validator.GET({ params: { query } }).then((locs) => {
        const errors = { ...props.asyncErrors };

        if (isEmpty(locs) && isEmpty(props.asyncErrors)) {
          return resolve();
        }

        if (!isEmpty(locs)) {
          errors[fieldName] = (
            <FormattedMessage
              id={`ui-tenant-settings.settings.location.locations.validation.${fieldName}.unique`}
            />
          );
        }

        return reject(errors);
      });
    });
  };

  onChangeInstitution = (e) => {
    this.setState({
      institutionId: e.target.value,
      campusId: '',
      libraryId: '',
    });
  };

  onChangeCampus = (e) => {
    this.setState({
      campusId: e.target.value,
      libraryId: '',
    });
  };

  onChangeLibrary = (e) => {
    this.setState({ libraryId: e.target.value });
  };

  renderFilter() {
    const {
      resources,
      location,
      intl: { formatMessage },
    } = this.props;
    const {
      institutionId,
      campusId,
      libraryId,
    } = this.state;

    const institutions = get(resources.institutions, 'records', [])
      .map(institution => ({
        value: institution.id,
        label: this.formatLocationDisplayName(institution),
      }));

    if (isEmpty(institutions)) {
      return <div />;
    }

    const campuses = get(resources.campuses, 'records', [])
      .filter(campus => campus.institutionId === institutionId)
      .map(campus => ({
        value: campus.id,
        label: this.formatLocationDisplayName(campus),
      }));

    const libraries = get(resources.libraries, 'records', [])
      .filter(library => library.campusId === campusId)
      .map(library => ({
        value: library.id,
        label: this.formatLocationDisplayName(library),
      }));

    return (
      <div>
        <div data-test-institution-select>
          <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
            id="institutionSelect"
            name="institutionSelect"
            value={institutionId}
            dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.institutions.selectInstitution' }), value: '' }, ...institutions]}
            onChange={this.onChangeInstitution}
          />
        </div>
        <div data-test-campus-select>
          {institutionId && <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
            id="campusSelect"
            name="campusSelect"
            value={campusId}
            dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.campuses.selectCampus' }), value: '' }, ...campuses]}
            onChange={this.onChangeCampus}
          />}
        </div>
        <div data-test-library-select>
          {campusId && <Select
            label={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />}
            id="librarySelect"
            name="campusSelect"
            value={libraryId}
            dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.libraries.selectLibrary' }), value: '' }, ...libraries]}
            onChange={this.onChangeLibrary}
          />}
        </div>
        <Row between="xs">
          <Col xs>
            <Headline size="medium" margin="none"><FormattedMessage id="ui-tenant-settings.settings.location.locations" /></Headline>
          </Col>
          <Col xs>
            <Row end="xs">
              <Col xs>
                <Button
                  id="clickable-add-location"
                  to={buildUrl(location, { layer: 'add' })}
                  marginBottom0
                >
                  <FormattedMessage id="stripes-components.button.new" />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        {!libraryId &&
          <FormattedMessage
            id="ui-tenant-settings.settings.location.locations.missingSelection"
            tagName="div"
          />
        }
      </div>
    );
  }

  formatLocationDisplayName(location) {
    return `${location.name}${location.code ? ` (${location.code})` : ''}`;
  }

  parseInitialValues(loc, cloning = false) {
    if (!loc) return loc;

    loc.detailsArray = Object.keys(loc.details || []).map(name => {
      return { name, value: loc.details[name] };
    }).sort();

    return cloning ? omit(loc, 'id') : loc;
  }

  handleDetailClose = () => {
    this.transitionToParams({ _path: this.props.match.path });
    this.setState({ selectedId: null });
  };

  prepareLocationsData() {
    const { resources } = this.props;
    const {
      sort,
      sortDir,
    } = this.state;

    const sortDirValue = sortDir === SORT_TYPES.ASCENDING ? 1 : -1;

    return cloneDeep((resources.entries || {}).records || []).map(location => {
      location.servicePointIds = (location.servicePointIds || []).map(id => ({
        selectSP: this.state.servicePointsById[id],
        primary: (location.primaryServicePoint === id),
      }));

      return location;
    }).sort((a, b) => sortDirValue * `${a[sort]}`.localeCompare(`${b[sort]}`));
  }

  onCancel = (e) => {
    if (e) {
      e.preventDefault();
    }

    this.transitionToParams({ layer: null });
  };

  handleDetailEdit = location => {
    this.setState({ selectedId: location.id });
    this.transitionToParams({ layer: 'edit' });
  };

  handleDetailClone = location => {
    this.setState({ selectedId: location.id });
    this.transitionToParams({ layer: 'clone' });
  };

  onRemove = location => {
    const {
      match,
      mutator,
    } = this.props;
    const promises = [];

    // Uses in Inventory
    {
      mutator.holdingsEntries.reset();
      mutator.itemEntries.reset();
      const query = `permanentLocationId=${location.id} or temporaryLocationId=${location.id}`;
      promises.push(mutator.holdingsEntries.GET({ params: { query } }));
      promises.push(mutator.itemEntries.GET({ params: { query } }));
    }

    // Uses in Course Reserves
    if (this.props.stripes.hasInterface('course-reserves-storage')) {
      mutator.courselistingEntries.reset();
      const query = `locationId=="${location.id}"`;
      promises.push(mutator.courselistingEntries.GET({ params: { query } }));
    }
    if (this.props.stripes.hasInterface('reserves-storage')) {
      mutator.reserveEntries.reset();
      const query = `copiedItem.temporaryLocationId=="${location.id}" or copiedItem.permanentLocationId=="${location.id}"`;
      promises.push(mutator.reserveEntries.GET({ params: { query } }));
    }

    return Promise.all(promises)
      .then(values => {
        if (undefined === values.find(records => records.length !== 0)) {
          return mutator.entries.DELETE(location);
        }

        return Promise.resolve(false);
      }).then((isRemoved) => {
        if (isRemoved !== false) {
          this.showCalloutMessage(location.name);
          this.transitionToParams({
            _path: `${match.path}`,
            layer: null
          });

          return Promise.resolve(true);
        }

        return Promise.resolve(false);
      });
  };

  onSave = location => {
    const { match } = this.props;

    const action = location.id ? 'PUT' : 'POST';

    return this.props.mutator.entries[action](location)
      .then(updatedLocation => {
        this.transitionToParams({
          _path: `${match.path}/${updatedLocation.id}`,
          layer: null,
        });
        this.setState({ selectedId: updatedLocation.id });
      })
      .catch(error => this.showSubmitErrorCallout(error.message || error.statusText));
  };

  showCalloutMessage(name) {
    if (!this.callout.current) return;

    const message = (
      <SafeHTMLMessage
        id="stripes-core.successfullyDeleted"
        values={{
          entry: this.entryLabel,
          name: name || '',
        }}
      />
    );

    this.callout.current.sendCallout({ message });
  }

  showSubmitErrorCallout(error) {
    if (!this.callout.current) return;

    this.callout.current.sendCallout({
      type: 'error',
      message: error || <FormattedMessage id="ui-tenant-settings.settings.save.error.network" />,
    });
  }

  render() {
    const {
      match,
      label,
      location: { search },
    } = this.props;
    const {
      institutionId,
      campusId,
      libraryId,
      sort,
      sortDir,
      selectedId,
      servicePointsById,
      servicePointsByName,
    } = this.state;

    const locations = this.prepareLocationsData();
    const contentData = locations.filter(row => row.libraryId === libraryId);
    const query = queryString.parse(search);
    const defaultEntry = { isActive: true, institutionId, campusId, libraryId, servicePointIds: [{ selectSP: '', primary: true }] };
    const adding = search.match('layer=add');
    const cloning = search.match('layer=clone');

    // Providing default 'isActive' value is used here when the 'isActive' property is missing in the 'locations' loaded via the API.
    forEach(contentData, location => {
      if (location.isActive === undefined) {
        location.isActive = true;
      }
    });

    const selectedItem = (selectedId && !adding)
      ? find(contentData, entry => entry.id === selectedId) : defaultEntry;

    const initialValues = this.parseInitialValues(selectedItem, cloning);

    const container = document.getElementById('ModuleContainer');

    if (!container) return (<div />);

    return (
      <Paneset
        defaultWidth="fill"
        data-test-entry-manager
      >
        <Pane
          defaultWidth="fill"
          paneTitle={label}
        >
          <SearchAndSortQuery>
            {() => (
              <Fragment>
                {this.renderFilter()}
                <MultiColumnList
                  id="locations-list"
                  contentData={contentData}
                  visibleColumns={this.locationListVisibleColumns}
                  columnMapping={this.locationListColumnMapping}
                  formatter={this.locationListFormatter}
                  selectedRow={selectedItem}
                  sortOrder={sort}
                  sortDirection={sortDir}
                  isEmptyMessage={null}
                  onHeaderClick={this.onSort}
                  onRowClick={this.onSelectRow}
                />
              </Fragment>
            )}
          </SearchAndSortQuery>
        </Pane>
        <Route
          path={`${match.path}/:id`}
          render={
            () => {
              if (!selectedItem) return null;

              return (
                <LocationDetail
                  initialValues={selectedItem}
                  servicePointsById={servicePointsById}
                  onEdit={this.handleDetailEdit}
                  onClone={this.handleDetailClone}
                  onClose={this.handleDetailClose}
                  onRemove={this.onRemove}
                />
              );
            }
          }
        />
        <FormattedMessage
          id="stripes-core.label.editEntry"
          values={{ entry: this.entryLabel }}
        >
          {contentLabel => (
            <Layer
              isOpen={Boolean(query.layer)}
              contentLabel={contentLabel}
              container={container}
            >
              <LocationForm
                locationResources={this.props.resources}
                servicePointsByName={servicePointsByName}
                initialValues={initialValues}
                validate={this.validate}
                asyncValidate={this.asyncValidate}
                onSave={this.onSave}
                onCancel={this.onCancel}
                onSubmit={this.onSave}
              />
            </Layer>
          )}
        </FormattedMessage>
        <Callout ref={this.callout} />
      </Paneset>
    );
  }
}

export default injectIntl(LocationManager);
