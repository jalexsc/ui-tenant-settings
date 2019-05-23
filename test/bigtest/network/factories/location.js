
import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.hacker.noun(),
  code: faker.hacker.abbreviation(),
  isActive: true,
  afterCreate(location, server) {
    const servicePoint = server.create('servicePoint');
    location.primaryServicePoint = servicePoint.id;
    location.servicePointIds = [servicePoint.id];
    location.save();
  }
});
