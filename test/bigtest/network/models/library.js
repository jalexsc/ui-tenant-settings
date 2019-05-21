import { Model, hasMany, belongsTo } from '@bigtest/mirage';

export default Model.extend({
  locations: hasMany(),
  campus: belongsTo(),
  institution: belongsTo(),
});
