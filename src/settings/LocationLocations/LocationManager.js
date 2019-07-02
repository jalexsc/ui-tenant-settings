import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';
import { Select, Button, Headline, Row, Col } from '@folio/stripes/components';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
  sortBy,
  cloneDeep,
  isEmpty,
} from 'lodash';

import LocationDetail from './LocationDetail';
import LocationForm from './LocationForm';

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
  });

  static propTypes = {
    intl: intlShape.isRequired,
    label: PropTypes.node.isRequired,
    location: PropTypes.object,
    resources: PropTypes.shape({
      entries: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      servicePoints: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      institutions: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      campuses: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
      libraries: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
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
      uniquenessValidator: PropTypes.object,
      holdingsEntries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
      itemEntries: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),

    }).isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }),
  };

  constructor(props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.asyncValidate = this.asyncValidate.bind(this);
    this.filterRow = this.filterRow.bind(this);
    this.connectedLocationDetail = props.stripes.connect(LocationDetail);

    this.state = {
      institutionId: null,
      campusId: null,
      libraryId: null,
      servicePointsById: {},
      servicePointsByName: {}
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

  validate(values) {
    const errors = {};
    const requiredFields = ['name', 'code', 'discoveryDisplayName', 'institutionId', 'campusId', 'libraryId', 'isActive'];
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
  }

  asyncValidate(values, dispatch, props, fieldName) {
    const value = values[fieldName];

    // value hasn't changed since init; assume it's legit.
    if (props.initialValues && value === props.initialValues[fieldName]) {
      return Promise.resolve();
    }

    // query for locations with matching values and reject if any are found
    return new Promise((resolve, reject) => {
      const validator = this.props.mutator.uniquenessValidator;
      const query = `(${fieldName}=="${value}")`;
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
  }

  onChangeInstitution = (e) => {
    this.setState({ institutionId: e.target.value, campusId: null });
  }

  onChangeCampus = (e) => {
    this.setState({ campusId: e.target.value, libraryId: null });
  }

  onChangeLibrary = (e) => {
    this.setState({ libraryId: e.target.value });
  }

  filterRow(row) {
    return (row.libraryId === this.state.libraryId);
  }

  renderFilter() {
    const { resources, intl: { formatMessage } } = this.props;
    const { institutionId, campusId, libraryId } = this.state;
    const campuses = [];
    const libraries = [];

    const institutions = ((resources.institutions || {}).records || []).map(i => (
      { value: i.id, label: `${i.name}${i.code ? ` (${i.code})` : ''}` }
    ));

    if (!institutions.length) {
      return <div />;
    }

    ((resources.campuses || {}).records || []).forEach(c => {
      if (c.institutionId === institutionId) {
        campuses.push({ value: c.id, label: `${c.name}${c.code ? ` (${c.code})` : ''}` });
      }
    });

    ((resources.libraries || {}).records || []).forEach(c => {
      if (c.campusId === campusId) {
        libraries.push({ value: c.id, label: `${c.name}${c.code ? ` (${c.code})` : ''}` });
      }
    });

    return (
      <div>
        <Select
          label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
          id="institutionSelect"
          name="institutionSelect"
          dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.institutions.selectInstitution' }), value: '' }, ...institutions]}
          onChange={this.onChangeInstitution}
        />
        {institutionId && <Select
          label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
          id="campusSelect"
          name="campusSelect"
          dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.campuses.selectCampus' }), value: '' }, ...campuses]}
          onChange={this.onChangeCampus}
        />}
        {campusId && <Select
          label={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />}
          id="librarySelect"
          name="campusSelect"
          dataOptions={[{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.libraries.selectLibrary' }), value: '' }, ...libraries]}
          onChange={this.onChangeLibrary}
        />}
        <Row between="xs">
          <Col xs>
            <Headline size="medium" margin="none"><FormattedMessage id="ui-tenant-settings.settings.location.locations" /></Headline>
          </Col>
          <Col xs>
            <Row end="xs">
              <Col xs>
                <Button to={`${this.props.location.pathname}?layer=add`} marginBottom0 id="clickable-add-location">
                  <FormattedMessage id="stripes-components.button.new" />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
        {!libraryId &&
          <div><FormattedMessage id="ui-tenant-settings.settings.location.locations.missingSelection" /></div>
        }
      </div>
    );
  }

  parseInitialValues(loc) {
    if (!loc) return loc;

    loc.detailsArray = Object.keys(loc.details || []).map(name => {
      return { name, value: loc.details[name] };
    }).sort();

    return loc;
  }

  render() {
    const { institutionId, campusId, libraryId } = this.state;
    const { resources } = this.props;

    const locations = cloneDeep((resources.entries || {}).records || []).map((location) => {
      location.servicePointIds = (location.servicePointIds || []).map(id => ({
        selectSP: this.state.servicePointsById[id],
        primary: (location.primaryServicePoint === id),
      }));
      return location;
    });

    return (
      <EntryManager
        stripes={this.props.stripes}
        defaultEntry={{ isActive: true, institutionId, campusId, libraryId, servicePointIds: [{ selectSP: '', primary: true }] }}
        clonable
        addMenu={(<div />)}
        parentMutator={this.props.mutator}
        locationResources={this.props.resources}
        entryList={sortBy(locations, ['name'])}
        detailComponent={this.connectedLocationDetail}
        paneTitle={this.props.label}
        servicePointsByName={this.state.servicePointsByName}
        servicePointsById={this.state.servicePointsById}
        parseInitialValues={this.parseInitialValues}
        entryLabel={this.props.intl.formatMessage({ id: 'ui-tenant-settings.settings.location.locations.location' })}
        entryFormComponent={LocationForm}
        validate={this.validate}
        asyncValidate={this.asyncValidate}
        asyncBlurFields={['name', 'code']}
        rowFilter={this.renderFilter()}
        rowFilterFunction={this.filterRow}
        nameKey="name"
        permissions={{
          put: 'settings.tenant-settings.enabled',
          post: 'settings.tenant-settings.enabled',
          delete: 'settings.tenant-settings.enabled',
        }}
      />
    );
  }
}

export default injectIntl(LocationManager);
