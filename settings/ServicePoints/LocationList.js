import React from 'react';
import PropTypes from 'prop-types';
import List from '@folio/stripes-components/lib/List';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { Accordion } from '@folio/stripes-components/lib/Accordion';

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
    locations: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const locations = this.props.locations || [];
    if (!locations.length) return;

    const ids = locations.map(id => `id==${id}`).join(' or ');
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
    const title = `${location.name} (${location.code})`;
    return (<li key={title}>{title}</li>);
  }

  renderLocations(locIds) {
    const fields = (this.state.locMap) ? locIds : [];
    const listFormatter = (fieldName, i) =>
      (this.renderLocation(this.state.locMap[locIds[i]]));

    return (
      <List
        items={fields}
        itemFormatter={listFormatter}
        isEmptyMessage={this.translate('noLocationsFound')}
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
        label={this.translate('assignedLocations')}
      >
        <Row>
          <Col xs={8}>
            {this.renderLocations(locations)}
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LocationList;
