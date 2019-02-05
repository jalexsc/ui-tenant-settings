import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import setupApplication from '../helpers/setup-application';
import ServicePointShowPage from '../interactors/service-point-show';

describe('ServicePointShow', () => {
  setupApplication();
  let servicePoint;

  beforeEach(function () {
    servicePoint = this.server.create('servicePoint');
  });

  beforeEach(function () {
    this.visit(`/settings/organization/servicePoints/${servicePoint.id}`);
  });

  it('displays staff slips', () => {
    expect(ServicePointShowPage.holdSlipList(0).text).to.equal('Hold - yes');
    expect(ServicePointShowPage.holdSlipList(1).text).to.equal('Transit - no');
  });
});
