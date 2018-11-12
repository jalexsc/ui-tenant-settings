import { formValues } from 'redux-form';
import FilteredSelect from './FilteredSelect';

const CampusField = formValues('institutionId')(FilteredSelect);

export default CampusField;
