import { cloneDeep, isEmpty } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field, SubmissionError } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  IfPermission,
  Modal,
  Pane,
  PaneMenu,
  Paneset,
  Row,
  Select,
  TextArea,
  TextField
} from '@folio/stripes/components';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { ViewMetaData } from '@folio/stripes/smart-components';
import stripesForm from '@folio/stripes/form';

import CampusField from './CampusField';
import LibraryField from './LibraryField';
import DetailsField from './DetailsField';

class LocationForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
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
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
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
    this.translate = this.translate.bind(this);

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
    const { initialValues, stripes: { intl: { formatMessage } } } = this.props;
    const uniqueFields = ['name', 'code'];
    const errors = uniqueFields.reduce((acc, f) => {
      if (initialValues[f] === data[f]) {
        acc[f] = formatMessage({ id: `ui-organization.settings.location.locations.validation.${f}.unique` });
      }
      return acc;
    }, {});

    if (!isEmpty(errors)) {
      throw new SubmissionError(errors);
    }
  }

  save(data) {
    const { cloning } = this.props;
    if (cloning) this.validateCloning(data);

    // massage the "details" property which is represented in the API as
    // an object but on the form as an array of key-value pairs
    const detailsObject = {};
    if (!data.detailsArray) {
      data.detailsArray = [];
    }
    data.detailsArray.forEach(i => {
      if (i.name !== undefined) detailsObject[i.name] = i.value;
    });
    delete data.detailsArray;
    data.details = detailsObject;

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

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.location.${id}`
    });
  }

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-locations-location"
          onClick={this.props.onCancel}
          icon="closeX"
          title={this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.cancel' })}
          aria-label={this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.cancel' })}
        />
      </PaneMenu>
    );
  }

  saveLastMenu() {
    const { pristine, submitting, cloning, initialValues, stripes: { intl: { formatMessage } } } = this.props;
    const { confirmDelete } = this.state;
    const edit = initialValues && initialValues.id;
    const saveLabel = edit ? formatMessage({ id: 'stripes-core.button.saveAndClose' }) : this.translate('locations.createLocation');

    return (
      <PaneMenu>
        {edit &&
          <IfPermission perm="settings.organization.enabled">
            <Button
              id="clickable-delete-location"
              title={formatMessage({ id: 'stripes-core.button.delete' })}
              buttonStyle="danger"
              onClick={this.beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              {formatMessage({ id: 'stripes-core.button.delete' })}
            </Button>
          </IfPermission>
        }
        <Button
          id="clickable-save-location"
          type="submit"
          title={formatMessage({ id: 'stripes-core.button.saveAndClose' })}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          disabled={((pristine || submitting) && !cloning)}
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
    const loc = initialValues || {};

    if (loc.id) {
      return (
        <div>
          <Icon size="small" icon="edit" />
          <span>{`${this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.edit' })}: ${loc.name}`}</span>
        </div>
      );
    }

    return this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.location.locations.new' });
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
        label={this.props.stripes.intl.formatMessage({ id: 'stripes-smart-components.cv.cannotDeleteTermHeader' }, { type })}
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
    const { stripes, handleSubmit, initialValues, locationResources } = this.props;
    const loc = initialValues || {};
    const { confirmDelete, sections } = this.state;
    const disabled = !stripes.hasPerm('settings.organization.enabled');
    const name = loc.name || this.translate('locations.untitledLocation');
    const confirmationMessage = <SafeHTMLMessage id="ui-organization.settings.location.locations.deleteLocationMessage" values={{ name }} />;
    const statusOptions = [
      { label: this.translate('locations.active'), value: true },
      { label: this.translate('locations.inactive'), value: false },
    ];

    const institutions = [];
    ((locationResources.institutions || {}).records || []).forEach(i => {
      institutions.push({ value: i.id, label: `${i.name} ${i.code ? `(${i.code})` : ''}` });
    });

    // massage the "details" property which is represented in the API as
    // an object but on the form as an array of key-value pairs sorted by key
    const detailsArray = [];
    Object.keys(loc.details || []).sort().forEach(key => {
      detailsArray.push({ name: key, value: loc.details[key] });
    });
    loc.detailsArray = detailsArray;

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
                  <Field
                    label={`${this.translate('institutions.institution')} *`}
                    name="institutionId"
                    id="input-location-institution"
                    component={Select}
                    autoFocus
                    required
                    disabled={disabled}
                    dataOptions={[{ label: this.translate('institutions.selectInstitution') }, ...institutions]}
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
                    initialOption={{ label: this.translate('campuses.selectCampus') }}
                    label={`${this.translate('campuses.campus')} *`}
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
                    initialOption={{ label: this.translate('libraries.selectLibrary') }}
                    label={`${this.translate('libraries.library')} *`}
                    name="libraryId"
                    id="input-location-library"
                    component={Select}
                    required
                    disabled={disabled}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field label={`${this.translate('locations.name')} *`} name="name" id="input-location-name" component={TextField} fullWidth disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field label={`${this.translate('code')} *`} name="code" id="input-location-code" component={TextField} fullWidth disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field label={`${this.translate('locations.discoveryDisplayName')} *`} name="discoveryDisplayName" id="input-location-discovery-display-name" component={TextField} fullWidth disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Field label={this.translate('locations.status')} name="isActive" id="input-location-status" component={Select} dataOptions={statusOptions} disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field label={this.translate('locations.description')} name="description" id="input-location-description" component={TextArea} fullWidth disabled={disabled} />
                </Col>
              </Row>
            </Accordion>
            <Accordion
              open={sections.detailsSection}
              id="detailsSection"
              onToggle={this.handleSectionToggle}
              label={this.translate('locations.locationDetails')}
            >
              <this.cDetailsField translate={this.translate} />
            </Accordion>
            <ConfirmationModal
              id="deletelocation-confirmation"
              open={confirmDelete}
              heading={this.translate('locations.deleteLocation')}
              message={confirmationMessage}
              onConfirm={() => { this.confirmDelete(true); }}
              onCancel={() => { this.confirmDelete(false); }}
              confirmLabel={this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.delete' })}
            />
            { this.renderItemInUseDialog() }
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'locationForm',
  navigationCheck: true,
  enableReinitialize: false,
})(LocationForm);
