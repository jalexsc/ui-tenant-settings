import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import { patronIdentifierTypes, samlBindingTypes } from '../constants';

import SamlForm from './SamlForm';
import TestForm from './TestForm';

class SSOSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      okapi: PropTypes.shape({
        url: PropTypes.string,
        tenant: PropTypes.string,
      }),
      hasInterface: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.string.isRequired,
    resources: PropTypes.shape({
      samlconfig: PropTypes.object,
    }).isRequired,
    mutator: PropTypes.shape({
      recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      samlconfig: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    samlconfig: {
      type: 'okapi',
      path: 'saml/configuration',
      PUT: {
        path: 'saml/configuration',
      },
    },
  });

  constructor(props) {
    super(props);
    this.downloadMetadata = this.downloadMetadata.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.connectedApp = props.stripes.connect(SSOSettings);
    this.state = {};
  }

  getConfig() {
    const { resources } = this.props;
    const samlconfig = (resources.samlconfig || {}).records || [];
    const configValue = (samlconfig.length === 0) ? {} : samlconfig[0];
    const configData = configValue ? _.cloneDeep(configValue) : configValue;
    console.log('config data: ', configData);
    return configData;
  }

  updateSettings(settings) {
    console.log('settings: ', settings);

    /* if (this.props.mutator.recordId) {
      this.props.mutator.recordId.replace(settings.id);
    } else {
      this.props.mutator.recordId = settings.id;
    } */

    this.props.mutator.samlconfig.PUT(settings).then((result) => {
      this.stripes.logger.log('Response: ', result);
    });

    /* const currentSettings = {};
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
    }); */
  }

  /* changeSetting() {
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
  } */

  downloadMetadata(e) {
    window.open(`${this.props.stripes.okapi.url}/_/invoke/tenant/${this.props.stripes.okapi.tenant}/saml/regenerate`, '_blank');
  }

  changeValue(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  onCancel() {
    console.log('Test');
  }

  render() {

   /* if (!this.props.stripes.hasInterface('login-saml')) {
      //TODO: return message for missing module
      return <div>SAML module is not deployed</div>;
    }*/
    /*
    <IfPermission perm="perms.users.get">
        <this.connectedUserPermissions {...this.props} />
      </IfPermission>
    */

    const samlFormData = this.getConfig();
    console.log('form data response: ', samlFormData);
   // samlFormData.id = 'test';

    /*if (!this.state.samlConfig) {
      this.setState({ samlConfig: configValue });
    }*/

    /*const settings = (this.props.resources.setting || {}).records || [];
    if (Object.keys(this.state).length === 0
      && Object.keys(settings).length !== 0) {
      this.updateSettings(settings);
    }*/

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        

        <TestForm
          initialValues={samlFormData}
          onSubmit={(record) => { this.updateSettings(record); }}
          onCancel={this.onClickCloseEditUser}
          okapi={this.props.stripes.okapi}
        />

      </Pane>
    );
  }
}
/*<SamlForm
          samlConfig={samlFormData}
          handleSubmit={(record) => { this.updateSettings(record); }}
          optionLists={{ patronIdentifierTypes, samlBindingTypes }}
          samlUrl={`${this.props.stripes.okapi.url}/_/invoke/tenant/${this.props.stripes.okapi.tenant}/saml/regenerate`}
          downloadMetadata={this.downloadMetadata}
        />*/

export default SSOSettings;
