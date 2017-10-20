import _ from 'lodash';
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

    this.renderComponent = this.renderComponent.bind(this);
    const plugins = modules.plugin || [];

    this.pluginTypes = plugins.reduce((pt, plugin) => {
      const type = plugin.pluginType;

      // eslint-disable-next-line no-param-reassign
      pt[type] = pt[type] || {
        component: props.stripes.connect(PluginType, { dataKey: type }),
        plugins: [],
      };

      pt[type].plugins.push(plugin);
      return pt;
    }, {});
  }

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <Row>
          <Col xs={12}>
            {
              _.map(this.pluginTypes, (pluginType, type) => (
                <pluginType.component
                  key={type}
                  pluginType={type}
                  stripes={this.props.stripes}
                  plugins={pluginType.plugins}
                />
              ))
            }
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default Plugins;
