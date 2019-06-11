
import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  id: faker.random.uuid,
  module: 'ORG',
  configName: 'localeSettings',
  enabled: 'true',
  value: '{ currency: "USD" }'
});
