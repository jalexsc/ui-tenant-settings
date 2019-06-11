import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { ConfigManager } from '@folio/stripes/smart-components';
import { Col, Row, Select } from '@folio/stripes/components';
import timezones from '../util/timezones';
import currencies from '../util/currencies';

const timeZonesList = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

const options = [
  { value: 'ar-AR', label: 'Arabic' },
  { value: 'zh-CN', label: 'Chinese Simplified' },
  { value: 'da-DK', label: 'Danish' },
  { value: 'en-GB', label: 'English - Great Britain' },
  { value: 'en-SE', label: 'English - Sweden' },
  { value: 'en-US', label: 'English - United States' },
  { value: 'de-DE', label: 'German - Germany' },
  { value: 'hu-HU', label: 'Hungarian' },
  { value: 'it-IT', label: 'Italian - Italy' },
  { value: 'pt-BR', label: 'Portuguese - Brazil' },
  { value: 'pt-PT', label: 'Portuguese - Portugal' },
  { value: 'es', label: 'Spanish' },
  { value: 'es-419', label: 'Spanish - Latin America' },
  { value: 'es-ES', label: 'Spanish - Spain' },
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
        <Row>
          <Col xs={12} id="select-locale">
            <div>
              <FormattedMessage id="ui-tenant-settings.settings.localization" />
            </div>
            <br />
            <Field
              component={Select}
              id="locale"
              name="locale"
              placeholder="---"
              dataOptions={options}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-timezone">
            <div>
              <FormattedMessage id="ui-tenant-settings.settings.timeZonePicker" />
            </div>
            <br />
            <Field
              component={Select}
              id="timezone"
              name="timezone"
              placeholder="---"
              dataOptions={timeZonesList}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} id="select-currency">
            <div>
              <FormattedMessage id="ui-tenant-settings.settings.primaryCurrency" />
            </div>
            <br />
            <Field
              component={Select}
              id="currency"
              name="currency"
              placeholder="---"
              dataOptions={currencies}
            />
          </Col>
        </Row>
      </this.configManager>
    );
  }
}

export default Locale;
