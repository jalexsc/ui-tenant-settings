/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
export default function defaultScenario(server) {
  server.create('staffSlip', { name: 'Hold' });
  server.create('staffSlip', { name: 'Transit' });
}
