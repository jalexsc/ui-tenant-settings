import React from 'react';
import { cloneDeep, orderBy } from 'lodash';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import PropTypes from 'prop-types';
import {
  Accordion,
  Button,
  Col,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextArea,
  TextField,
  PaneFooter,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import stripesFinalForm from '@folio/stripes/final-form';
import { Field } from 'react-final-form';

import Period from '../../components/Period';
import LocationList from './LocationList';
import StaffSlipEditList from './StaffSlipEditList';
import { intervalPeriods } from '../../constants';

import {
  validateServicePointForm,
  getUniquenessValidation,
} from './utils';

import styles from './ServicePoints.css';

class ServicePointForm extends React.Component {
  static propTypes = {
    intl: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    parentResources: PropTypes.object,
    parentMutator: PropTypes.object,
    onCancel: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

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

  renderFooter() {
    const { pristine, submitting, onCancel } = this.props;

    const closeButton = (
      <Button
        id="clickable-footer-close-service-point"
        buttonStyle="default mega"
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        id="clickable-save-service-point"
        type="submit"
        buttonStyle="primary mega"
        disabled={(pristine || submitting)}
      >
        <FormattedMessage id="ui-tenant-settings.settings.general.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderStart={closeButton}
        renderEnd={saveButton}
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
          <span>
            <FormattedMessage id="ui-tenant-settings.settings.servicePoints.edit" />
            {`: ${servicePoint.name}`}
          </span>
        </div>
      );
    }

    return <FormattedMessage id="ui-tenant-settings.settings.servicePoints.new" />;
  }

  render() {
    const {
      stripes,
      intl: { formatMessage },
      initialValues,
      parentResources,
      handleSubmit,
      form,
      parentMutator,
    } = this.props;
    const servicePoint = initialValues || {};
    const locations = (parentResources.locations || {}).records || [];
    const staffSlips = orderBy((parentResources.staffSlips || {}).records || [], 'name');
    const { sections } = this.state;
    const disabled = !stripes.hasPerm('settings.tenant-settings.enabled');
    const formValues = form.getState().values;
    const selectOptions = [
      { label: formatMessage({ id: 'ui-tenant-settings.settings.servicePoints.pickupLocation.no' }), value: false },
      { label: formatMessage({ id: 'ui-tenant-settings.settings.servicePoints.pickupLocation.yes' }), value: true }
    ];
    const periods = intervalPeriods.map(ip => (
      { ...ip, label: formatMessage({ id: ip.label }) }
    ));

    return (
      <form
        data-test-servicepoint-form
        id="form-service-point"
        onSubmit={handleSubmit}
        className={styles.servicePointsForm}
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            firstMenu={this.addFirstMenu()}
            footer={this.renderFooter()}
            paneTitle={this.renderPaneTitle()}
          >
            <Row end="xs">
              <Col xs>
                <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
              </Col>
            </Row>
            <Accordion
              open={sections.generalSection}
              id="generalSection"
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
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.name" />}
                    name="name"
                    id="input-service-point-name"
                    component={TextField}
                    autoFocus
                    required
                    fullWidth
                    disabled={disabled}
                    validate={getUniquenessValidation('name', parentMutator.uniquenessValidator)}
                    validateFields={[]}
                  />
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.code" />}
                    name="code"
                    id="input-service-point-code"
                    component={TextField}
                    fullWidth
                    required
                    disabled={disabled}
                    validate={getUniquenessValidation('code', parentMutator.uniquenessValidator)}
                    validateFields={[]}
                  />
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.discoveryDisplayName" />}
                    name="discoveryDisplayName"
                    id="input-service-point-discovery-name"
                    component={TextField}
                    fullWidth
                    required
                    disabled={disabled}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.description" />}
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
                    label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.shelvingLagTime" />}
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
                    label={<FormattedMessage id="ui-tenant-settings.settings.servicePoints.pickupLocation" />}
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
                    fieldLabel="ui-tenant-settings.settings.servicePoint.expirationPeriod"
                    selectPlaceholder="ui-tenant-settings.settings.servicePoint.selectInterval"
                    inputValuePath="holdShelfExpiryPeriod.duration"
                    selectValuePath="holdShelfExpiryPeriod.intervalId"
                    entity={formValues}
                    intervalPeriods={periods}
                    changeFormValue={form.mutators.changeFormValue}
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

export default stripesFinalForm({
  navigationCheck: true,
  validate: validateServicePointForm,
  subscription: {
    values: true,
  },
  mutators: {
    changeFormValue: (args, state, utils) => {
      utils.changeValue(state, args[0], () => args[1]);
    },
  },
  validateOnBlur: true,
  // keepDirtyOnReinitialize: true,
})(injectIntl(ServicePointForm));
