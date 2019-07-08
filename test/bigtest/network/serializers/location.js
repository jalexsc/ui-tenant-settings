import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(collecton) {
    const locations = collecton.models.map(m => m.attrs);

    return {
      locations,
      totalRecords: locations.length,
    };
  }
});
