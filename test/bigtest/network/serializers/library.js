import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serialize(collecton) {
    const libs = collecton.models.map(m => m.attrs);

    return {
      loclibs: libs,
      totalRecords: libs.length,
    };
  }
});
