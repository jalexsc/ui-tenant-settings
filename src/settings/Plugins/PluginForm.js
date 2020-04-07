import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  Pane,
  PaneFooter,
  Row,
  Select,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import styles from './Plugins.css';

class PluginForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    label: PropTypes.node,
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

    const footer = (
      <PaneFooter
        renderEnd={(
          <Button
            type="submit"
            disabled={(pristine || submitting)}
            buttonStyle="primary"
          >
            <FormattedMessage id="stripes-core.button.save" />
          </Button>
        )}
      />
    );

    return (
      <form
        id="plugin-form"
        onSubmit={handleSubmit}
        className={styles.pluginForm}
      >
        <Pane
          defaultWidth="fill"
          fluidContentWidth
          paneTitle={label}
          footer={footer}
        >
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
