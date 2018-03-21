import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class ShelvingLocationsSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.disabled = true;
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      this.disabled ?
        <div>
          <h4>Shelving Locations</h4>
           This settings page has been disabled while the shelving location structure is being refactored.
        </div>
        :
        <this.connectedControlledVocab
          {...this.props}
          baseUrl="shelf-locations"
          records="shelflocations"
          label="Shelving Locations"
          visibleFields={['name']}
          itemTemplate={{ name: 'string', id: 'string' }}
          nameKey="shelvingLocation"
        />
    );
  }
}

export default ShelvingLocationsSettings;
