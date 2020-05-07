import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Col, List, Row } from '@folio/stripes/components';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

class LocationList extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    locations: PropTypes.arrayOf(PropTypes.object),
    servicePoint: PropTypes.object,
    intl: PropTypes.object,
  };

  renderLocation(location) {
    const { servicePoint, intl: { formatMessage } } = this.props;

    if (!location) return (<div />);

    const { name, code, primaryServicePoint } = location;
    const primary = (primaryServicePoint === servicePoint.id)
      ? formatMessage({ id: 'ui-tenant-settings.settings.servicePoints.primary' }) :
      '';
    const title = `${name} - ${code} ${primary}`;
    return (<li key={title}>{title}</li>);
  }

  renderLocations(locations) {
    return (
      <List
        items={locations}
        itemFormatter={location => this.renderLocation(location)}
        isEmptyMessage={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.noLocationsFound" />}
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
        label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.assignedLocations" />}
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

export default injectIntl(LocationList);
