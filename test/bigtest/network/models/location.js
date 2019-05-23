import { Model, belongsTo } from '@bigtest/mirage';

export default Model.extend({
  library: belongsTo(),
  campus: belongsTo(),
  institution: belongsTo(),
});
