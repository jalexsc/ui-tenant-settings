import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Pane, Row, Select } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { Field, FieldArray } from 'redux-form';

class PluginForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    label: PropTypes.string,
    pluginTypes: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.renderPlugins = this.renderPlugins.bind(this);
  }

  renderPlugin(field, plugin) {
    const pluginType = this.props.pluginTypes[plugin.configName];
    const options = [{
      module: '@@',
      displayName: '(none)',
    }].concat(pluginType).map(p => ({
      value: p.module,
      label: `${p.displayName}${p.version ? ` v${p.version}` : ''}`,
    }));

    return (
      <Row key={plugin.configName}>
        <Col xs={12}>
          <Field
            id={plugin.configName}
            label={plugin.configName}
            name={`${field}.value`}
            placeholder="---"
            component={Select}
            dataOptions={options}
          />
        </Col>
      </Row>
    );
  }

  renderPlugins({ fields }) {
    const plugins = fields.map((field, index) => (
      this.renderPlugin(field, fields.get(index))
    ));

    return (
      <div>{plugins}</div>
    );
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      label,
    } = this.props;

    const lastMenu = (<Button type="submit" disabled={(pristine || submitting)}>Save</Button>);

    return (
      <form id="plugin-form" onSubmit={handleSubmit}>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle={label} lastMenu={lastMenu}>
          <FieldArray name="plugins" component={this.renderPlugins} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'PluginForm',
  navigationCheck: true,
  enableReinitialize: true,
})(PluginForm);
