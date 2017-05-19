// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';
import Route from 'react-router-dom/Route';
import Link from 'react-router-dom/Link';
import Pluggable from '@folio/stripes-components/lib/Pluggable';
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
    label: PropTypes.string.isRequired,
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
    const sorted = modules.slice().sort((a, b) =>
      ((a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1));

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <Row>
          <Col xs={12}>
            <label htmlFor="setting">Back-end modules available</label>
            <ul>
              {
                sorted.map(m => (
                  <li key={m.id}>
                    <Link
                      key={m.route}
                      to={`${this.props.match.path}/${m.id}`}
                    >{m.name} (<tt>{m.id}</tt>)
                    </Link>
                  </li>),
                )
              }
            </ul>
          </Col>
        </Row>
        <Pluggable {...this.props} type="markdown-editor">
          <div style={{ background: 'red' }}>Markdown editor goes here</div>
        </Pluggable>
        <Route path={`${this.props.match.path}/:id`} component={this.connectedModule} />
      </Pane>
    );
  }
}

export default About;
