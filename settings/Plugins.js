// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';


class Plugins extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    plugins: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=ORG and config_name=settings)',
    },
  });

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <Row>
          <Col xs={12}>
            Plugin selection goes here
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default Plugins;
