import { expect } from 'chai';
import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';

import setupApplication from '../helpers/setup-application';
import Institutions from '../interactors/institutions';

describe('Institutions', () => {
  setupApplication();
  const institutions = new Institutions();

  beforeEach(async function () {
    this.visit('/settings/tenant-settings/location-institutions');
  });

  describe('validation:', () => {
    describe('name field', () => {
      beforeEach(async function () {
        await institutions.newButton();
        await institutions.nameField.fillAndBlur('');
      });

      it('should be validated for existence', () => {
        expect(institutions.nameField.inputError).to.be.true;
      });
    });

    describe('code field', () => {
      beforeEach(async function () {
        await institutions.newButton();
        await institutions.codeField.fillAndBlur('');
      });

      it('should be validated for existence', () => {
        expect(institutions.codeField.inputError).to.be.true;
      });
    });
  });
});
