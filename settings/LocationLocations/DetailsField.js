import React from 'react';
import PropTypes from 'prop-types';
import { AutoSuggest, TextField } from '@folio/stripes/components';
import RepeatableField from '../../lib/RepeatableField';

class DetailsField extends React.Component {
  static manifest = {
    locations: {
      type: 'okapi',
      path: 'locations?query=(details=*)',
    },
  };

  static propTypes = {
    translate: PropTypes.func,
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
    for (const item of locationsArray) {
      Object.keys(item.details).forEach(name => {
        if (!terms.includes(name)) terms.push(name);
      });
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
        addLabel={this.props.translate('locations.addDetails')}
        addButtonId="clickable-add-location-details"
        template={[
          {
            name: 'name',
            label: this.props.translate('locations.detailsName'),
            component: AutoSuggest,
            items: detailNames,
          },
          {
            name: 'value',
            label: this.props.translate('locations.detailsValue'),
            component: TextField,
          },
        ]}
        newItemTemplate={{ name: '', value: '' }}
      />
    );
  }
}


export default DetailsField;
