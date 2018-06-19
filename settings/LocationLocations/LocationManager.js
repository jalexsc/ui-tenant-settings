import { sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import EntryManager from '@folio/stripes-smart-components/lib/EntryManager';
import { FormattedMessage } from 'react-intl';

import LocationDetail from './LocationDetail';
import LocationForm from './LocationForm';

class LocationManager extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({
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
    }).isRequired,
    stripes: PropTypes.shape({
      intl: PropTypes.object.isRequired,
      connect: PropTypes.func.isRequired,
    }),
  };

  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
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
        limit: '100',
      },
      records: 'locinsts',
      accumulate: true,
    },
    campuses: {
      type: 'okapi',
      path: 'location-units/campuses',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '100',
      },
      records: 'loccamps',
      accumulate: true,
    },
    libraries: {
      type: 'okapi',
      path: 'location-units/libraries',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '100',
      },
      records: 'loclibs',
      accumulate: true,
    },
  });

  constructor(props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.asyncValidate = this.asyncValidate.bind(this);
    this.connectedLocationDetail = props.stripes.connect(LocationDetail);
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

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.location.${id}`
    });
  }

  validate(values) {
    const errors = {};

    const requiredFields = ['name', 'code', 'discoveryDisplayName', 'institutionId', 'campusId', 'libraryId'];
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = this.props.stripes.intl.formatMessage({ id: 'stripes-core.label.missingRequiredField' });
      }
    });

    const detailsErrors = [];
    if (values.detailsArray) {
      values.detailsArray.forEach((entry, i) => {
        const detailErrors = {};
        if (!entry || !entry.name) {
          detailErrors.name = this.props.stripes.intl.formatMessage({ id: 'stripes-core.label.missingRequiredField' });
          detailsErrors[i] = detailErrors;
        }

        if (!entry || !entry.value) {
          detailErrors.value = this.props.stripes.intl.formatMessage({ id: 'stripes-core.label.missingRequiredField' });
          detailsErrors[i] = detailErrors;
        }
      });

      if (detailsErrors.length) {
        errors.detailsArray = detailsErrors;
      }
    }

    return errors;
  }

  asyncValidate(values, dispatch, props, blurredField) {
    const fieldName = blurredField;
    const value = values[fieldName];

    // value hasn't changed since init; assume it's legit.
    if (props.initialValues && value === props.initialValues[fieldName]) {
      return new Promise(resolve => resolve());
    }

    // query for locations with matching values and reject if any are found
    return new Promise((resolve, reject) => {
      const validator = this.props.mutator.uniquenessValidator;
      const query = `(${fieldName}=="${value}")`;
      validator.reset();

      return validator.GET({ params: { query } }).then((locs) => {
        if (locs.length === 0) return resolve();

        const error = {
          [fieldName]: <FormattedMessage id={`ui-organization.settings.location.locations.validation.${fieldName}.unique`} />
        };

        return reject(error);
      });
    });
  }

  render() {
    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        entryList={sortBy((this.props.resources.entries || {}).records || [], ['name'])}
        detailComponent={this.connectedLocationDetail}
        paneTitle={this.props.label}
        entryLabel={this.translate('locations.location')}
        entryFormComponent={LocationForm}
        validate={this.validate}
        asyncValidate={this.asyncValidate}
        asyncBlurFields={['name', 'code']}
        nameKey="name"
        permissions={{
          put: 'settings.organization.enabled',
          post: 'settings.organization.enabled',
          delete: 'settings.organization.enabled',
        }}
      />
    );
  }
}

export default LocationManager;
