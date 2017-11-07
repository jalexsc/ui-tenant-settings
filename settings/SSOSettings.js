import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import { patronIdentifierTypes, samlBindingTypes } from '../constants';

import SamlForm from './SamlForm';

class SSOSettings extends React.Component {

  static propTypes = {
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
      downloadFile: PropTypes.shape({
        GET: PropTypes.func.isRequired,
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
    downloadFile: {
      accumulate: true,
      type: 'okapi',
      path: 'saml/regenerate',
    },
  });

  constructor(props) {
    super(props);
    this.updateSettings = this.updateSettings.bind(this);
    this.downloadMetadata = this.downloadMetadata.bind(this);
  }

  getConfig() {
    const { resources } = this.props;
    const config = (resources.samlconfig || {}).records || [];
    const configValue = (config.length === 0) ? {} : config[0];
    const configData = configValue ? _.cloneDeep(configValue) : configValue;
    return configData;
  }

  updateSettings(settings) {
    this.props.mutator.samlconfig.PUT(settings);
  }

  downloadMetadata(callback) {
    this.props.mutator.downloadFile.GET().then((result) => {
      const anchor = this.downloadButton;
      anchor.href = `data:text/plain;base64,${result.fileContent}`;
      anchor.download = 'sp-metadata.xml';
      anchor.click();
      callback();
    });
  }

  render() {
    const samlFormData = this.getConfig();

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <SamlForm
          initialValues={samlFormData}
          onSubmit={(record) => { this.updateSettings(record); }}
          optionLists={{ identifierOptions: patronIdentifierTypes, samlBindingOptions: samlBindingTypes }}
          download={this.downloadMetadata}
        />
        <a hidden ref={(reference) => { this.downloadButton = reference; return reference; }}>Hidden download link</a>
      </Pane>
    );
  }
}

export default SSOSettings;
