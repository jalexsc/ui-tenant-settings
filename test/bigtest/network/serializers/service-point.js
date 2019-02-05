import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(...args) {
    const json = ApplicationSerializer.prototype.serialize.apply(this, args);
    const { servicePoints } = json;
    return {
      servicepoints: servicePoints,
      totalRecords: servicePoints.length,
    };
  }
});
