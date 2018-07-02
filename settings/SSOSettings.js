import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesShape } from '@folio/stripes-core/src/Stripes';
import Callout from '@folio/stripes-components/lib/Callout';

import { patronIdentifierTypes, samlBindingTypes } from '../constants';
import SamlForm from './SamlForm';

class SSOSettings extends React.Component {
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

  static propTypes = {
    label: PropTypes.string.isRequired,
    stripes: stripesShape.isRequired,
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

  constructor(props) {
    super(props);
    this.idpUrl = '';
    this.validate = this.validate.bind(this);
    this.asyncValidate = this.asyncValidate.bind(this);
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
    const updateMsg = this.props.stripes.intl.formatMessage({ id: 'ui-organization.settings.updated' });
    settings.okapiUrl = this.props.stripes.okapi.url;
    this.props.mutator.samlconfig.PUT(settings).then(() => {
      this.callout.sendCallout({ message: updateMsg });
    });
  }

  validate(values) {
    const errors = {};
    const formatMsg = this.props.stripes.intl.formatMessage;

    if (!values.idpUrl) {
      errors.idpUrl = formatMsg({ id: 'ui-organization.settings.saml.validate.fillIn' });
    }
    if (!values.samlBinding) {
      errors.samlBinding = formatMsg({ id: 'ui-organization.settings.saml.validate.binding' });
    }
    if (!values.samlAttribute) {
      errors.samlAttribute = formatMsg({ id: 'ui-organization.settings.saml.validate.fillIn' });
    }
    if (!values.userProperty) {
      errors.userProperty = formatMsg({ id: 'ui-organization.settings.saml.validate.userProperty' });
    }
    return errors;
  }

  asyncValidate(values, dispatch, props, blurredField) {
    const formatMsg = this.props.stripes.intl.formatMessage;
    if (blurredField === 'idpUrl'
        && values.idpUrl !== props.initialValues.idpUrl
        && values.idpUrl !== this.idpUrl) {
      return new Promise((resolve, reject) => {
        const uv = props.parentMutator.urlValidator;
        uv.reset();
        uv.GET({ params: { type: 'idpurl', value: values.idpUrl } }).then((response) => {
          if (response.valid === false) {
            const error = { idpUrl: formatMsg({ id: 'ui-organization.settings.saml.validate.idpUrl' }) };
            reject(error);
          } else {
            this.idpUrl = values.idpUrl;
            resolve();
          }
        });
      });
    }
    return new Promise(resolve => resolve());
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
          parentMutator={this.props.mutator}
          validate={this.validate}
          asyncValidate={this.asyncValidate}
          stripes={this.props.stripes}
        />
        <a // eslint-disable-line jsx-a11y/anchor-is-valid
          hidden
          ref={(reference) => { this.downloadButton = reference; return reference; }}
        >
          <FormattedMessage id="ui-organization.settings.hiddenDownloadLink" />
        </a>
        <Callout ref={(ref) => { this.callout = ref; }} />

      </div>
    );
  }
}

export default SSOSettings;
