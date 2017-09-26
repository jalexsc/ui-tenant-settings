import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';
import TextField from '@folio/stripes-components/lib/TextField';
import Button from '@folio/stripes-components/lib/Button';
import Select from '@folio/stripes-components/lib/Select';

import { patronIdentifierTypes, samlBindingTypes, samlConfigurationKeys, samlDefaultConfigurationValues } from '../constants';

class SSOSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      okapi: PropTypes.shape({
        url: PropTypes.string,
        tenant: PropTypes.string,
      })
    }).isRequired,
    label: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      setting: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      setting: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    setting: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module==LOGIN-SAML and configName==saml)',
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/%{recordId}',
      },
    },
  });

  constructor(props) {
    super(props);
    this.changeSetting = this.changeSetting.bind(this);
    this.downloadMetadata = this.downloadMetadata.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.state = {};
  }

  updateSettings(settings) {

    const currentSettings = {};
    settings.forEach((item) => {
      currentSettings[item.code] = item.value;
    });

    samlConfigurationKeys.forEach((config) => {
      if (currentSettings[config.key]) {
        this.setState({ [config.key]: currentSettings[config.key] });
      } else {
        this.setState({
          [config.key]: samlDefaultConfigurationValues[config.key]
        });
      }
    });
  }

  changeSetting() {
    const settings = (this.props.resources.setting || {}).records || [];
    const existingMap = {};
    settings.forEach((setting) => {
      existingMap[setting.code] = setting;
    });
    Object.keys(this.state).forEach((key) => {
      const value = this.state[key];
      if (existingMap[key] && existingMap[key].id) {
        // Setting has been set previously: replace it
        if (this.props.mutator.recordId) {
          this.props.mutator.recordId.replace(existingMap[key].id);
        } else {
          this.props.mutator.recordId = existingMap[key].id;
        }
        this.props.mutator.setting.PUT({
          module: 'LOGIN-SAML',
          configName: 'saml',
          code: key,
          id: existingMap[key].id,
          value,
        });
      } else if (value) {
        // No setting: create a new one
        this.props.mutator.setting.POST({
          module: 'LOGIN-SAML',
          configName: 'saml',
          code: key,
          value,
        });
      }
    });    
  }

  downloadMetadata(e) {
    window.open(`${this.props.stripes.okapi.url}/_/invoke/tenant/${this.props.stripes.okapi.tenant}/saml/regenerate`, '_blank');
  }

  changeValue(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    const settings = (this.props.resources.setting || {}).records || [];
    if (Object.keys(this.state).length === 0
      && Object.keys(settings).length !== 0) {
      this.updateSettings(settings);
    }

    const identifierTypeOptions = patronIdentifierTypes.map(i => (
      {
        id: i.key,
        label: i.label,
        value: i.key,
      }
    ));

    const samlBindingOptions = samlBindingTypes.map(i => (
      {
        id: i.key,
        label: i.label,
        value: i.key,
      }
    ));

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <Row>
          <Col xs={12}>
            <TextField
              id="idp.url"
              label="IdP URL"
              value={this.state['idp.url']}
              onChange={this.changeValue}
            />
          </Col>
          <Col xs={12}>
            <Select
              id="saml.binding"
              label="SAML binding"
              value={this.state['saml.binding']}
              dataOptions={samlBindingOptions}
              onChange={this.changeValue}
            />
          </Col>
          <Col xs={12}>
            <TextField
              id="saml.attribute"
              label="SAML attribute"
              value={this.state['saml.attribute']}
              onChange={this.changeValue}
            />
          </Col>
          <Col xs={12}>
            <Select
              id="user.propery"
              label="User property"
              value={this.state['user.propery']}
              dataOptions={identifierTypeOptions}
              onChange={this.changeValue}
            />
          </Col>
          <Col xs={12}>
            <Button title="Apply changes" onClick={this.changeSetting}> Apply changes </Button>
          </Col>
          <Col xs={12}>
            <Button title="Download metadata" onClick={this.downloadMetadata}> Download metadata </Button>
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default SSOSettings;
