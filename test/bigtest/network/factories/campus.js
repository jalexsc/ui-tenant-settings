
import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.company.catchPhrase(),
  code: faker.company.catchPhrase(),

  afterCreate(campus, server) {
    const library = server.create('library');
    campus.libraries = [library];
    campus.save();
  }
});
