import { expect } from 'chai';
import {
  describe,
  it,
} from '@bigtest/mocha';

import composeValidators from '../../../../src/util/composeValidators';

describe('locationCodeValidator', () => {
  it('should have validation errors', function () {
    const validators = [
      ({ control1 }) => ({ control1: `${control1} is invalid` }),
      ({ control2 }) => ({ control2: `${control2} is invalid` }),
      () => ({}),
    ];
    const validationErrors = composeValidators(...validators)({
      control1: 'value1',
      control2: 'value2',
      control3: 'value3',
    });

    expect(validationErrors).to.deep.equal({
      control1: 'value1 is invalid',
      control2: 'value2 is invalid',
    });
  });
});
