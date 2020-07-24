import { Model, hasMany } from 'miragejs';

export default Model.extend({
  campus: hasMany(),
});
