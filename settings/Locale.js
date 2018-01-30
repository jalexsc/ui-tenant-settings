import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import ConfigManager from '@folio/stripes-smart-components/lib/ConfigManager';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Select from '@folio/stripes-components/lib/Select';

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
    }).isRequired,
    label: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.configManager = props.stripes.connect(ConfigManager);
    this.setLocale = this.setLocale.bind(this);
  }

  setLocale(setting) {
    setTimeout(() => this.props.stripes.setLocale(setting.value), 2000);
  }

  render() {
    return (
      <this.configManager
        label={this.props.label}
        moduleName="ORG"
        configName="locale"
        onAfterSave={this.setLocale}
      >
        <Row>
          <Col xs={12}>
            <label htmlFor="setting">
              <FormattedMessage id="ui-organization.settings.localization" />
            </label>
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
      </this.configManager>
    );
  }
}

export default Locale;
