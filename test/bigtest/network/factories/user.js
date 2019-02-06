import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  username: faker.internet.userName,
  personal: {
    email: faker.internet.email,
    firstName: faker.name.firstName,
    lastName: faker.name.lastName,
  },
});
