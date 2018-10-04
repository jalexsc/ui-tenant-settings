import { isEqual } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Col, List, Row } from '@folio/stripes/components';

class LocationList extends React.Component {
  static manifest = Object.freeze({
    locations: {
      type: 'okapi',
      records: 'locations',
      path: 'locations',
      accumulate: 'true',
      fetch: false,
    },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      locations: PropTypes.shape({
        GET: PropTypes.func,
        reset: PropTypes.func,
      }),
    }).isRequired,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    locationIds: PropTypes.arrayOf(PropTypes.string),
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.loadLocations();
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.locationIds, this.props.locationIds)) {
      this.loadLocations();
    }
  }

  loadLocations() {
    const locationIds = this.props.locationIds || [];

    if (!locationIds.length) return;

    const ids = locationIds.map(id => `id==${id}`).join(' or ');
    this.props.mutator.locations.GET({ params: { query: `query=(${ids})` } }).then((locs) => {
      const locMap = locs.reduce((acc, loc) => ({ ...acc, [loc.id]: loc }), {});
      this.setState({ locMap });
    });
  }

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.servicePoints.${id}`
    });
  }

  renderLocation(location) {
    if (!location) return (<div />);
    const title = `${location.name} (${location.code})`;
    return (<li key={title}>{title}</li>);
  }

  renderLocations(locIds) {
    const fields = (this.state.locMap) ? locIds : [];
    const listFormatter = (fieldName, i) => (this.renderLocation(this.state.locMap[locIds[i]]));

    return (
      <List
        items={fields}
        itemFormatter={listFormatter}
        isEmptyMessage={this.translate('noLocationsFound')}
      />
    );
  }

  render() {
    const { expanded, onToggle, locationIds } = this.props;
    return (
      <Accordion
        open={expanded}
        id="locationSection"
        onToggle={onToggle}
        label={this.translate('assignedLocations')}
      >
        <Row>
          <Col xs={12}>
            {this.renderLocations(locationIds)}
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LocationList;
