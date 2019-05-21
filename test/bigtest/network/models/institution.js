import { Model, hasMany } from '@bigtest/mirage';

export default Model.extend({
  campus: hasMany(),
});
