/* eslint-env browser */
import React, { PropTypes } from 'react';

import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import stripesForm from '@folio/stripes-form';
import { Field } from 'redux-form';
import fetch from 'isomorphic-fetch';

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
    optionLists: PropTypes.shape({
      identifierOptions: PropTypes.arrayOf(PropTypes.object),
      samlBindingOptions: PropTypes.arrayOf(PropTypes.object),
    }),
    okapi: PropTypes.shape({
      url: PropTypes.string,
      tenant: PropTypes.string,
      token: PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.downloadMetadata = this.downloadMetadata.bind(this);
  }

  downloadMetadata() {
    return fetch(`${this.props.okapi.url}/saml/regenerate`,
      { headers: Object.assign({}, {
        'X-Okapi-Tenant': this.props.okapi.tenant,
        'X-Okapi-Token': this.props.okapi.token }),
      },
    ).then((response) => {
      if (response.status === 200) {
        response.blob().then((blob) => {
          if (blob) {
            const windowUrl = window.URL || window.webkitURL;
            const url = windowUrl.createObjectURL(blob);
            const anchor = this.downloadButton;
            anchor.href = url;
            anchor.download = 'sp-metadata.xml';
            anchor.click();
            windowUrl.revokeObjectURL(url);
            this.props.initialValues.metadataInvalidated = false;
            this.forceUpdate();
          }
        });
      }
      // TODO: notify user about failed download
    });
  }

  render() {
    const {
      handleSubmit,
      reset,  // eslint-disable-line no-unused-vars
      pristine,
      submitting,
      initialValues,
      optionLists,
    } = this.props;

    const identifierOptions = (optionLists.identifierOptions || []).map(i => (
      { id: i.key, label: i.label, value: i.key, selected: initialValues.userProperty === i.key }
    ));

    const samlBindingOptions = optionLists.samlBindingOptions.map(i => (
      { id: i.key, label: i.label, value: i.key, selected: initialValues.samlBinding === i.key }
    ));

    return (
      <form id="form-saml">
        <Row>
          <Col xs={12}>
            <Field label="IdP URL *" name="idpUrl" id="samlconfig_idpUrl" component={TextField} required fullWidth />
            <a hidden ref={(reference) => { this.downloadButton = reference; return reference; }}>Hidden download link</a>
            <div hidden={!this.props.initialValues.metadataInvalidated}>The IdP URL has changed since the last download. Please download the service point metadata and re-upload to the IdP.</div>
            <Button title="Download metadata" onClick={this.downloadMetadata}> Download metadata </Button>
            <Field label="SAML binding *" name="samlBinding" id="samlconfig_samlBinding" component={Select} dataOptions={samlBindingOptions} fullWidth />
            <Field label="SAML attribute *" name="samlAttribute" id="samlconfig_samlAttribute" component={TextField} required fullWidth />
            <Field label="User property *" name="userProperty" id="samlconfig_userProperty" component={Select} dataOptions={identifierOptions} fullWidth />
          </Col>

          <Col xs={12}>
            <Button id="update_saml_config" title="Save" type="submit" disabled={pristine || submitting} onClick={handleSubmit}> Save </Button>
          </Col>
        </Row>
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
