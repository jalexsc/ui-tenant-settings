import React, { PropTypes } from 'react';
import { Row, Col } from 'react-bootstrap';
import Pane from '@folio/stripes-components/lib/Pane';
import TextField from '@folio/stripes-components/lib/TextField';

class SSOSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      logger: PropTypes.shape({
        log: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    label: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      recordId: PropTypes.shape({
        replace: PropTypes.func,
      }),
      setting: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }),
    }).isRequired,
  };

  static manifest = Object.freeze({
    recordId: {},
    setting: {
      type: 'okapi',
      records: 'configs',
      path: 'configurations/entries?query=(module==LOGIN-SAML and configName==saml and code==idp.url)',
      POST: {
        path: 'configurations/entries',
      },
      PUT: {
        path: 'configurations/entries/%{recordId}',
      },
    },
  });

  constructor(props) {
    super(props);
    this.changeSetting = this.changeSetting.bind(this);
  }

  changeSetting(e) {
    const value = e.target.value;
    this.props.stripes.logger.log('action', `changing SSO settings to ${value}`);
    const record = this.props.data.setting[0];
   
    if (record) {
      // Setting has been set previously: replace it
      this.props.mutator.recordId.replace(record.id);
      record.value = value;
      this.props.mutator.setting.PUT(record);
    } else {
      // No setting: create a new one
      this.props.mutator.setting.POST({
        module: 'LOGIN-SAML',
        configName: 'saml',
        code: 'idp.url',
        value,
      });
    }
   
  }

  render() {
    const settings = this.props.data.setting || [];
    const value = (settings.length === 0) ? '' : settings[0].value;

    return (
      <Pane defaultWidth="fill" fluidContentWidth paneTitle={this.props.label}>
        <Row>
          <Col xs={12}>
            <TextField
            placeholder="IdP URL"
            value={value}
            onChange={this.changeSetting}
            />
         </Col>
        </Row>
      </Pane>
    );
  }
}

export default SSOSettings;
