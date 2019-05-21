import { Model, hasMany, belongsTo } from '@bigtest/mirage';

export default Model.extend({
  libraries: hasMany(),
  institution: belongsTo(),
});
