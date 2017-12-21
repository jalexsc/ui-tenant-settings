import { omit } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Select from '@folio/stripes-components/lib/Select';
import Button from '@folio/stripes-components/lib/Button';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Callout from '@folio/stripes-components/lib/Callout';

class PluginType extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      setSinglePlugin: PropTypes.func.isRequired,
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
    pluginType: PropTypes.string.isRequired,
    plugins: PropTypes.arrayOf(
      PropTypes.shape({}),
    ).isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    setting: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=PLUGINS and configName=!{pluginType})',
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
    this.props.stripes.logger.log('action', `changing preferred '${this.props.pluginType}' plugin to ${value}`);
    this.setState({ value });
  }

  save() {
    const value = this.state.value;
    const settings = (this.props.resources.setting || {}).records || [];
    const record = settings[0];

    if (record) {
      // Setting has been set previously: replace it
      this.props.mutator.recordId.replace(record.id);
      record.value = value;
      this.props.mutator.setting.PUT(omit(record, ['metadata']));
    } else {
      // No setting: create a new one
      this.props.mutator.setting.POST({
        module: 'PLUGINS',
        configName: this.props.pluginType,
        value,
      });
    }

    this.props.stripes.setSinglePlugin(this.props.pluginType, value);
    this.callout.sendCallout({ message: 'Setting was successfully updated.' });
  }

  render() {
    const pluginSetting = this.props.resources.setting || {};
    const settings = pluginSetting.records || [];
    const prevValue = settings.length === 0 ? '' : settings[0].value;
    const value = this.state.value || prevValue;

    const options = [{
      module: '@@',
      displayName: '(none)',
    }].concat(this.props.plugins).map(p => ({
      value: p.module,
      label: `${p.displayName}${p.version ? ` v${p.version}` : ''}`,
    }));

    return (
      <div>
        <Row>
          <Col xs={12}>
            <label htmlFor={this.props.pluginType}>{this.props.pluginType}</label>
            <br />
            <Select
              id={this.props.pluginType}
              placeholder="---"
              value={value}
              dataOptions={options}
              onChange={this.changeSetting}
            />
          </Col>
        </Row>
        <Row end="xs">
          <Col>
            <Button onClick={this.save} disabled={!value || pluginSetting.isPending || prevValue === value}>Save</Button>
          </Col>
        </Row>
        <Callout ref={(ref) => { this.callout = ref; }} />
      </div>
    );
  }
}

export default PluginType;
