import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';
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
              // For now, show only the "find-user" plugin type, since we can't show multiple at once
              // We should be able to fix this properly once we have STRPCONN-8 or STRPCONN-1.
              Object.keys(pluginTypes).filter(type => type === 'find-user').map(type =>
                <this.connectedPluginType key={type} stripes={this.props.stripes} pluginType={type} plugins={pluginTypes[type]} />)
            }
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default Plugins;
