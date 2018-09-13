import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import ConfigManager from '@folio/stripes-smart-components/lib/ConfigManager';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Select from '@folio/stripes-components/lib/Select';
import timezones from '../util/timezones';

const timeZonesList = timezones.map(timezone => (
  {
    value: timezone.value,
    label: timezone.value,
  }
));

const options = [
  { value: 'en-US', label: 'English - United States' },
  { value: 'en-GB', label: 'English - Great Britain' },
  { value: 'da-DK', label: 'Danish' },
  { value: 'de-DE', label: 'German - Germany' },
  { value: 'hu-HU', label: 'Hungarian' },
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
    }).isRequired,
    label: PropTypes.string.isRequired,
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
    const defaultConfig = { locale: 'en-US', timezone: 'UTC' };
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
    const { locale, timezone } = localeValues;
    setTimeout(() => {
      if (locale) this.props.stripes.setLocale(locale);
      if (timezone) this.props.stripes.setTimezone(timezone);
    }, 2000);
  }

  // eslint-disable-next-line class-methods-use-this
  beforeSave(data) {
    const { locale, timezone } = data;
    return JSON.stringify({ locale, timezone });
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
          <Col xs={12}>
            <div>
              <FormattedMessage id="ui-organization.settings.localization" />
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
          <Col xs={12}>
            <div>
              <FormattedMessage id="ui-organization.settings.timeZonePicker" />
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
      </this.configManager>
    );
  }
}

export default Locale;
