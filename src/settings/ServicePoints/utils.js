import React from 'react';
import { FormattedMessage } from 'react-intl';

export const validateServicePointForm = (values) => {
  const errors = {};

  if (!values.discoveryDisplayName) {
    errors.discoveryDisplayName = <FormattedMessage id="ui-tenant-settings.settings.servicePoints.validation.required" />;
  }

  if (!values.discoveryDisplayName) {
    errors.discoveryDisplayName = <FormattedMessage id="ui-tenant-settings.settings.servicePoints.validation.required" />;
  }

  let shelvingLagTime;
  try {
    shelvingLagTime = parseInt(values.shelvingLagTime, 10);
  } catch (e) {
    shelvingLagTime = 0;
  }

  if (shelvingLagTime <= 0) {
    errors.shelvingLagTime = <FormattedMessage id="ui-tenant-settings.settings.servicePoints.validation.numeric" />;
  }

  return errors;
};

export const getUniquenessValidation = (field, mutator) => {
  return (value, allValues, meta) => {
    if (!(value && meta.dirty)) return Promise.resolve();

    mutator.reset();

    const query = `(${field}=="${value}")`;

    return mutator.GET({ params: { query } })
      .then((servicePoints) => {
        if (servicePoints.length !== 0) return Promise.reject();

        return undefined;
      })
      .catch(() => {
        return <FormattedMessage id={`ui-tenant-settings.settings.servicePoints.validation.${field}.unique`} />;
      });
  };
};
