import React from 'react';
import { omit } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Pane from '@folio/stripes-components/lib/Pane';
import TextArea from '@folio/stripes-components/lib/TextArea';
import Button from '@folio/stripes-components/lib/Button';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';


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
    const settings = (this.props.resources.bindings_setting || {}).records || [];

    this.changeSetting = this.changeSetting.bind(this);
    this.save = this.save.bind(this);

    this.state = {
      value: (settings.length === 0) ? '' : settings[0].value,
      error: undefined,
    };
  }

  changeSetting(e) {
    const value = e.target.value;
    this.setState({ value });

    let json;
    try {
      json = JSON.parse(value);
      this.setState({ error: undefined });
    } catch (error) {
      this.setState({ error: error.message });
      return;
    }

    this.context.stripes.setBindings(json);
    this.context.stripes.logger.log('action', 'updating bindings');
  }

  save() {
    const settings = (this.props.resources.bindings_setting || {}).records || [];
    const value = this.state.value;
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
  }

  render() {
    const bindingsSetting = this.props.resources.bindings_setting || {};
    const settings = bindingsSetting.records || [];
    const value = this.state.value;
    const prevValue = settings.length === 0 ? '' : settings[0].value;

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <Row>
          <Col xs={12}>
            <label htmlFor="setting"><FormattedMessage id="ui-organization.settings.keyBindings" /></label>
            <p>Provide bindings for {
              this.context.stripes.actionNames.map(name => <span key={name}><tt>{name}</tt>, </span>)
            }</p>
            <p>
              <a href="https://github.com/folio-org/ui-organization/blob/master/settings/example-key-bindings.json">[example]</a>
            </p>
            <br />
            <TextArea
              id="setting"
              value={value}
              fullWidth
              rows="12"
              onChange={this.changeSetting}
            />
            <p style={{ color: 'red' }}>{this.state.error || ''}</p>
          </Col>
        </Row>
        <Row end="xs">
          <Col>
            <Button onClick={this.save} disabled={!!this.state.error || bindingsSetting.isPending || value === prevValue}>Save</Button>
          </Col>
        </Row>
      </Pane>
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
