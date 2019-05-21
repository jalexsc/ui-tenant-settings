
import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.company.catchPhrase(),
  code: faker.company.catchPhrase(),
  isActive: true,
  // primaryServicePoint: '3a40852d-49fd-4df2-a1f9-6e2641a6e91f',
  // servicePointIds: ['3a40852d-49fd-4df2-a1f9-6e2641a6e91f'],
  afterCreate(location, server) {
    const servicePoint = server.create('servicePoint');
    location.primaryServicePoint = servicePoint.id;
    location.servicePointIds = [servicePoint.id];
    location.save();
  }
});
