import React, { Fragment } from 'react';
import { cloneDeep } from 'lodash';
import { FormattedMessage } from 'react-intl';
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
import { Field } from 'redux-form';

import LocationList from './LocationList';

class ServicePointForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    parentResources: PropTypes.arrayOf(PropTypes.object),
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
      servicePointId: null, // eslint-disable-line react/no-unused-state
      sections: {
        generalSection: true,
        locationSection: true
      },
    };
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

  save(data) {
    const { locationIds } = data;

    if (locationIds) {
      data.locationIds = locationIds.filter(l => l).map(l => (l.id ? l.id : l));
    }

    delete data.location;
    data.pickupLocation = data.pickupLocation || true;

    this.props.onSave(data);
  }

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-service-point"
          onClick={this.props.onCancel}
          icon="times"
          title={<FormattedMessage id="stripes-core.button.cancel" />}
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
          title={<FormattedMessage id="saveAndClose" />}
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
    const { stripes, handleSubmit, initialValues, parentResources } = this.props;
    const servicePoint = initialValues || {};
    const locations = (parentResources.locations || {}).records || [];
    const { sections } = this.state;
    const disabled = !stripes.hasPerm('settings.organization.enabled');

    const selectOptions = [
      { label: 'Yes', value: true },
      { label: 'No', value: false }
    ];

    return (
      <form id="form-service-point" onSubmit={handleSubmit(this.save)}>
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
                    label={<FormattedMessage id="ui-organization.settings.servicePoints.pickupLocation" />}
                    name="pickupLocation"
                    id="input-service-pickupLocation"
                    component={Select}
                    dataOptions={selectOptions}
                    disabled={disabled}
                  />
                </Col>
              </Row>
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
})(ServicePointForm);
