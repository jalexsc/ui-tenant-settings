import { Factory } from 'miragejs';
import faker from 'faker';

export default Factory.extend({
  id: faker.random.uuid,
  module: 'ORG',
  configName: 'localeSettings',
  enabled: 'true',
  value: '{ currency: "USD" }'
});
