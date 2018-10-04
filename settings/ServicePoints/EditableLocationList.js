import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  Button,
  Col,
  Icon,
  List,
  Row
} from '@folio/stripes/components';
import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';
import { Field, FieldArray, getFormValues } from 'redux-form';

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
    initialValues: PropTypes.object,
    change: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.renderLocations = this.renderLocations.bind(this);
    this.addLocation = this.addLocation.bind(this);
    this.state = {};
  }

  componentDidMount() {
    const initialValues = this.props.initialValues || {};

    if (initialValues.locationIds && initialValues.locationIds.length && !this.state.locMap) {
      const ids = initialValues.locationIds.map(id => `id==${id}`).join(' or ');
      this.props.mutator.locations.GET({ params: { query: `query=(${ids})` } }).then((locations) => {
        const locMap = locations.reduce((acc, loc) => ({ ...acc, [loc.id]: loc }), {});
        this.setState({ locMap });
      });
    }
  }

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.servicePoints.${id}`
    });
  }

  getCurrentValues() {
    const { stripes: { store } } = this.props;
    const state = store.getState();
    return getFormValues('servicePointForm')(state) || {};
  }

  selectLocation(location, add) {
    this.setState({ location });
    setTimeout(() => {
      this.props.change('location', location.id);
      if (add) this.addLocation();
    });
  }

  addLocation() {
    const { location } = this.state;
    const locations = this.getCurrentValues().locationIds || [];
    const foundLoc = locations.find(l => l.id === location.id);

    if (location && !foundLoc) {
      this.fields.unshift(location);
    }
  }

  removeLocation(index) {
    this.fields.remove(index);
    setTimeout(() => this.forceUpdate());
  }

  renderLocation(locOrId, index) {
    if (!locOrId) {
      return (<div />);
    }

    const locMap = this.state.locMap || {};
    const location = locOrId.id ? locOrId : locMap[locOrId];

    if (!location) {
      return (<div />);
    }

    const title = `${location.name} (${location.code})`;

    return (
      <li key={location.code}>
        {title}
        <Button
          buttonStyle="fieldControl"
          align="end"
          type="button"
          id="clickable-remove-location"
          onClick={() => this.removeLocation(index)}
          aria-label={title}
          title={title}
        >
          <Icon icon="hollowX" />
        </Button>
      </li>
    );
  }

  renderLocations({ fields }) {
    this.fields = fields;

    const listFormatter = (fieldName, index) => (this.renderLocation(fields.get(index), index));

    return (
      <List
        items={this.fields}
        itemFormatter={listFormatter}
        isEmptyMessage={this.translate('noLocationsFound')}
      />
    );
  }

  render() {
    const { expanded, onToggle } = this.props;

    return (
      <Accordion
        open={expanded}
        id="locationSection"
        onToggle={onToggle}
        label={this.translate('assignedLocations')}
      >
        {
          <Row>
            <Col xs={8}>
              <Row>
                <Col xs={6}>
                  <Field
                    label={this.translate('location')}
                    placeholder={this.translate('selectLocation')}
                    name="location"
                    id="location"
                    component={LocationSelection}
                    fullWidth
                    marginBottom0
                    onSelect={loc => this.selectLocation(loc)}
                  />
                  <LocationLookup onLocationSelected={loc => this.selectLocation(loc, true)} />
                </Col>
                <Col xs={2}>
                  <br />
                  <Button
                    id="clickable-add-location"
                    title={this.translate('addLocation')}
                    onClick={this.addLocation}
                    marginBottom0
                  >
                    {this.translate('addLocation')}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        }

        <Row>
          <Col xs={8}>
            <FieldArray name="locationIds" component={this.renderLocations} />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LocationList;
