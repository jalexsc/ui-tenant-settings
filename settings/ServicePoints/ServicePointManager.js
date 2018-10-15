import { sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { EntryManager } from '@folio/stripes/smart-components';
import { FormattedMessage } from 'react-intl';

import ServicePointDetail from './ServicePointDetail';
import ServicePointForm from './ServicePointForm';

class ServicePointManager extends React.Component {
  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'servicepoints',
      path: 'service-points?limit=100',
      resourceShouldRefresh: true,
    },
    uniquenessValidator: {
      type: 'okapi',
      records: 'servicepoints',
      accumulate: 'true',
      path: 'service-points',
      fetch: false,
    },
  });

  static propTypes = {
    label: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      entries: PropTypes.shape({
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

  constructor(props) {
    super(props);
    this.validate = this.validate.bind(this);
    this.asyncValidate = this.asyncValidate.bind(this);
    this.cServicePointForm = props.stripes.connect(ServicePointForm);
  }

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.servicePoints.${id}`
    });
  }

  validate(values) {
    const errors = {};

    if (!values.name) {
      errors.name = this.translate('validation.required');
    }

    if (!values.code) {
      errors.code = this.translate('validation.required');
    }

    if (!values.discoveryDisplayName) {
      errors.discoveryDisplayName = this.translate('validation.required');
    }

    if (!values.discoveryDisplayName) {
      errors.discoveryDisplayName = this.translate('validation.required');
    }

    let shelvingLagTime;
    try {
      shelvingLagTime = parseInt(values.shelvingLagTime, 10);
    } catch (e) {
      shelvingLagTime = 0;
    }

    if (shelvingLagTime <= 0) {
      errors.shelvingLagTime = this.translate('validation.numeric');
    }

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

        return validator.GET({ params: { query } }).then((servicePoints) => {
          if (servicePoints.length === 0) return resolve();

          const error = {
            [fieldName]: <FormattedMessage id={`ui-organization.settings.servicePoints.validation.${fieldName}.unique`} />
          };

          return reject(error);
        });
      });
    }

    return new Promise(resolve => resolve());
  }

  render() {
    let entryList = sortBy((this.props.resources.entries || {}).records || [], ['name']);
    entryList = entryList.map(item => {
      item.pickupLocation = item.pickupLocation || false;
      return item;
    });

    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        entryList={entryList}
        detailComponent={ServicePointDetail}
        paneTitle={this.props.label}
        entryLabel={this.props.label}
        entryFormComponent={this.cServicePointForm}
        onSelect={this.onSelect}
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

export default ServicePointManager;
