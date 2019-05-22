
import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.hacker.noun(),
  code: faker.hacker.abbreviation(),

  afterCreate(institution, server) {
    const campus = server.create('campus', { institutionId: institution.id });
    campus.institutionId = institution.id;
    institution.campus = [campus];
    institution.save();
  }
});
