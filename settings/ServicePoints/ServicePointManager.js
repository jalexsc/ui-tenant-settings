import { sortBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import EntryManager from '@folio/stripes-smart-components/lib/EntryManager';
import ServicePointDetail from './ServicePointDetail';
import ServicePointForm from './ServicePointForm';

function validate(values) {
  const errors = {};

  if (!values.name) {
    errors.name = 'Please fill this in to continue';
  }

  if (!values.code) {
    errors.code = 'Please fill this in to continue';
  }

  if (!values.discoveryDisplayName) {
    errors.discoveryDisplayName = 'Please fill this in to continue';
  }

  if (!values.discoveryDisplayName) {
    errors.discoveryDisplayName = 'Please fill this in to continue';
  }

  let shelvingLagTime = 0;
  try {
    shelvingLagTime = parseInt(values.shelvingLagTime, 10);
  }
  catch(e) {
  }

  if (shelvingLagTime <= 0) {
    errors.shelvingLagTime = "Please enter a number higher than 0";
  }

  return errors;
}

class ServicePointManager extends React.Component {
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
    }).isRequired,
    stripes: PropTypes.shape({
      intl: PropTypes.object.isRequired,
    }),
  };

  static manifest = Object.freeze({
    entries: {
      type: 'okapi',
      records: 'servicepoints',
      path: 'service-points',
    },
  });

  constructor() {
    super();
    this.validate = this.validate.bind.this();
  }

  translate(id) {
    this.props.stripes.intl.formatMessage({
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

    let shelvingLagTime = 0;
    try {
      shelvingLagTime = parseInt(values.shelvingLagTime, 10);
    }
    catch(e) {
    }

    if (shelvingLagTime <= 0) {
      errors.shelvingLagTime = this.translate('validation.numeric');
    }

    return errors;
  }

  render() {
    return (
      <EntryManager
        {...this.props}
        parentMutator={this.props.mutator}
        entryList={sortBy((this.props.resources.entries || {}).records || [], ['name'])}
        detailComponent={ServicePointDetail}
        paneTitle={this.props.label}
        entryLabel={this.props.label}
        entryFormComponent={ServicePointForm}
        validate={this.validate}
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
