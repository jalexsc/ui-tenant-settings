import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Col, List, Row } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

class LocationList extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    locations: PropTypes.arrayOf(PropTypes.object),
  };

  renderLocation(location) {
    if (!location) return (<div />);
    const title = `${location.name} (${location.code})`;
    return (<li key={title}>{title}</li>);
  }

  renderLocations(locations) {
    return (
      <List
        items={locations}
        itemFormatter={this.renderLocation}
        isEmptyMessage={<FormattedMessage id="ui-organization.settings.servicePoints.noLocationsFound" />}
      />
    );
  }

  render() {
    const { expanded, onToggle, locations } = this.props;
    return (
      <Accordion
        open={expanded}
        id="locationSection"
        onToggle={onToggle}
        label={<FormattedMessage id="ui-organization.settings.servicePoints.assignedLocations" />}
      >
        <Row>
          <Col xs={12}>
            {this.renderLocations(locations)}
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LocationList;
