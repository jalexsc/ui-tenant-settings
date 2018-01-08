import React from 'react';
import { omit } from 'lodash';
import PropTypes from 'prop-types';
import Callout from '@folio/stripes-components/lib/Callout';

import BindingsForm from './BindingsForm';

class Bindings extends React.Component {
  static contextTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
      bindings: PropTypes.object,
    }).isRequired,
  };

  static propTypes = {
    resources: PropTypes.shape({
      bindings_setting: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      bindings_recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      bindings_setting: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
    label: PropTypes.string.isRequired,
  };

  static manifest = Object.freeze({
    bindings_recordId: {},
    bindings_setting: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module=ORG and configName=bindings)',
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/%{bindings_recordId}',
      },
    },
  });

  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
  }

  save(data) {
    const settings = (this.props.resources.bindings_setting || {}).records || [];
    const value = data.bindings;
    const record = settings[0];

    if (record) {
      // Setting has been set previously: replace it
      this.props.mutator.bindings_recordId.replace(record.id);
      record.value = value;
      this.props.mutator.bindings_setting.PUT(omit(record, ['metadata']));
    } else {
      // No setting: create a new one
      this.props.mutator.bindings_setting.POST({
        module: 'ORG',
        configName: 'bindings',
        value,
      });
    }

    this.context.stripes.setBindings(JSON.parse(value));
    this.context.stripes.logger.log('action', 'updating bindings');

    this.callout.sendCallout({ message: 'Setting was successfully updated.' });
  }

  render() {
    const bindingsSetting = this.props.resources.bindings_setting || {};
    const settings = bindingsSetting.records || [];
    const bindings = settings.length === 0 ? '' : settings[0].value;

    return (
      <div style={{ width: '100%' }}>
        <BindingsForm stripes={this.context.stripes} label={this.props.label} onSubmit={this.save} initialValues={{ bindings }} />
        <Callout ref={ref => (this.callout = ref)} />
      </div>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
class Wrapper extends React.Component {
  static propTypes = { stripes: PropTypes.shape({ connect: PropTypes.func.isRequired }).isRequired };
  constructor(props) { super(); this.connectedBindings = props.stripes.connect(Bindings); }
  shouldComponentUpdate() { return false; } // Needed to prevent redraw on every save
  render() { return <this.connectedBindings {...this.props} />; }
}


export default Wrapper;
