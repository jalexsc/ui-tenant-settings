import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import { modules } from 'stripes-loader'; // eslint-disable-line
import PluginType from './PluginType';

class Plugins extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedPluginType = props.stripes.connect(PluginType);
  }

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
                <this.connectedPluginType
                  key={type}
                  dataKey={type}
                  stripes={this.props.stripes}
                  pluginType={type}
                  plugins={pluginTypes[type]}
                />,
              )
            }
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default Plugins;
