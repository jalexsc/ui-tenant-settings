import { Model, hasMany, belongsTo } from 'miragejs';

export default Model.extend({
  libraries: hasMany(),
  institution: belongsTo(),
});
