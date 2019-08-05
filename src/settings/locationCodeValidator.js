import React from 'react';
import { FormattedMessage } from 'react-intl';

const locationCodeValidator = {
  validate({ code }) {
    return !code
      ? { code: <FormattedMessage id="stripes-core.label.missingRequiredField" /> }
      : {};
  }
};

export default locationCodeValidator;
