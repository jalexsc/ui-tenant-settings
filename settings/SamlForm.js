import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import Pane from '@folio/stripes-components/lib/Pane';
import stripesForm from '@folio/stripes-form';
import { Field } from 'redux-form';

function validate(values) {
  const errors = {};

  if (!values.idpUrl) {
    errors.idpUrl = 'Please fill this in to continue';
  }

  if (!values.samlBinding) {
    errors.samlBinding = 'Please select SAML binding type';
  }

  if (!values.samlAttribute) {
    errors.samlAttribute = 'Please fill this in to continue';
  }

  if (!values.userProperty) {
    errors.userProperty = 'Please select a user property';
  }
  return errors;
}

class SamlForm extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
    download: PropTypes.func.isRequired,
    optionLists: PropTypes.shape({
      identifierOptions: PropTypes.arrayOf(PropTypes.object),
      samlBindingOptions: PropTypes.arrayOf(PropTypes.object),
    }),
    label: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.downloadMetadata = this.downloadMetadata.bind(this);
    this.updateMetadataInvalidated = this.updateMetadataInvalidated.bind(this);
  }

  updateMetadataInvalidated() {
    this.props.initialValues.metadataInvalidated = false;
    this.forceUpdate();
  }

  downloadMetadata() {
    this.props.download(this.updateMetadataInvalidated);
  }

  render() {
    const {
      handleSubmit,
      reset,  // eslint-disable-line no-unused-vars
      pristine,
      submitting,
      initialValues,
      optionLists,
      label,
    } = this.props;

    const identifierOptions = (optionLists.identifierOptions || []).map(i => (
      { id: i.key, label: i.label, value: i.key, selected: initialValues.userProperty === i.key }
    ));

    const samlBindingOptions = optionLists.samlBindingOptions.map(i => (
      { id: i.key, label: i.label, value: i.key, selected: initialValues.samlBinding === i.key }
    ));

    const lastMenu = (<Button type="submit" disabled={(pristine || submitting)}>Save</Button>);

    return (
      <form id="form-saml" onSubmit={handleSubmit}>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle={label} lastMenu={lastMenu}>
          <Row>
            <Col xs={12}>
              <Field label="IdP URL *" name="idpUrl" id="samlconfig_idpUrl" component={TextField} required fullWidth />
              <div hidden={!this.props.initialValues.metadataInvalidated}>The IdP URL has changed since the last download. Please download the service point metadata and re-upload to the IdP.</div>
              <Button title="Download metadata" onClick={this.downloadMetadata}> Download metadata </Button>
              <Field label="SAML binding *" name="samlBinding" id="samlconfig_samlBinding" placeholder="---" component={Select} dataOptions={samlBindingOptions} fullWidth />
              <Field label="SAML attribute *" name="samlAttribute" id="samlconfig_samlAttribute" component={TextField} required fullWidth />
              <Field label="User property *" name="userProperty" id="samlconfig_userProperty" placeholder="---" component={Select} dataOptions={identifierOptions} fullWidth />
            </Col>
          </Row>
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'samlForm',
  validate,
  navigationCheck: true,
  enableReinitialize: true,
})(SamlForm);
