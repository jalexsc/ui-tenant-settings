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
    },
    campuses: {
      type: 'okapi',
      path: 'location-units/campuses',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '100',
      },
      records: 'loccamps',
    },
    libraries: {
      type: 'okapi',
      path: 'location-units/libraries',
      params: {
        query: 'cql.allRecords=1 sortby name',
        limit: '100',
      },
      records: 'loclibs',
    },

  });

  constructor(props) {
    super(props);

    this.validate = this.validate.bind(this);
    this.asyncValidate = this.asyncValidate.bind(this);
    this.connectedLocationDetail = props.stripes.connect(LocationDetail);
  }

  translate(id) {
    this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.location.${id}`
    });
  }

  validate(values) {
    const errors = {};

    const requiredFields = ['name', 'code', 'institutionId', 'campusId', 'libraryId', 'discoveryDisplayName'];
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = this.props.stripes.intl.formatMessage({ id: 'stripes-core.label.missingRequiredField' });
      }
    });

    return errors;
  }

  asyncValidate(values, dispatch, props, blurredField) {
    if (!blurredField) return new Promise(resolve => resolve());

    const fieldName = blurredField;
    const value = values[fieldName];

    if (fieldName.match(/name|code/) && value !== props.initialValues[fieldName]) {
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

    return new Promise(resolve => resolve());
  }

  render() {
    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        entryList={sortBy((this.props.resources.entries || {}).records || [], ['name'])}
        detailComponent={this.connectedLocationDetail}
        paneTitle={this.props.label}
        entryLabel={this.props.label}
        entryFormComponent={LocationForm}
        validate={this.validate}
        asyncValidate={this.asyncValidate}
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
