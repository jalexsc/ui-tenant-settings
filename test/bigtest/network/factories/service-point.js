import { Factory, faker } from '@bigtest/mirage';

export default Factory.extend({
  name: () => faker.company.catchPhrase(),
  code: () => faker.company.catchPhrase(),
  discoveryDisplayName: () => faker.company.catchPhrase(),
  pickupLocation: () => true,
  holdShelfExpiryPeriod: () => ({
    duration: 2,
    intervalId: 'Days',
  }),
  staffSlips: () => ([
    {
      id: '3a051dda-3220-4569-a3d3-daeda2bd1abe',
      printByDefault: true
    },
    {
      id: '2d98bae1-1967-4136-9992-d846cb6e78a6',
      printByDefault: false
    },
  ]),
});
