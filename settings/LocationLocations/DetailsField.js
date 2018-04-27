import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/structures/RepeatableField';

const DetailsField = ({ translate }) => {
  return (
    <RepeatableField
      name="detailsArray"
      addLabel={translate('locations.addDetails')}
      addButtonId="clickable-add-location-details"
      template={[
        {
          name: 'name',
          label: translate('locations.name'),
          component: TextField,
          required: true,
        },
        {
          name: 'value',
          label: translate('locations.value'),
          component: TextField,
          required: true,
        },
      ]}
      newItemTemplate={{ name: '', value: '' }}
    />
  );
};

DetailsField.propTypes = {
  translate: PropTypes.func,
};

export default DetailsField;
