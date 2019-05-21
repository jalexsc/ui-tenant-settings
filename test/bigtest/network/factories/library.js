
import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  name: faker.company.catchPhrase(),
  code: faker.company.catchPhrase(),

  afterCreate(library, server) {
    const location = server.create('location');
    library.locations = [location];
    library.save();
  }
});
