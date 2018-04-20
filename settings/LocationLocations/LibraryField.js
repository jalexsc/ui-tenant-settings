import { formValues } from 'redux-form';
import FilteredSelect from './FilteredSelect';

const LibraryField = formValues('campusId')(FilteredSelect);

export default LibraryField;
