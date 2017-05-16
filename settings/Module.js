// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';


class Module extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      module: PropTypes.array,
    }),
  };

  static manifest = Object.freeze({
    module: {
      type: 'okapi',
      path: '_/proxy/modules/:{id}',
    },
  });

  render() {
    const data = this.props.data || {};
    return <pre>[{JSON.stringify(data.module, null, 2)}]</pre>;
  }
}

export default Module;
