import { cloneDeep, keyBy, orderBy } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';
import { Accordion, Col, ExpandAllButton, KeyValue, Row } from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import LocationList from './LocationList';
import StaffSlipList from './StaffSlipList';
import { intervalPeriods } from '../../constants';


class ServicePointDetail extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    parentResources: PropTypes.object,
  };

  constructor(props) {
    super(props);

    const { intl: { formatMessage } } = props;
    const periods = intervalPeriods.map(ip => (
      { ...ip, label: formatMessage({ id: ip.label }) }
    ));

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
    this.intervalPeriodMap = keyBy(periods, 'value');
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { parentMutator, initialValues } = nextProps;
    const { id } = (initialValues || {});
    if (state.servicePointId !== id) {
      parentMutator.locations.reset();
      if (id) {
        const query = `(servicePointIds=${id}) sortby name`;
        const limit = '1000';
        parentMutator.locations.GET({ params: { query, limit } });
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
    const staffSlips = orderBy((parentResources.staffSlips || {}).records || [], 'name');
    const servicePoint = initialValues;
    const { sections } = this.state;
    const { holdShelfExpiryPeriod = {} } = servicePoint;
    const { duration, intervalId } = holdShelfExpiryPeriod;

    return (
      <div data-test-service-point-details>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
          </Col>
        </Row>
        <Accordion
          open={sections.generalInformation}
          id="generalInformation"
          onToggle={this.handleSectionToggle}
          label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.generalInformation" />}
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
                label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.name" />}
                value={servicePoint.name}
              />
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.code" />}
                value={servicePoint.code}
              />
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.discoveryDisplayName" />}
                value={servicePoint.discoveryDisplayName}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.description" />}
                value={servicePoint.description}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue
                label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.shelvingLagTime" />}
                value={servicePoint.shelvingLagTime}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.pickupLocation" />}>
                { servicePoint.pickupLocation
                  ? <FormattedMessage id="ui-tenant-settings.settings.servicePoints.pickupLocation.yes" />
                  : <FormattedMessage id="ui-tenant-settings.settings.servicePoints.pickupLocation.no" />
                }
              </KeyValue>
            </Col>
          </Row>
          { servicePoint.pickupLocation &&
            <Row>
              <Col xs={8} data-test-hold-shelf-expiry-period>
                <KeyValue
                  label={<FormattedMessage id="ui-tenant-settings.settings.servicePoint.expirationPeriod" />}
                  value={`${duration} ${this.intervalPeriodMap[intervalId].label}`}
                />
              </Col>
            </Row>
          }
          <StaffSlipList
            servicePoint={servicePoint}
            staffSlips={staffSlips}
          />
        </Accordion>

        <LocationList
          locations={locations}
          servicePoint={servicePoint}
          expanded={sections.locationSection}
          onToggle={this.handleSectionToggle}
        />
      </div>
    );
  }
}

export default injectIntl(ServicePointDetail);
