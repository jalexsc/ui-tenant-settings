import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  AutoSuggest,
  Icon,
  TextField,
} from '@folio/stripes/components';

import RepeatableField from '../../../components/RepeatableField';

class DetailsField extends React.Component {
  static manifest = {
    locations: {
      type: 'okapi',
      path: 'locations?query=(details=*)',
    },
  };

  static propTypes = {
    resources: PropTypes.shape({
      locations: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.getSuggestedTerms = this.getSuggestedTerms.bind(this);
  }

  getSuggestedTerms(locationsArray) {
    const terms = [];
    // eslint-disable-next-line no-unused-vars
    for (const item of locationsArray) {
      if (item.details) {
        Object.keys(item.details).forEach(name => {
          if (!terms.includes(name)) {
            terms.push(name);
          }
        });
      }
    }
    return terms;
  }

  render() {
    const { locations } = this.props.resources;
    const locationsArray = locations ? locations.records[0] ? locations.records[0].locations : [] : [];
    const suggestedTerms = this.getSuggestedTerms(locationsArray);
    const detailNames = suggestedTerms.length > 0 ? suggestedTerms.map(locationName => (
      { value: locationName })) : [];

    return (
      <RepeatableField
        name="detailsArray"
        addLabel={
          <Icon icon="plus-sign">
            <FormattedMessage id="ui-tenant-settings.settings.location.locations.addDetails" />
          </Icon>
        }
        addButtonId="clickable-add-location-details"
        template={[
          {
            name: 'name',
            label: <FormattedMessage id="ui-tenant-settings.settings.location.locations.detailsName" />,
            component: AutoSuggest,
            items: detailNames,
            renderValue: item => item || '',
            withFinalForm: true,
          },
          {
            name: 'value',
            label: <FormattedMessage id="ui-tenant-settings.settings.location.locations.detailsValue" />,
            component: TextField,
          },
        ]}
        newItemTemplate={{ name: '', value: '' }}
      />
    );
  }
}


export default DetailsField;
