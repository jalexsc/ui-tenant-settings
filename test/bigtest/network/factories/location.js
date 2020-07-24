import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.hacker.noun(),
  code: faker.hacker.abbreviation(),
  isActive: true,
  details: {},
  afterCreate(location, server) {
    const servicePoint = server.create('servicePoint');
    location.primaryServicePoint = servicePoint.id;
    location.servicePointIds = [servicePoint.id];
    location.save();
  }
});
