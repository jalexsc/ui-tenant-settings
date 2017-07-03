import React, { PropTypes } from 'react';
import Select from '@folio/stripes-components/lib/Select';

class PluginType extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      setSinglePlugin: PropTypes.func.isRequired,
    }).isRequired,
    data: PropTypes.object.isRequired,
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
  }

  changeSetting(e) {
    const value = e.target.value;
    this.props.stripes.logger.log('action', `changing preferred '${this.props.pluginType}' plugin to ${value}`);
    const record = this.props.data.setting[0];

    if (record) {
      // Setting has been set previously: replace it
      this.props.mutator.recordId.replace(record.id);
      record.value = value;
      this.props.mutator.setting.PUT(record);
    } else {
      // No setting: create a new one
      this.props.mutator.setting.POST({
        module: 'PLUGINS',
        configName: this.props.pluginType,
        value,
      });
    }

    this.props.stripes.setSinglePlugin(this.props.pluginType, value);
  }

  render() {
    const settings = this.props.data.setting || [];
    const value = (settings.length === 0) ? '' : settings[0].value;

    const options = [{
      module: '@@',
      displayName: '(none)',
    }].concat(this.props.plugins).map(p => ({
      value: p.module,
      label: `${p.displayName}${p.version ? ` v${p.version}` : ''}`,
    }));

    return (
      <div>
        <b>{this.props.pluginType}</b>
        &nbsp;
        <Select
          id={this.props.pluginType}
          placeholder="---"
          value={value}
          dataOptions={options}
          onChange={this.changeSetting}
        />
      </div>
    );
  }
}

export default PluginType;
