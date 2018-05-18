import { cloneDeep } from 'lodash';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import Pane from '@folio/stripes-components/lib/Pane';
import TextField from '@folio/stripes-components/lib/TextField';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IfPermission from '@folio/stripes-components/lib/IfPermission';
import IconButton from '@folio/stripes-components/lib/IconButton';
import Icon from '@folio/stripes-components/lib/Icon';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import ConfirmationModal from '@folio/stripes-components/lib/structures/ConfirmationModal';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { Accordion, ExpandAllButton } from '@folio/stripes-components/lib/Accordion';
import ViewMetaData from '@folio/stripes-smart-components/lib/ViewMetaData';
import stripesForm from '@folio/stripes-form';

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
    resources: PropTypes.shape({
      institutions: PropTypes.object,
      campuses: PropTypes.object,
      libraries: PropTypes.object,
    }),
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
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
    this.translate = this.translate.bind(this);

    this.state = {
      confirmDelete: false,
      sections: {
        generalSection: true,
        detailsSection: true,
      },
    };
  }

  save(data) {
    // massage the "details" property which is represented in the API as
    // an object but on the form as an array of key-value pairs
    const detailsObject = {};
    data.detailsArray.forEach(i => {
      detailsObject[i.name] = i.value;
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

  confirmDelete(confirmation) {
    const servicePoint = this.props.initialValues;
    if (confirmation) {
      this.props.onRemove(servicePoint);
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
          title={this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.close' })}
          aria-label={this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.close' })}
        />
      </PaneMenu>
    );
  }

  saveLastMenu() {
    const { pristine, submitting, initialValues, stripes: { intl: { formatMessage } } } = this.props;
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
            >{formatMessage({ id: 'stripes-core.button.delete' })}
            </Button>
          </IfPermission>
        }
        <Button
          id="clickable-save-location"
          type="submit"
          title={formatMessage({ id: 'stripes-core.button.saveAndClose' })}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          disabled={(pristine || submitting)}
        >{saveLabel}
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
      return (<div><Icon size="small" icon="edit" /><span>{`${this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.edit' })}: ${loc.name}`}</span></div>);
    }

    return this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.new' });
  }

  handleChangeInstitution = () => {
    this.props.change('campusId', null);
    this.props.change('libraryId', null);
  }

  handleChangeCampus = () => {
    this.props.change('libraryId', null);
  }

  render() {
    const { stripes, handleSubmit, initialValues, resources } = this.props;
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
    ((resources.institutions || {}).records || []).forEach(i => {
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
                    list={(resources.campuses || {}).records || []}
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
                    list={(resources.libraries || {}).records || []}
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
                  <Field label={this.translate('locations.name')} name="name" id="input-location-name" component={TextField} fullWidth disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field label={this.translate('code')} name="code" id="input-location-code" component={TextField} fullWidth disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field label={this.translate('locations.discoveryDisplayName')} name="discoveryDisplayName" id="input-location-discovery-display-name" component={TextField} fullWidth disabled={disabled} />
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
              <DetailsField translate={this.translate} />
            </Accordion>
            <ConfirmationModal
              open={confirmDelete}
              heading={this.translate('locations.deleteLocation')}
              message={confirmationMessage}
              onConfirm={() => { this.confirmDelete(true); }}
              onCancel={() => { this.confirmDelete(false); }}
              confirmLabel={this.props.stripes.intl.formatMessage({ id: 'stripes-core.button.delete' })}
            />
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
