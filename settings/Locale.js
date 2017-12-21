import React from 'react';
import { omit } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Pane from '@folio/stripes-components/lib/Pane';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Callout from '@folio/stripes-components/lib/Callout';

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
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      setLocale: PropTypes.func.isRequired,
    }).isRequired,
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
    label: PropTypes.string.isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    setting: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=ORG and configName=locale)',
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
    this.save = this.save.bind(this);
    this.state = { value: '' };
  }

  changeSetting(e) {
    const value = e.target.value;
    this.props.stripes.logger.log('action', `changing locale to ${value}`);
    this.setState({ value });
  }

  save() {
    const value = this.state.value;
    const settings = (this.props.resources.setting || {}).records || [];
    const record = settings[0];

    let promise;

    if (record) {
      // Setting has been set previously: replace it
      this.props.mutator.recordId.replace(record.id);
      record.value = value;
      promise = this.props.mutator.setting.PUT(omit(record, ['metadata']));
    } else {
      // No setting: create a new one
      promise = this.props.mutator.setting.POST({
        module: 'ORG',
        configName: 'locale',
        value,
      });
    }

    promise.then(() => {
      this.callout.sendCallout({ message: 'Setting was successfully updated.' });
      setTimeout(() => this.props.stripes.setLocale(value), 1000);
    });
  }

  render() {
    const localeSettings = this.props.resources.setting || {};
    const records = localeSettings.records || [];
    const prevValue = records.length === 0 ? '' : records[0].value;
    const value = this.state.value || prevValue;
    const lastMenu = (<Button onClick={this.save} disabled={!value || localeSettings.isPending || value === prevValue}>Save</Button>);

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label} lastMenu={lastMenu}>
        <Row>
          <Col xs={12}>
            <label htmlFor="setting"><FormattedMessage id="ui-organization.settings.localization" /></label>
            <br />
            <Select
              id="setting"
              placeholder="---"
              value={value}
              dataOptions={options}
              onChange={this.changeSetting}
            />
          </Col>
        </Row>
        <Callout ref={ref => (this.callout = ref)} />
      </Pane>
    );
  }
}

export default Locale;
