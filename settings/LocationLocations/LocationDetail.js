import { cloneDeep, get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import {
  Accordion,
  Col,
  ExpandAllButton,
  KeyValue,
  Row
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

class LocationDetail extends React.Component {
  static manifest = Object.freeze({
    institutions: {
      type: 'okapi',
      path: 'location-units/institutions/!{initialValues.institutionId}',
    },
    campuses: {
      type: 'okapi',
      path: 'location-units/campuses/!{initialValues.campusId}',
    },
    libraries: {
      type: 'okapi',
      path: 'location-units/libraries/!{initialValues.libraryId}',
    },
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    resources: PropTypes.shape({
      institutions: PropTypes.object,
      campuses: PropTypes.object,
      libraries: PropTypes.object,
    }).isRequired,
  };

  constructor(props) {
    super();

    this.handleSectionToggle = this.handleSectionToggle.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.state = {
      sections: {
        generalInformation: true,
        locationDetails: true,
      },
    };

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.location.${id}`
    });
  }

  handleExpandAll(sections) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections = sections;
      return newState;
    });
  }

  handleSectionToggle({ id }) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  render() {
    const { initialValues: loc, resources: { institutions, campuses, libraries } } = this.props;

    const institutionList = (institutions || {}).records || [];
    const institution = institutionList.length === 1 ? institutionList[0] : null;

    const campusList = (campuses || {}).records || [];
    const campus = campusList.length === 1 ? campusList[0] : null;

    const libraryList = (libraries || {}).records || [];
    const library = libraryList.length === 1 ? libraryList[0] : null;

    // massage the "details" property which is represented in the API as
    // an object but displayed on the details page as an array of
    // key-value pairs sorted by key.
    const details = [];
    Object.keys(loc.details || []).sort().forEach(name => {
      details.push(
        <Row key={name}>
          <Col xs={12}>
            <KeyValue label={name} value={loc.details[name]} />
          </Col>
        </Row>
      );
    });


    const { sections } = this.state;
    return (
      <div>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
          </Col>
        </Row>
        <Accordion
          open={sections.generalInformation}
          id="generalInformation"
          onToggle={this.handleSectionToggle}
          label={this.translate('locations.generalInformation')}
        >
          {loc.metadata && loc.metadata.createdDate &&
            <Row>
              <Col xs={12}>
                <this.cViewMetaData metadata={loc.metadata} />
              </Col>
            </Row>
          }
          <Row>
            <Col xs={12}>
              <KeyValue label={this.translate('institutions.institution')} value={get(institution, ['name'])} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={this.translate('campuses.campus')} value={get(campus, ['name'])} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={this.translate('libraries.library')} value={get(library, ['name'])} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={this.translate('locations.name')} value={loc.name} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={this.translate('code')} value={loc.code} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={this.translate('locations.discoveryDisplayName')} value={loc.discoveryDisplayName} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={this.translate('locations.status')} value={this.translate(loc.isActive ? 'locations.active' : 'locations.inactive')} />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue label={this.translate('locations.description')} value={loc.description} />
            </Col>
          </Row>
        </Accordion>
        <Accordion
          open={sections.locationDetails}
          id="locationDetails"
          onToggle={this.handleSectionToggle}
          label={this.translate('locations.locationDetails')}
        >
          {details}
        </Accordion>
      </div>
    );
  }
}

export default LocationDetail;
