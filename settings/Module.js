// We have to remove node_modules/react to avoid having multiple copies loaded.
// eslint-disable-next-line import/no-unresolved
import React, { PropTypes } from 'react';

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
    let module = data.module;
    while (Array.isArray(module)) {
      module = module[0];
    }
    if (!module) return null;

    return (<div>
      <h2>{module.name} (<tt>{module.id}</tt>)</h2>
      <h3>Provides</h3>
      <ul>
        {
          (module.provides || []).map(p => (
            <li key={p.id}>{p.id} {p.version}</li>
          ))
        }
      </ul>
      <pre>{JSON.stringify(module, null, 2)}</pre>
    </div>);
  }
}

export default Module;
