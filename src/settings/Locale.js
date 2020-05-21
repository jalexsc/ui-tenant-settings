import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { IfPermission } from '@folio/stripes/core';
import { ConfigManager } from '@folio/stripes/smart-components';
import { Button, Col, Row, Select, CurrencySelect } from '@folio/stripes/components';
import timezones from '../util/timezones';

const timeZonesList = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

const options = [
  { value: 'ar-AR', label: 'Arabic' },
  { value: 'zh-CN', label: 'Chinese Simplified' },
  { value: 'zh-TW', label: 'Chinese Traditional' },
  { value: 'da-DK', label: 'Danish' },
  { value: 'en-GB', label: 'English - Great Britain' },
  { value: 'en-SE', label: 'English - Sweden' },
  { value: 'en-US', label: 'English - United States' },
  { value: 'fr-FR', label: 'French - France' },
  { value: 'de-DE', label: 'German - Germany' },
  { value: 'he', label: 'Hebrew' },
  { value: 'hu-HU', label: 'Hungarian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'it-IT', label: 'Italian - Italy' },
  { value: 'pt-BR', label: 'Portuguese - Brazil' },
  { value: 'pt-PT', label: 'Portuguese - Portugal' },
  { value: 'ru', label: 'Russian' },
  { value: 'es', label: 'Spanish' },
  { value: 'es-419', label: 'Spanish - Latin America' },
  { value: 'es-ES', label: 'Spanish - Spain' },
  { value: 'ur', label: 'Urdu' },
];

class Locale extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      setLocale: PropTypes.func.isRequired,
      setTimezone: PropTypes.func.isRequired,
      setCurrency: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
    this.setLocaleSettings = this.setLocaleSettings.bind(this);
    this.getInitialValues = this.getInitialValues.bind(this);
    this.beforeSave = this.beforeSave.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  getInitialValues(settings) {
    const value = settings.length === 0 ? '' : settings[0].value;
    const defaultConfig = { locale: 'en-US', timezone: 'UTC', currency: 'USD' };
    let config;

    try {
      config = Object.assign({}, defaultConfig, JSON.parse(value));
    } catch (e) {
      config = defaultConfig;
    }

    return config;
  }

  setLocaleSettings(setting) {
    const localeValues = JSON.parse(setting.value);
    const { locale, timezone, currency } = localeValues;
    setTimeout(() => {
      if (locale) this.props.stripes.setLocale(locale);
      if (timezone) this.props.stripes.setTimezone(timezone);
      if (currency) this.props.stripes.setCurrency(currency);
    }, 2000);
  }

  // eslint-disable-next-line class-methods-use-this
  beforeSave(data) {
    const { locale, timezone, currency } = data;
    return JSON.stringify({ locale, timezone, currency });
  }

  render() {
    return (
      <this.configManager
        label={this.props.label}
        moduleName="ORG"
        getInitialValues={this.getInitialValues}
        configName="localeSettings"
        onBeforeSave={this.beforeSave}
        onAfterSave={this.setLocaleSettings}
      >
        <IfPermission perm="ui-developer.settings.locale">
          <Row>
            <Col xs={12}>
              <p>
                <FormattedMessage id="ui-tenant-settings.settings.locale.localeWarning" values={{ label: <FormattedMessage id="ui-tenant-settings.settings.locale.changeSessionLocale" /> }} />
              </p>
              <div>
                <Button to="/settings/developer/locale">
                  <FormattedMessage id="ui-tenant-settings.settings.locale.changeSessionLocale" />
                </Button>
              </div>
            </Col>
          </Row>
        </IfPermission>
        <Row>
          <Col xs={12} id="select-locale">
            <div>
              <FormattedMessage id="ui-tenant-settings.settings.localization" />
            </div>
            <br />
            <FormattedMessage id="ui-tenant-settings.settings.primaryCurrency">
              {label => (
                <Field
                  component={Select}
                  id="locale"
                  name="locale"
                  placeholder="---"
                  dataOptions={options}
                  aria-label={label}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-timezone">
            <div>
              <FormattedMessage id="ui-tenant-settings.settings.timeZonePicker" />
            </div>
            <br />
            <FormattedMessage id="ui-tenant-settings.settings.primaryCurrency">
              {label => (
                <Field
                  component={Select}
                  id="timezone"
                  name="timezone"
                  placeholder="---"
                  dataOptions={timeZonesList}
                  aria-label={label}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-currency">
            <div>
              <FormattedMessage id="ui-tenant-settings.settings.primaryCurrency" />
            </div>
            <br />
            <FormattedMessage id="ui-tenant-settings.settings.primaryCurrency">
              {label => (
                <Field
                  component={CurrencySelect}
                  id="currency"
                  name="currency"
                  placeholder="---"
                  aria-label={label}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
      </this.configManager>
    );
  }
}

export default Locale;
