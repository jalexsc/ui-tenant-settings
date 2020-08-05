import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, sortBy } from 'lodash';
import { Field } from 'react-final-form';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  withStripes,
} from '@folio/stripes/core';
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

import FilteredSelect from './FilteredSelect';
import ServicePointsFields from './ServicePointsFields';
import DetailsField from './DetailsField';
import {
  validate,
  getUniquenessValidation,
} from './utils';

class LocationForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
    }).isRequired,
    locationResources: PropTypes.shape({
      institutions: PropTypes.object,
      campuses: PropTypes.object,
      libraries: PropTypes.object,
    }),
    parentMutator: PropTypes.object.isRequired,
    initialValues: PropTypes.object,
    intl: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    cloning: PropTypes.bool,
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleSectionToggle = this.handleSectionToggle.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.cDetailsField = props.stripes.connect(DetailsField);

    this.state = {
      sections: {
        generalSection: true,
        detailsSection: true,
      },
    };
  }

  addFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="stripes-core.button.cancel">
          {ariaLabel => (
            <IconButton
              id="clickable-close-locations-location"
              onClick={this.props.onCancel}
              icon="times"
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderFooter() {
    const { pristine, submitting, cloning, onCancel } = this.props;

    const closeButton = (
      <Button
        id="clickable-footer-close-locations-location"
        buttonStyle="default mega"
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    );

    const saveButton = (
      <Button
        id="clickable-save-location"
        type="submit"
        buttonStyle="primary mega"
        marginBottom0
        disabled={((pristine || submitting) && !cloning)}
      >
        <FormattedMessage id="ui-tenant-settings.settings.general.saveAndClose" />
      </Button>
    );

    return (
      <PaneFooter
        renderEnd={saveButton}
        renderStart={closeButton}
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
    const loc = initialValues || {};

    if (loc.id) {
      return (
        <span>
          <FormattedMessage id="stripes-core.button.edit" />
          {`: ${loc.name}`}
        </span>
      );
    }

    return <FormattedMessage id="ui-tenant-settings.settings.location.locations.new" />;
  }

  render() {
    const {
      stripes,
      handleSubmit,
      initialValues,
      locationResources,
      intl: { formatMessage },
      form,
      parentMutator,
    } = this.props;
    const loc = initialValues || {};
    const { sections } = this.state;
    const disabled = !stripes.hasPerm('settings.tenant-settings.enabled');

    const institutions = [];
    ((locationResources.institutions || {}).records || []).forEach(i => {
      institutions.push({ value: i.id, label: `${i.name} ${i.code ? `(${i.code})` : ''}` });
    });

    const servicePoints = [];
    const entryList = sortBy((locationResources.servicePoints || {}).records || [], ['name']);
    entryList.forEach(i => {
      servicePoints.push({ label: `${i.name}` });
    });

    const formValues = form.getState().values;

    return (
      <form
        id="form-locations"
        onSubmit={handleSubmit}
        noValidate
      >
        <Paneset isRoot>
          <Pane
            id="location-form-pane"
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
                  <Field
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-tenant-settings.settings.location.institutions.institution" />
                      </Fragment>
                    }
                    name="institutionId"
                    id="input-location-institution"
                    component={Select}
                    required
                    disabled={disabled}
                    dataOptions={[
                      { label: formatMessage({ id: 'ui-tenant-settings.settings.location.institutions.selectInstitution' }) },
                      ...institutions
                    ]}
                    onChange={form.mutators.changeInstitution}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FilteredSelect
                    list={(locationResources.campuses || {}).records || []}
                    institutionId={formValues.institutionId}
                    filterFieldId="institutionId"
                    formatter={(i) => `${i.name}${i.code ? ` (${i.code})` : ''}`}
                    initialOption={{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.campuses.selectCampus' }) }}
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-tenant-settings.settings.location.campuses.campus" />
                      </Fragment>
                    }
                    name="campusId"
                    id="input-location-campus"
                    component={Select}
                    required
                    disabled={disabled}
                    onChange={form.mutators.changeCampus}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <FilteredSelect
                    list={(locationResources.libraries || {}).records || []}
                    campusId={formValues.campusId}
                    filterFieldId="campusId"
                    formatter={(i) => `${i.name}${i.code ? ` (${i.code})` : ''}`}
                    initialOption={{ label: formatMessage({ id: 'ui-tenant-settings.settings.location.libraries.selectLibrary' }) }}
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-tenant-settings.settings.location.libraries.library" />
                      </Fragment>
                    }
                    name="libraryId"
                    id="input-location-library"
                    component={Select}
                    required
                    disabled={disabled}
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  xs={8}
                  data-test-location-name
                >
                  <Field
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-tenant-settings.settings.location.locations.name" />
                      </Fragment>
                    }
                    name="name"
                    id="input-location-name"
                    component={TextField}
                    required
                    fullWidth
                    disabled={disabled}
                    validate={getUniquenessValidation('name', parentMutator.uniquenessValidator, initialValues?.id)}
                    validateFields={[]}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-tenant-settings.settings.location.code" />
                      </Fragment>
                    }
                    name="code"
                    id="input-location-code"
                    component={TextField}
                    required
                    fullWidth
                    disabled={disabled}
                    validate={getUniquenessValidation('code', parentMutator.uniquenessValidator, initialValues?.id)}
                    validateFields={[]}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={
                      <Fragment>
                        <FormattedMessage id="ui-tenant-settings.settings.location.locations.discoveryDisplayName" />
                      </Fragment>
                    }
                    name="discoveryDisplayName"
                    id="input-location-discovery-display-name"
                    component={TextField}
                    required
                    fullWidth
                    disabled={disabled}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <ServicePointsFields
                    servicePoints={servicePoints}
                    formValues={formValues}
                    changePrimary={form.mutators.changeServicePointPrimary}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.status" />}
                    name="isActive"
                    id="input-location-status"
                    component={Select}
                    disabled={disabled}
                  >
                    <FormattedMessage id="ui-tenant-settings.settings.location.locations.active">
                      { label => (
                        <option value="true">{label}</option>
                      )}
                    </FormattedMessage>
                    <FormattedMessage id="ui-tenant-settings.settings.location.locations.inactive">
                      { label => (
                        <option value="false">{label}</option>
                      )}
                    </FormattedMessage>
                  </Field>
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.description" />}
                    name="description"
                    id="input-location-description"
                    component={TextArea}
                    fullWidth
                    disabled={disabled}
                  />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={sections.detailsSection}
              id="detailsSection"
              onToggle={this.handleSectionToggle}
              label={<FormattedMessage id="ui-tenant-settings.settings.location.locations.locationDetails" />}
            >
              <this.cDetailsField />
            </Accordion>
          </Pane>
        </Paneset>
      </form>
    );
  }
}


export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    values: true,
  },
  mutators: {
    changeInstitution: (args, state, utils) => {
      utils.changeValue(state, 'institutionId', () => args[0].target.value);
      utils.changeValue(state, 'campusId', () => null);
      utils.changeValue(state, 'libraryId', () => null);
    },
    changeCampus: (args, state, utils) => {
      utils.changeValue(state, 'campusId', () => args[0].target.value);
      utils.changeValue(state, 'libraryId', () => null);
    },
    changeServicePointPrimary: (args, state, utils) => {
      utils.changeValue(state, `servicePointIds[${args[0]}].primary`, () => args[1]);
    },
  },
  validate,
  validateOnBlur: true,
})(withStripes(injectIntl(LocationForm)));
