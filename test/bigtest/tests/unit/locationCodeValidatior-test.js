import { expect } from 'chai';
import {
  describe,
  it,
} from '@bigtest/mocha';

import locationCodeValidator from '../../../../src/settings/locationCodeValidator';

describe('locationCodeValidator', () => {
  it('should have validation error for invalid code', function () {
    const codeValidation = locationCodeValidator.validate({ code: '' });

    expect(codeValidation.code).to.exist;
  });

  it('should not have validation error for valid code', function () {
    const codeValidation = locationCodeValidator.validate({ code: 'code' });

    expect(codeValidation.code).to.not.exist;
  });
});
