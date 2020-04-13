import { map, omit } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { modules } from 'stripes-config'; // eslint-disable-line import/no-unresolved, import/no-extraneous-dependencies
import {
  Callout,
  Layout,
} from '@folio/stripes/components';
import PluginForm from './PluginForm';

class Plugins extends React.Component {
  static manifest = Object.freeze({
    recordId: {},
    settings: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=PLUGINS)',
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/%{recordId}',
      },
    },
  });

  static propTypes = {
    label: PropTypes.node.isRequired,
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      setSinglePlugin: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      settings: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      settings: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    const plugins = modules.plugin || [];
    this.pluginTypes = plugins.reduce((pt, plugin) => {
      const type = plugin.pluginType;
      // eslint-disable-next-line no-param-reassign
      pt[type] = pt[type] || [];
      pt[type].push(plugin);
      return pt;
    }, {});

    this.save = this.save.bind(this);
  }

  getPlugins() {
    const settings = ((this.props.resources.settings || {}).records || []);
    const pluginsByType = settings.reduce((memo, setting) => {
      // eslint-disable-next-line no-param-reassign
      memo[setting.configName] = setting;
      return memo;
    }, {});

    return map(this.pluginTypes, (types, key) => {
      const plugin = pluginsByType[key];
      return plugin || { configName: key };
    });
  }

  savePlugin(plugin) {
    const value = plugin.value;

    if (plugin.id) {
      // Setting has been set previously: replace it
      this.props.mutator.recordId.replace(plugin.id);
      this.props.mutator.settings.PUT(omit(plugin, ['metadata']));
    } else {
      // No setting: create a new one
      this.props.mutator.settings.POST({
        module: 'PLUGINS',
        configName: plugin.configName,
        value,
      });
    }

    this.props.stripes.setSinglePlugin(plugin.configName, value);
  }

  save(data) {
    data.plugins.forEach(p => this.savePlugin(p));
    const updateMsg = <FormattedMessage id="ui-tenant-settings.settings.updated" />;
    this.callout.sendCallout({ message: updateMsg });
  }

  render() {
    const plugins = this.getPlugins();
    return (
      <Layout className="full">
        <PluginForm
          onSubmit={this.save}
          label={this.props.label}
          pluginTypes={this.pluginTypes}
          initialValues={{ plugins }}
        />
        <Callout ref={(ref) => { this.callout = ref; }} />
      </Layout>
    );
  }
}

export default Plugins;
