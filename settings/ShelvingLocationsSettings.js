import React from 'react';
import PropTypes from 'prop-types';
import Paneset from '@folio/stripes-components/lib/Paneset';
import Pane from '@folio/stripes-components/lib/Pane';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class ShelvingLocationsSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.disabled = true;
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      this.disabled ?
        <Paneset>
          <Pane defaultWidth="fill" fluidContentWidth paneTitle="Shelving locations">
            <div>
               This settings page has been disabled while the shelving location structure is being refactored.
            </div>
          </Pane>
        </Paneset>
        :
        <this.connectedControlledVocab
          {...this.props}
          baseUrl="shelf-locations"
          records="shelflocations"
          label={this.props.label}
          visibleFields={['name']}
          itemTemplate={{ name: 'string', id: 'string' }}
          nameKey="shelvingLocation"
        />
    );
  }
}

export default ShelvingLocationsSettings;
