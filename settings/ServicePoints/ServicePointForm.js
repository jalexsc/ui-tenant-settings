import { cloneDeep } from 'lodash';
import React from 'react';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import PropTypes from 'prop-types';

import {
  Accordion,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  IfPermission,
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

import EditableLocationList from './EditableLocationList';

class ServicePointForm extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    change: PropTypes.func,
    onRemove: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.beginDelete = this.beginDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.handleSectionToggle = this.handleSectionToggle.bind(this);

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.cLocationList = props.stripes.connect(EditableLocationList);

    this.state = {
      confirmDelete: false,
      sections: {
        generalSection: true,
        locationSection: true
      },
    };
  }

  save(data) {
    const { locationIds } = data;

    if (locationIds) {
      data.locationIds = locationIds.filter(l => l).map(l => (l.id ? l.id : l));
    }

    delete data.location;

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
      id: `ui-organization.settings.servicePoints.${id}`
    });
  }

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-service-point"
          onClick={this.props.onCancel}
          icon="closeX"
          title={this.translate('stripes-core.button.cancel')}
          aria-label={this.translate('stripes-core.button.cancel')}
        />
      </PaneMenu>
    );
  }

  saveLastMenu() {
    const { pristine, submitting, initialValues } = this.props;
    const { confirmDelete } = this.state;
    const edit = initialValues && initialValues.id;
    const saveLabel = edit ? this.translate('saveAndClose') : this.translate('createServicePoint');

    return (
      <PaneMenu>
        {edit &&
          <IfPermission perm="settings.organization.enabled">
            <Button
              id="clickable-delete-service-point"
              title={this.translate('delete')}
              buttonStyle="danger"
              onClick={this.beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              {this.translate('delete')}
            </Button>
          </IfPermission>
        }
        <Button
          id="clickable-save-service-point"
          type="submit"
          title={this.translate('saveAndClose')}
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
          <span>{`${this.translate('edit')}: ${servicePoint.name}`}</span>
        </div>
      );
    }

    return this.translate('new');
  }

  render() {
    const { stripes, handleSubmit, initialValues, change } = this.props;
    const servicePoint = initialValues || {};
    const { confirmDelete, sections } = this.state;
    const disabled = !stripes.hasPerm('settings.organization.enabled');
    const name = servicePoint.name || this.translate('untitledServicePoint');

    const confirmationMessage = (
      <SafeHTMLMessage
        id="ui-organization.settings.servicePoints.deleteServicePointMessage"
        values={{ name }}
      />
    );

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
              label={this.translate('generalInformation')}
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
                  <Field label={`${this.translate('name')} *`} name="name" id="input-service-point-name" component={TextField} autoFocus required fullWidth disabled={disabled} />
                  <Field label={`${this.translate('code')} *`} name="code" id="input-service-point-code" component={TextField} fullWidth disabled={disabled} />
                  <Field label={`${this.translate('discoveryDisplayName')} *`} name="discoveryDisplayName" id="input-service-point-code" component={TextField} fullWidth disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={8}>
                  <Field label={this.translate('description')} name="description" id="input-service-description" component={TextArea} fullWidth disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={4}>
                  <Field label={this.translate('shelvingLagTime')} name="shelvingLagTime" id="input-service-shelvingLagTime" component={TextField} fullWidth disabled={disabled} />
                </Col>
              </Row>
              <Row>
                <Col xs={2}>
                  <Field label={this.translate('pickupLocation')} name="pickupLocation" id="input-service-pickupLocation" component={Select} dataOptions={selectOptions} disabled={disabled} />
                </Col>
              </Row>
            </Accordion>

            <this.cLocationList
              initialValues={servicePoint}
              expanded={sections.locationSection}
              change={change}
              stripes={stripes}
              onToggle={this.handleSectionToggle}
            />

            <ConfirmationModal
              id="deleteservicepoint-confirmation"
              open={confirmDelete}
              heading={this.translate('deleteServicePoint')}
              message={confirmationMessage}
              onConfirm={() => { this.confirmDelete(true); }}
              onCancel={() => { this.confirmDelete(false); }}
              confirmLabel={this.translate('delete')}
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
