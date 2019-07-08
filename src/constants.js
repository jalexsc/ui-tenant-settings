export const patronIdentifierTypes = [
  { key: 'barcode', label: 'Barcode' },
  { key: 'externalSystemId', label: 'External System ID' },
  { key: 'id', label: 'FOLIO Record Number' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
];

export const samlBindingTypes = [
  { key: 'POST', label: 'POST binding' },
  { key: 'REDIRECT', label: 'Redirect binding' },
];

export const intervalPeriods = [
  {
    id: 1,
    label: 'ui-tenant-settings.settings.intervalPeriod.minutes',
    value: 'Minutes'
  },
  {
    id: 2,
    label: 'ui-tenant-settings.settings.intervalPeriod.hours',
    value: 'Hours'
  },
  {
    id: 3,
    label: 'ui-tenant-settings.settings.intervalPeriod.days',
    value: 'Days'
  },
  {
    id: 4,
    label: 'ui-tenant-settings.settings.intervalPeriod.weeks',
    value: 'Weeks'
  },
  {
    id: 5,
    label: 'ui-tenant-settings.settings.intervalPeriod.months',
    value: 'Months'
  },
];

export const SORT_TYPES = {
  ASCENDING: 'ascending',
  DESCENDING: 'descending',
};

export default '';
