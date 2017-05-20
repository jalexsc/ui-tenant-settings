// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import Select from '@folio/stripes-components/lib/Select';

class PluginType extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
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
    label: PropTypes.string.isRequired,
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
      path: 'configurations/entries?query=(module=PLUGINS and config_name=!{pluginType})',
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/${recordId}', // eslint-disable-line no-template-curly-in-string
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
        config_name: this.props.pluginType,
        value,
      });
    }
  }

  render() {
    const settings = this.props.data.setting || [];
    const value = (settings.length === 0) ? '' : settings[0].value;
    // return <pre>{JSON.stringify(this.props.plugins, null, 2)}</pre>;

    const options = this.props.plugins.map(p => ({
      value: p.module,
      label: `${p.displayName} v${p.version}`,
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
