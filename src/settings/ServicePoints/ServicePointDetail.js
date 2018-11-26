import { cloneDeep } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion, Col, ExpandAllButton, KeyValue, Row } from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import LocationList from './LocationList';

class ServicePointDetail extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    parentResources: PropTypes.arrayOf(PropTypes.object),
  };

  constructor(props) {
    super(props);

    this.handleSectionToggle = this.handleSectionToggle.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.state = {
      servicePointId: null, // eslint-disable-line react/no-unused-state
      sections: {
        generalInformation: true,
        locationSection: true,
      },
    };

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { parentMutator, initialValues } = nextProps;
    const { id } = (initialValues || {});
    if (state.servicePointId !== id) {
      parentMutator.locations.reset();
      if (id) {
        const query = `(servicePointIds=${id})`;
        parentMutator.locations.GET({ params: { query } });
      }
      return { servicePointId: id };
    }

    return null;
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
    const { initialValues, parentResources } = this.props;
    const locations = (parentResources.locations || {}).records || [];
    const servicePoint = initialValues;
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
          label={<FormattedMessage id="ui-organization.settings.servicePoints.generalInformation" />}
        >
          {servicePoint.metadata && servicePoint.metadata.createdDate &&
            <Row>
              <Col xs={12}>
                <this.cViewMetaData metadata={servicePoint.metadata} />
              </Col>
            </Row>
          }
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-organization.settings.servicePoints.name" />}
                value={servicePoint.name}
              />
              <KeyValue
                label={<FormattedMessage id="ui-organization.settings.servicePoints.code" />}
                value={servicePoint.code}
              />
              <KeyValue
                label={<FormattedMessage id="ui-organization.settings.servicePoints.discoveryDisplayName" />}
                value={servicePoint.discoveryDisplayName}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={<FormattedMessage id="ui-organization.settings.servicePoints.description" />}
                value={servicePoint.description}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue
                label={<FormattedMessage id="ui-organization.settings.servicePoints.shelvingLagTime" />}
                value={servicePoint.shelvingLagTime}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <KeyValue
                label={<FormattedMessage id="ui-organization.settings.servicePoints.pickupLocation" />}
                value={servicePoint.pickupLocation ? 'Yes' : 'No'}
              />
            </Col>
          </Row>
        </Accordion>

        <LocationList
          locations={locations}
          expanded={sections.locationSection}
          onToggle={this.handleSectionToggle}
        />
      </div>
    );
  }
}

export default ServicePointDetail;
