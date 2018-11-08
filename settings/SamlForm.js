import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Pane,
  Row,
  Select,
  TextField
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { Field } from 'redux-form';

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
    parentMutator: PropTypes.shape({ // eslint-disable-line react/no-unused-prop-types
      urlValidator: PropTypes.shape({
        reset: PropTypes.func.isRequired,
        GET: PropTypes.func.isRequired,
      }).isRequired,
      downloadFile: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
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
    this.props.parentMutator.downloadFile.reset();
    this.props.parentMutator.downloadFile.GET().then((result) => {
      const anchor = document.createElement('a');
      anchor.href = `data:text/plain;base64,${result.fileContent}`;
      anchor.download = 'sp-metadata.xml';
      anchor.click();
      this.updateMetadataInvalidated();
    });
  }

  render() {
    const {
      handleSubmit,
      reset, // eslint-disable-line no-unused-vars
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
    const lastMenu = (<Button type="submit" buttonStyle="primary" disabled={(pristine || submitting)}>Save</Button>);

    return (
      <form id="form-saml" onSubmit={handleSubmit}>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle={label} lastMenu={lastMenu}>
          <Row>
            <Col xs={12}>
              <Field
                label={<FormattedMessage id="ui-organization.settings.saml.idpUrl" />}
                name="idpUrl"
                id="samlconfig_idpUrl"
                component={TextField}
                required
                fullWidth
              />
              <div hidden={!this.props.initialValues.metadataInvalidated}>
                <FormattedMessage id="ui-organization.settings.saml.idpUrlChanged" />
              </div>
              <Button
                onClick={this.downloadMetadata}
              >
                <FormattedMessage id="ui-organization.settings.saml.downloadMetadata" />
              </Button>
              <Field
                label={<FormattedMessage id="ui-organization.settings.saml.binding" />}
                name="samlBinding"
                id="samlconfig_samlBinding"
                placeholder="---"
                component={Select}
                dataOptions={samlBindingOptions}
                fullWidth
              />
              <Field
                label={<FormattedMessage id="ui-organization.settings.saml.attribute" />}
                name="samlAttribute"
                id="samlconfig_samlAttribute"
                component={TextField}
                required
                fullWidth
              />
              <Field
                label={<FormattedMessage id="ui-organization.settings.saml.userProperty" />}
                name="userProperty"
                id="samlconfig_userProperty"
                placeholder="---"
                component={Select}
                dataOptions={identifierOptions}
                fullWidth
              />
            </Col>
          </Row>
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'samlForm',
  asyncBlurFields: ['idpUrl'],
  navigationCheck: true,
  enableReinitialize: true,
})(SamlForm);
