
import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.company.catchPhrase(),
  code: faker.company.catchPhrase(),

  afterCreate(institution, server) {
    const campus = server.create('campus');
    institution.campus = [campus];
    institution.save();
  }
});
