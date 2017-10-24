import React, { PropTypes } from 'react';

import { Row, Col } from 'react-bootstrap';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';

class SamlForm extends React.Component {

  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    optionLists: PropTypes.shape({
      patronIdentifierTypes: PropTypes.arrayOf(PropTypes.object),
      samlBindingTypes: PropTypes.arrayOf(PropTypes.object),
    }).isRequired,
    samlConfig: PropTypes.object,
    samlUrl: PropTypes.string.isRequired,
    downloadMetadata: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = props.samlConfig;
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    const {
      handleSubmit,
      optionLists,
      samlConfig,
      samlUrl,
      downloadMetadata,
    } = this.props;

    const identifierOptions = (optionLists.patronIdentifierTypes || []).map(i => (
      { id: i.key, label: i.label, value: i.key, selected: samlConfig.userProperty === i.key }
    ));

    const samlBindingOptions = optionLists.samlBindingTypes.map(i => (
      { id: i.key, label: i.label, value: i.key, selected: samlConfig.samlBinding === i.key }
    ));

    return (
      <form id="form-saml">
        <Row>
          <Col xs={12}>
            <TextField
              id="idpUrl"
              label="IdP URL"
              value={samlConfig.idpUrl}
              onChange={this.changeValue}
            />
            <a href={samlUrl} download="proposed_file_name">Download</a>
            <Button title="Download metadata" onClick={downloadMetadata}> Download metadata </Button>
          </Col>

          <Col xs={12}>
            <Select
              id="samlBinding"
              label="SAML binding"
              value={samlConfig.samlBinding}
              dataOptions={samlBindingOptions}
              onChange={this.changeValue}
            />
          </Col>
          <Col xs={12}>
            <TextField
              id="samlAttribute"
              label="SAML attribute"
              value={samlConfig.samlAttribute}
              onChange={this.changeValue}
            />
          </Col>
          <Col xs={12}>
            <Select
              id="userPropery"
              label="User property"
              value={samlConfig.userProperty}
              dataOptions={identifierOptions}
              onChange={this.changeValue}
            />
          </Col>

          <Col xs={12}>
            <Button id="update_saml_config" title="Save" type="submit" onClick={handleSubmit}> Save </Button>
          </Col>
        </Row>
      </form>
    );
  }

}

export default SamlForm;

/*export default stripesForm({
  form: 'samlForm',
  navigationCheck: true,
})(SamlForm);*/
