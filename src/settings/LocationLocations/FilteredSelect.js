import React from 'react';
import { Field } from 'react-final-form';
import PropTypes from 'prop-types';

/**
 * A FilteredSelect component has its dataOptions filtered such that it only
 * contains items from list that have a property, given by filterFieldId,
 * with a value that matches props[filterFieldId].
 *
 * This can be used in concert with redux-form's formValues function to
 * pass the value of another field (the filter field) to this component:
 *
   // the following creates a component named LibraryField which could
   // be instantiated on a form with a field named "campusId". The component
   // would receive the prop "campusId" containing the value of that field.
   const LibraryField = formValues('campusId')(FilteredSelect);
   export default LibraryField;

   // instantiate the component within a form:
   <LibraryField
     list={(resources.libraries || {}).records || []}
     filterFieldId="campusId"
     formatter={(i) => `${i.name} (${i.code})`}
     initialOption={{ label: 'Select a library' }}
     label="Library *"
     name="libraryId"
     id="input-location-library"
     component={Select}
     required
   />
 *
 * @param list array of potential options
 * @param filterFieldId string name of field to filter on
 * @param formatter function formatter for option-labels
 * @param initialOption object item to prepend to options
 */
const FilteredSelect = (props) => {
  const { list, filterFieldId, formatter, initialOption, ...rest } = props;
  const options = [];

  list.forEach(i => {
    if (i[filterFieldId] === props[filterFieldId]) {
      options.push({ label: formatter(i), value: i.id });
    }
  });

  const disabled = !options.length;

  delete rest[filterFieldId];
  if (initialOption) {
    options.unshift(initialOption);
  }

  return <Field
    {...rest}
    dataOptions={options}
    disabled={disabled}
  />;
};

FilteredSelect.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterFieldId: PropTypes.string.isRequired,
  formatter: PropTypes.func.isRequired,
  initialOption: PropTypes.object,
};

export default FilteredSelect;
