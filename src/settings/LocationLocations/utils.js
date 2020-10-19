import React from 'react';
import { FormattedMessage } from 'react-intl';

export const validate = values => {
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

export const getUniquenessValidation = (field, mutator, id) => {
  return (value, allValues, meta) => {
    if (!value) return Promise.resolve();

    if (id && !meta.dirty) return Promise.resolve();

    mutator.reset();

    const query = `(${field}=="${value.replace(/"/gi, '\\"')}")`;

    return mutator.GET({ params: { query } })
      .then((locations) => {
        if (locations.length !== 0) return Promise.reject();

        return undefined;
      })
      .catch(() => {
        return <FormattedMessage id={`ui-tenant-settings.settings.location.locations.validation.${field}.unique`} />;
      });
  };
};
