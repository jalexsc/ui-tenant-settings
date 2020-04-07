import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  cloneDeep,
  get,
  isEmpty,
} from 'lodash';

import {
  Accordion,
  Col,
  ExpandAllButton,
  KeyValue,
  Row,
  List,
  Pane,
  Button,
  Icon,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

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
    }).isRequired,
    initialValues: PropTypes.object,
    resources: PropTypes.shape({
      institutions: PropTypes.object,
      campuses: PropTypes.object,
      libraries: PropTypes.object,
    }).isRequired,
    servicePointsById: PropTypes.object,
    onEdit: PropTypes.func.isRequired,
    onClone: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleSectionToggle = this.handleSectionToggle.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.renderServicePoints = this.renderServicePoints.bind(this);
    this.renderServicePoint = this.renderServicePoint.bind(this);

    this.state = {
      sections: {
        generalInformation: true,
        locationDetails: true,
      },
    };

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  handleExpandAll(sections) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections = sections;
      return newState;
    });
  }

  renderServicePoint(sp, index) {
    return (
      index === 0 ?
        <li key={index}>
          {sp}
          {' '}
          (primary)
        </li> :
        <li key={index}>
          {sp}
        </li>
    );
  }

  renderServicePoints() {
    const { initialValues: loc, servicePointsById } = this.props;

    const itemsList = [];
    // as primary servicePoint surely exists and servicePointsById shouldn't be empty, its index would be at the 0th position of itemsList array
    if (!isEmpty(servicePointsById) && loc.servicePointIds.length !== 0) {
      itemsList.push(servicePointsById[loc.primaryServicePoint]);
      loc.servicePointIds.forEach((item) => {
        // exclude the primary servicepoint from being added again into the array
        if (!itemsList.includes(item.selectSP)) itemsList.push(item.selectSP);
      });
    }

    return (
      <List
        items={itemsList}
        itemFormatter={this.renderServicePoint}
        isEmptyMessage="No servicePoints found"
      />
    );
  }

  handleSectionToggle({ id }) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  renderActionMenu = item => ({ onToggle }) => (
    <Fragment>
      <Button
        data-test-edit-location-menu-button
        buttonStyle="dropdownItem"
        onClick={() => {
          this.props.onEdit(item);
          onToggle();
        }}
      >
        <Icon icon="edit">
          <FormattedMessage id="stripes-components.button.edit" />
        </Icon>
      </Button>
      <Button
        data-test-clone-location-menu-button
        buttonStyle="dropdownItem"
        onClick={() => {
          this.props.onClone(item);
          onToggle();
        }}
      >
        <Icon icon="duplicate">
          <FormattedMessage id="stripes-components.button.duplicate" />
        </Icon>
      </Button>
    </Fragment>
  );

  render() {
    const {
      initialValues: loc,
      resources: {
        institutions,
        campuses,
        libraries,
      },
      onClose,
    } = this.props;

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
      <Pane
        id="location-details"
        paneTitle={loc.name}
        defaultWidth="70%"
        dismissible
        actionMenu={this.renderActionMenu(loc)}
        onClose={onClose}
      >
        <Row end="xs">
          <Col xs>
            <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
          </Col>
        </Row>
        <Accordion
          open={sections.generalInformation}
          id="generalInformation"
          onToggle={this.handleSectionToggle}
          label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.generalInformation" />}
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
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />}
                value={get(institution, ['name'])}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />}
                value={get(campus, ['name'])}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />}
                value={get(library, ['name'])}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.name" />}
                value={loc.name}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.code" />}
                value={loc.code}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.discoveryDisplayName" />}
                value={loc.discoveryDisplayName}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.servicePoints" />}
              >
                {this.renderServicePoints()}
              </KeyValue>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.status" />}
                value={<FormattedMessage id={`ui-tenant-settings.settings.location.${loc.isActive ? 'locations.active' : 'locations.inactive'}`} />}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.description" />}
                value={loc.description}
              />
            </Col>
          </Row>
        </Accordion>
        <Accordion
          open={sections.locationDetails}
          id="locationDetails"
          onToggle={this.handleSectionToggle}
          label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.locationDetails" />}
        >
          {details}
        </Accordion>
      </Pane>
    );
  }
}

export default stripesConnect(LocationDetail);
