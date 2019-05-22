import { Model, hasMany } from '@bigtest/mirage';

export default Model.extend({
  // mirage is not able to pluralize campus correctly to campuses :(
  campus: hasMany(),
});
