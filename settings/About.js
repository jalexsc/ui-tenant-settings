// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import Module from './Module';


class About extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    data: PropTypes.shape({
      modules: PropTypes.arrayOf(
        PropTypes.object,
      ),
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
  };

  static manifest = Object.freeze({
    modules: {
      type: 'okapi',
      path: '_/proxy/modules',
    },
  });

  constructor(props) {
    super(props);
    this.connectedModule = props.stripes.connect(Module);
  }

  render() {
    const modules = this.props.data.modules || [];

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle="About">
        <Row>
          <Col xs={12}>
            <label htmlFor="setting">Back-end modules available</label>
            <ul>
              {
                modules.map(m => (
                  <li key={m.id}>
                    <Link
                      key={m.route}
                      to={`${this.props.match.path}/${m.id}`}
                    ><b>{m.id}</b> ({m.name})
                    </Link>
                  </li>),
                )
              }
            </ul>
          </Col>
        </Row>
        <Route path={`${this.props.match.path}/:id`} component={this.connectedModule} />
      </Pane>
    );
  }
}

export default About;
