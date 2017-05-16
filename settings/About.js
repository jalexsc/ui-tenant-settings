// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';
import Select from '@folio/stripes-components/lib/Select';


class About extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      modules: PropTypes.arrayOf(
        PropTypes.object
      ),
    }).isRequired,
  };

  static manifest = Object.freeze({
    modules: {
      type: 'okapi',
      path: '_/proxy/modules?full=true'
    },
  });

  render() {
    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle="About">
        <Row>
          <Col xs={12}>
            <label htmlFor="setting">Back-end modules available</label>
        <ul>
        {
          (this.props.data.modules || []).map(m => <li key={m.id}><b>{m.id}</b> ({m.name})</li>)
        }
        </ul>
          </Col>
        </Row>
      </Pane>
    );
  }
}

export default About;
