import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep, isEmpty, sortBy } from 'lodash';
import { Field, SubmissionError } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import {
  IfPermission,
  withStripes,
} from '@folio/stripes/core';
import {
  Accordion,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  IconButton,
  Modal,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextArea,
  TextField,
  PaneFooter,
} from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { ViewMetaData } from '@folio/stripes/smart-components';
import stripesForm from '@folio/stripes/form';

import ServicePointsFields from './ServicePointsFields';
import CampusField from './CampusField';
import LibraryField from './LibraryField';
import DetailsField from './DetailsField';

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
    parentMutator: PropTypes.shape({
      holdingsEntries: PropTypes.object.isRequired,
      itemEntries: PropTypes.object.isRequired,
    }),
    initialValues: PropTypes.object,
    intl: intlShape.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    servicePointsByName: PropTypes.object,
    submitting: PropTypes.bool,
    cloning: PropTypes.bool,
    change: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.beginDelete = this.beginDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleSectionToggle = this.handleSectionToggle.bind(this);
    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.cDetailsField = props.stripes.connect(DetailsField);

    this.state = {
      confirmDelete: false,
      sections: {
        generalSection: true,
        detailsSection: true,
      },
      showItemInUseDialog: false,
    };
  }

  validateCloning(data) {
    const { initialValues, intl: { formatMessage } } = this.props;
    const uniqueFields = ['name', 'code'];
    const errors = uniqueFields.reduce((acc, f) => {
      if (initialValues[f] === data[f]) {
        acc[f] = formatMessage({ id: `ui-tenant-settings.settings.location.locations.validation.${f}.unique` });
      }
      return acc;
    }, {});

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }
  }

  save(location) {
    const { cloning } = this.props;
    const data = cloneDeep(location);

    if (cloning) this.validateCloning(data);
    // massage the "details" property which is represented in the API as
    // an object but on the form as an array of key-value pairs
    const servicePointsObject = {};

    servicePointsObject.servicePointIds = [];
    data.servicePointIds.forEach((item) => {
      if (item.selectSP) {
        servicePointsObject.servicePointIds.push(this.props.servicePointsByName[item.selectSP]);
        if (item.primary) servicePointsObject.primaryServicePoint = this.props.servicePointsByName[item.selectSP];
      }
    });

    const detailsObject = {};
    if (!data.detailsArray) {
      data.detailsArray = [];
    }
    data.detailsArray.forEach(i => {
      if (i.name !== undefined) detailsObject[i.name] = i.value;
    });
    delete data.detailsArray;
    data.details = detailsObject;
    data.primaryServicePoint = servicePointsObject.primaryServicePoint;
    data.servicePointIds = servicePointsObject.servicePointIds;

    this.props.onSave(data);
  }

  beginDelete() {
    this.setState({
      confirmDelete: true,
    });
  }

  /**
   * Don't bother deleting if the location is in use as a permanent or
   * temporary locaction for a holdings or item record.
   */
  confirmDelete(confirmation) {
    const loc = this.props.initialValues;
    if (confirmation) {
      this.props.parentMutator.holdingsEntries.reset();
      this.props.parentMutator.itemEntries.reset();
      const query = `permanentLocationId=${this.props.initialValues.id} or temporaryLocationId=${this.props.initialValues.id}`;
      const holdingsRecords = this.props.parentMutator.holdingsEntries.GET({ params: { query } });
      const itemRecords = this.props.parentMutator.itemEntries.GET({ params: { query } });

      Promise.all([holdingsRecords, itemRecords]).then(values => {
        if (undefined === values.find(records => records.length !== 0)) {
          this.props.onRemove(loc);
        } else {
          this.setState({
            showItemInUseDialog: true,
            confirmDelete: false,
          });
        }
      });
    } else {
      this.setState({ confirmDelete: false });
    }
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
    const { pristine, submitting, cloning, initialValues, onCancel } = this.props;
    const { confirmDelete } = this.state;
    const edit = initialValues && initialValues.id;

    const closeButton = (
      <Button
        id="clickable-footer-close-locations-location"
        buttonStyle="default mega"
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    );

    const locationActions = (
      <>
        {edit &&
          <IfPermission perm="settings.tenant-settings.enabled">
            <Button
              id="clickable-delete-location"
              buttonStyle="danger mega"
              onClick={this.beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              <FormattedMessage id="stripes-core.button.delete" />
            </Button>
          </IfPermission>
        }
        <Button
          id="clickable-save-location"
          type="submit"
          buttonStyle="primary mega"
          marginBottom0
          disabled={((pristine || submitting) && !cloning)}
        >
          <FormattedMessage id="ui-tenant-settings.settings.general.saveAndClose" />
        </Button>
      </>
    );

    return (
      <PaneFooter
        renderStart={closeButton}
        renderEnd={locationActions}
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

  handleChangeInstitution = () => {
    this.props.change('campusId', null);
    this.props.change('libraryId', null);
  }

  handleChangeCampus = () => {
    this.props.change('libraryId', null);
  }

  renderItemInUseDialog() {
    const type = 'Location';

    return (
      <Modal
        open={this.state.showItemInUseDialog}
        label={<FormattedMessage id="stripes-smart-components.cv.cannotDeleteTermHeader" values={{ type }} />}
        size="small"
      >
        <Row>
          <Col xs>
            <FormattedMessage id="stripes-smart-components.cv.cannotDeleteTermMessage" values={{ type }} />
          </Col>
        </Row>
        <Row>
          <Col xs>
            <Button buttonStyle="primary" onClick={this.hideItemInUseDialog}>
              <FormattedMessage id="stripes-core.label.okay" />
            </Button>
          </Col>
        </Row>
      </Modal>
    );
  }

  hideItemInUseDialog = () => {
    this.setState({ showItemInUseDialog: false });
  }

  render() {
    const { stripes, handleSubmit, initialValues, locationResources, intl: { formatMessage } } = this.props;
    const loc = initialValues || {};
    const { confirmDelete, sections } = this.state;
    const disabled = !stripes.hasPerm('settings.tenant-settings.enabled');
    const name = loc.name || <FormattedMessage id="ui-tenant-settings.settings.location.locations.untitledLocation" />;
    const confirmationMessage = <SafeHTMLMessage id="ui-tenant-settings.settings.location.locations.deleteLocationMessage" values={{ name }} />;

    const institutions = [];
    ((locationResources.institutions || {}).records || []).forEach(i => {
      institutions.push({ value: i.id, label: `${i.name} ${i.code ? `(${i.code})` : ''}` });
    });

    const servicePoints = [];
    const entryList = sortBy((locationResources.servicePoints || {}).records || [], ['name']);
    entryList.forEach(i => {
      servicePoints.push({ label: `${i.name}` });
    });

    return (
      <form
        id="form-locations"
        onSubmit={handleSubmit(this.save)}
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
                    onChange={this.handleChangeInstitution}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <CampusField
                    list={(locationResources.campuses || {}).records || []}
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
                    onChange={this.handleChangeCampus}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <LibraryField
                    list={(locationResources.libraries || {}).records || []}
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
                  <ServicePointsFields servicePoints={servicePoints} />
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
            <ConfirmationModal
              id="deletelocation-confirmation"
              open={confirmDelete}
              heading={<FormattedMessage id="ui-tenant-settings.settings.location.locations.deleteLocation" />}
              message={confirmationMessage}
              onConfirm={() => { this.confirmDelete(true); }}
              onCancel={() => { this.confirmDelete(false); }}
              confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
            />
            { this.renderItemInUseDialog() }
          </Pane>
        </Paneset>
      </form>
    );
  }
}

const asyncBlurFields = ['name', 'code'];

export default stripesForm({
  form: 'locationForm',
  navigationCheck: true,
  enableReinitialize: true,
  asyncBlurFields,
})(withStripes(injectIntl(LocationForm)));
