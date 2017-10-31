import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import { patronIdentifierTypes, samlBindingTypes } from '../constants';

import SamlForm from './SamlForm';

class SSOSettings extends React.Component {

  static contextTypes = {
    store: PropTypes.object,
  };

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
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
    this.updateSettings = this.updateSettings.bind(this);
  }

  getConfig() {
    const { resources } = this.props;
    const config = (resources.samlconfig || {}).records || [];
    const configValue = (config.length === 0) ? {} : config[0];
    const configData = configValue ? _.cloneDeep(configValue) : configValue;
    return configData;
  }

  updateSettings(settings) {
    this.props.mutator.samlconfig.PUT(settings).then((result) => {
      this.props.stripes.logger.log('Response: ', result);
    });
  }

  render() {

   /* if (!this.props.stripes.hasInterface('login-saml')) {
      //TODO: return message for missing module
      return <div>SAML module is not deployed</div>;
    }*/

    const samlFormData = this.getConfig();

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <SamlForm
          initialValues={samlFormData}
          onSubmit={(record) => { this.updateSettings(record); }}
          optionLists={{ identifierOptions: patronIdentifierTypes, samlBindingOptions: samlBindingTypes }}
          okapi={this.context.store.getState().okapi}
        />
      </Pane>
    );
  }
}

export default SSOSettings;
