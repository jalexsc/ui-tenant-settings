// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';
import { modules } from 'stripes-loader'; // eslint-disable-line
import PluginType from './PluginType';

class Plugins extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    plugins: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=PLUGINS and config_name=markdown-editor)',
    },
  });

  render() {
    const plugins = modules.plugin || [];
    const pluginTypes = {};

    for (const name of Object.keys(plugins)) {
      const m = plugins[name];
      const type = m.pluginType;
      if (!pluginTypes[type]) pluginTypes[type] = [];
      pluginTypes[type].push(m);
    }

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <Row>
          <Col xs={12}>
            {
              Object.keys(pluginTypes).map(type =>
                <PluginType {...this.props} key={type} pluginType={type} plugins={pluginTypes[type]} />)
            }
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default Plugins;
