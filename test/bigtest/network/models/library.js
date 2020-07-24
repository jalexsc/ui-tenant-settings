import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  locations: hasMany(),
  campus: belongsTo(),
});
