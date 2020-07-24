import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  library: belongsTo(),
  campus: belongsTo(),
  institution: belongsTo(),
});
