import React, { PropTypes } from 'react';

import { Row, Col } from 'react-bootstrap';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';
import stripesForm from '@folio/stripes-form';
import { Field } from 'redux-form';

function validate(values) {
  const errors = {};

  if (!values.idpUrl) {
    errors.idpUrl = 'Please fill this in to continue';
  }
/*
  if (!values.samlBinding) {
    errors.samlBinding = 'Please select SAML binding type';
  }

  if (!values.samlAttribute) {
    errors.samlAttribute = 'Please fill this in to continue';
  }

  if (!values.userProperty) {
    errors.userProperty = 'Please select a user property';
  }*/
  return errors;
}

class TestForm extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    onCancel: PropTypes.func,
    initialValues: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    optionLists: PropTypes.shape({
      identifierOptions: PropTypes.arrayOf(PropTypes.object),
      samlBindingOptions: PropTypes.arrayOf(PropTypes.object),
    }),
  };

  /*constructor(props) {
    super(props);
    this.state = props.samlConfig;
    this.changeValue = this.changeValue.bind(this);
  }*/

  /*changeValue(e) {
    this.setState({ [e.target.id]: e.target.value });
  }*/

  render() {

    const {
      handleSubmit,
      reset,  // eslint-disable-line no-unused-vars
      pristine,
      submitting,
      onCancel,
      initialValues,
      optionLists,
    } = this.props;

    console.log('init values: ', initialValues);

    return (
      <form id="form-saml">
        <Row>
          <Col xs={12}>
            <Field label="IdP URL" name="initialValues.idpUrl" id="samlconfig_idpUrl" component={TextField} required fullWidth />
            <Button title="Download metadata" onClick={this.downloadMetadata}> Download metadata </Button>
          </Col>

          <Col xs={12}>
            <Button id="update_saml_config" title="Save" type="submit" disabled={pristine || submitting} onClick={handleSubmit}> Save </Button>
          </Col>
        </Row>
      </form>
    );
  }

}
/*

            <Field label="id" name="id" id="samlconfig_id" component={TextField} required fullWidth hidden />
*/

export default stripesForm({
  form: 'testForm',
  validate,
  navigationCheck: true,
})(TestForm);