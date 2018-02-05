import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Callout from '@folio/stripes-components/lib/Callout';

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
        reset: PropTypes.func.isRequired,
      }),
      urlValidator: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
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
    urlValidator: {
      type: 'okapi',
      accumulate: 'true',
      path: 'saml/validate',
      fetch: false,
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
    this.props.mutator.samlconfig.PUT(settings).then(() => {
      this.callout.sendCallout({ message: 'Settings were successfully updated.' });
    });
  }

  downloadMetadata(callback) {
    this.props.mutator.downloadFile.reset();
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
      <div style={{ width: '100%' }}>
        <SamlForm
          label={this.props.label}
          initialValues={samlFormData}
          onSubmit={(record) => { this.updateSettings(record); }}
          optionLists={{ identifierOptions: patronIdentifierTypes, samlBindingOptions: samlBindingTypes }}
          download={this.downloadMetadata}
          parentMutator={this.props.mutator}
        />
        <a hidden ref={(reference) => { this.downloadButton = reference; return reference; }}>Hidden download link</a>
        <Callout ref={ref => (this.callout = ref)} />
      </div>
    );
  }
}

export default SSOSettings;
