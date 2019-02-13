import React, { Fragment } from 'react';
import { cloneDeep, unset, orderBy } from 'lodash';
import {
  FormattedMessage,
  injectIntl,
  intlShape
} from 'react-intl';
import PropTypes from 'prop-types';
import {
  Accordion,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextArea,
  TextField
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import stripesForm from '@folio/stripes/form';
import { getFormValues, Field } from 'redux-form';

import Period from '../../components/Period';
import LocationList from './LocationList';
import StaffSlipEditList from './StaffSlipEditList';
import { intervalPeriods } from '../../constants';

class ServicePointForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    parentResources: PropTypes.object,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleSectionToggle = this.handleSectionToggle.bind(this);

    this.cViewMetaData = props.stripes.connect(ViewMetaData);

    this.state = {
      sections: {
        generalSection: true,
        locationSection: true
      },
    };
  }

  save(data) {
    const { locationIds, staffSlips } = data;
    const { parentResources } = this.props;
    const allSlips = (parentResources.staffSlips || {}).records || [];

    if (locationIds) {
      data.locationIds = locationIds.filter(l => l).map(l => (l.id ? l.id : l));
    }

    if (!data.pickupLocation) {
      unset(data, 'holdShelfExpiryPeriod');
    }

    data.staffSlips = staffSlips.map((printByDefault, index) => {
      const { id } = allSlips[index];
      return { id, printByDefault };
    });

    unset(data, 'location');
    this.props.onSave(data);
  }

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-service-point"
          onClick={this.props.onCancel}
          icon="times"
          aria-label={<FormattedMessage id="stripes-core.button.cancel" />}
        />
      </PaneMenu>
    );
  }

  saveLastMenu() {
    const { pristine, submitting, initialValues } = this.props;
    const edit = initialValues && initialValues.id;
    const saveLabel = edit ?
      <FormattedMessage id="ui-organization.settings.servicePoints.saveAndClose" />
      : <FormattedMessage id="ui-organization.settings.servicePoints.createServicePoint" />;

    return (
      <PaneMenu>
        <Button
          id="clickable-save-service-point"
          type="submit"
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          disabled={(pristine || submitting)}
        >
          {saveLabel}
        </Button>
      </PaneMenu>
    );
  }

  handleSectionToggle({ id }) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  handleExpandAll(sections) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections = sections;
      return newState;
    });
  }

  renderPaneTitle() {
    const { initialValues } = this.props;
    const servicePoint = initialValues || {};

    if (servicePoint.id) {
      return (
        <div>
          <Icon size="small" icon="edit" />
          <span>
            <FormattedMessage id="ui-organization.settings.servicePoints.edit" />
            {`: ${servicePoint.name}`}
          </span>
        </div>
      );
    }

    return <FormattedMessage id="new" />;
  }

  render() {
    const {
      stripes,
      stripes: { store },
      intl: { formatMessage },
      handleSubmit,
      initialValues,
      parentResources
    } = this.props;
    const servicePoint = initialValues || {};
    const locations = (parentResources.locations || {}).records || [];
    const staffSlips = orderBy((parentResources.staffSlips || {}).records || [], 'name');
    const { sections } = this.state;
    const disabled = !stripes.hasPerm('settings.organization.enabled');
    const formValues = getFormValues('servicePointForm')(store.getState()) || {};
    const selectOptions = [
      { label: 'No', value: false },
      { label: 'Yes', value: true }
    ];
    const periods = intervalPeriods.map(ip => (
      { ...ip, label: formatMessage({ id: ip.label }) }
    ));

    return (
      <form data-test-servicepoint-form id="form-service-point" onSubmit={handleSubmit(this.save)}>
        <Paneset isRoot>
          <Pane defaultWidth="100%" firstMenu={this.addFirstMenu()} lastMenu={this.saveLastMenu()} paneTitle={this.renderPaneTitle()}>
            <Row end="xs">
              <Col xs>
                <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
              </Col>
            </Row>
            <Accordion
              open={sections.generalSection}
              id="generalSection"
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
                  <Field
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-organization.settings.servicePoints.name" />
                        {' *'}
                      </Fragment>
                    }
                    name="name"
                    id="input-service-point-name"
                    component={TextField}
                    autoFocus
                    required
                    fullWidth
                    disabled={disabled}
                  />
                  <Field
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-organization.settings.servicePoints.code" />
                        {' *'}
                      </Fragment>
                    }
                    name="code"
                    id="input-service-point-code"
                    component={TextField}
                    fullWidth
                    disabled={disabled}
                  />
                  <Field
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-organization.settings.servicePoints.discoveryDisplayName" />
                        {' *'}
                      </Fragment>
                    }
                    name="discoveryDisplayName"
                    id="input-service-point-code"
                    component={TextField}
                    fullWidth
                    disabled={disabled}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-organization.settings.servicePoints.description" />}
                    name="description"
                    id="input-service-description"
                    component={TextArea}
                    fullWidth
                    disabled={disabled}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Field
                    label={<FormattedMessage id="ui-organization.settings.servicePoints.shelvingLagTime" />}
                    name="shelvingLagTime"
                    id="input-service-shelvingLagTime"
                    component={TextField}
                    fullWidth
                    disabled={disabled}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={2}>
                  <Field
                    data-test-pickup-location
                    label={<FormattedMessage id="ui-organization.settings.servicePoints.pickupLocation" />}
                    name="pickupLocation"
                    id="input-service-pickupLocation"
                    component={Select}
                    dataOptions={selectOptions}
                    parse={v => (v === 'true')}
                    disabled={disabled}
                  />
                </Col>
              </Row>
              {
                formValues.pickupLocation &&
                <div data-test-holdshelfexpiry>
                  <Period
                    fieldLabel="ui-organization.settings.servicePoint.expirationPeriod"
                    selectPlaceholder="ui-organization.settings.servicePoint.selectInterval"
                    inputValuePath="holdShelfExpiryPeriod.duration"
                    selectValuePath="holdShelfExpiryPeriod.intervalId"
                    entity={formValues}
                    intervalPeriods={periods}
                  />
                </div>
              }
              <StaffSlipEditList staffSlips={staffSlips} />
            </Accordion>
            <LocationList
              locations={locations}
              servicePoint={servicePoint}
              expanded={sections.locationSection}
              onToggle={this.handleSectionToggle}
            />
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'servicePointForm',
  navigationCheck: true,
  enableReinitialize: true,
})(injectIntl(ServicePointForm));
